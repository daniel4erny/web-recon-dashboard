import asyncio
import socket
import json
import time
import os
from datetime import datetime
from typing import List, Dict, Optional
from urllib.parse import urlparse
from dotenv import load_dotenv

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

# --- KONFIGURACE ---
load_dotenv()
API_KEY = os.getenv("API_KEY")

try:
    from ports import returnPorts
    from word_list import returnWordList
    PORTS = returnPorts()
    WORDS = returnWordList()
except ImportError:
    PORTS = [80, 443, 8080]
    WORDS = ["admin", "login", "api", "v1", ".env", "config"]

# --- MODELY ---

class ScanRequest(BaseModel):
    key: str = None
    target: str 

# --- POMOCNÉ FUNKCE ---

def ziskej_cisteho_hosta(raw_target: str) -> str:
    if "://" not in raw_target:
        raw_target = "http://" + raw_target
    parsed = urlparse(raw_target)
    return parsed.hostname or parsed.path

async def check_port(ip: str, port: int, semaphore: asyncio.Semaphore) -> Optional[dict]:
    async with semaphore:
        try:
            future = asyncio.open_connection(ip, port)
            reader, writer = await asyncio.wait_for(future, timeout=1.5)
            
            try:
                service = socket.getservbyport(port, "tcp")
            except:
                service = "unknown"

            writer.close()
            await writer.wait_closed()

            return {
                "type": "port",
                "port": port,
                "status": "open",
                "service": service,
                "scan_time": datetime.now().isoformat()
            }
        except:
            return None

async def check_endpoint(client: httpx.AsyncClient, base_url: str, word: str, semaphore: asyncio.Semaphore) -> Optional[dict]:
    async with semaphore:
        url = f"{base_url}/{word}"
        start_time = time.perf_counter()
        try:
            # Používáme GET, abysme dostali i velikost zprávy
            response = await client.get(url, timeout=2.0, follow_redirects=True)
            elapsed = round((time.perf_counter() - start_time) * 1000, 2)
            
            return {
                "type": "endpoint",
                "word": word,
                "url": str(response.url),
                "code": response.status_code,
                "messageSize": len(response.content),
                "response_time": elapsed
            }
        except:
            return None

async def combined_scanner(target_host: str):
    """
    Hlavní generátor: Porty -> Endpoints
    """
    try:
        ip = socket.gethostbyname(target_host)
    except socket.gaierror:
        yield json.dumps({"error": f"Nelze přeložit doménu {target_host}"}) + "\n"
        return

    # --- FÁZE 1: PORT SCAN ---
    yield json.dumps({"info": f"FÁZE 1: Skenuji porty na {target_host} ({ip})..."}) + "\n"
    
    port_semaphore = asyncio.Semaphore(100)
    tasks = [check_port(ip, p, port_semaphore) for p in PORTS]
    open_ports = []

    completed = 0
    for future in asyncio.as_completed(tasks):
        result = await future
        completed += 1
        if result:
            open_ports.append(result["port"])
            yield json.dumps(result) + "\n"
        
        if completed % 10 == 0 or completed == len(PORTS):
            yield json.dumps({"progress_ports": f"{round((completed/len(PORTS))*100, 1)}%"}) + "\n"

    # --- FÁZE 2: ENDPOINT SCAN ---
    # Vybereme protokol (zkusíme HTTPS, pak HTTP)
    protocol = "https" if 443 in open_ports else "http"
    base_url = f"{protocol}://{target_host}"
    
    yield json.dumps({"info": f"FÁZE 2: Skenuji endpointy na {base_url}..."}) + "\n"

    endpoint_semaphore = asyncio.Semaphore(20) # Méně agresivní pro HTTP
    async with httpx.AsyncClient(verify=False) as client:
        endpoint_tasks = [check_endpoint(client, base_url, word, endpoint_semaphore) for word in WORDS]
        
        done = 0
        for future in asyncio.as_completed(endpoint_tasks):
            result = await future
            done += 1
            if result:
                if result["code"] != 404:
                    yield json.dumps(result) + "\n"
            
            if done % 5 == 0 or done == len(WORDS):
                yield json.dumps({"progress_endpoints": f"{round((done/len(WORDS))*100, 1)}%"}) + "\n"

    yield json.dumps({"info": "Kompletní skenování dokončeno."}) + "\n"

# --- APLIKACE ---

app = FastAPI()

@app.post("/")
async def scanner(request: ScanRequest):
    if request.key:
        req_key = str(request.key)
    else:
        req_key = "like not there litterally"


    if req_key == API_KEY: 
        clean_target = ziskej_cisteho_hosta(request.target)
        if not clean_target:
            raise HTTPException(status_code=400, detail="Neplatný cíl.")

        return StreamingResponse(
            combined_scanner(clean_target),
            media_type="application/x-ndjson"
        )
    else:
        return("fuh u")

@app.get("/")
def test():
    return {"status": "Server běží", "ports_to_scan": len(PORTS), "words_to_scan": len(WORDS)}

@app.head("/")  # <--- Tohle přidej, aby Render dostal 200 OK
def test():
    return {
        "status": "Server běží",
        "loaded_ports_count": len(PORTS)
    }
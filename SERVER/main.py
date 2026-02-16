# BACKBONE OF THE API
import asyncio
import socket
import json
from datetime import datetime
from typing import List, Dict, Optional
from urllib.parse import urlparse

from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

# --- KONFIGURACE ---
try:
    from ports import returnPorts
    PORTS = returnPorts()
    # Zajistíme, že PORTS je list intů
    if not isinstance(PORTS, list):
        if isinstance(PORTS, str):
             PORTS = [int(p.strip()) for p in PORTS.split(',') if p.strip().isdigit()]
        else:
             PORTS = []
except ImportError:
    print("VAROVÁNÍ: Modul 'ports' nenalezen. Používám defaultní hodnoty.")
    PORTS = [21, 22, 80, 443, 8080]

# --- MODELY ---

class ScanRequest(BaseModel):
    target: str 

class PortStats(BaseModel):
    port: int
    protocol: str = "TCP"
    status: str
    banner: Optional[str] = None
    service: Optional[str] = None
    version: Optional[str] = None
    scan_time: str

# --- POMOCNÉ FUNKCE ---

def ziskej_cisteho_hosta(raw_target: str) -> str:
    """
    Převede 'https://site.com/admin' -> 'site.com'
    """
    if "://" not in raw_target:
        raw_target = "http://" + raw_target
    
    parsed = urlparse(raw_target)
    return parsed.hostname or parsed.path

async def check_port(ip: str, port: int, semaphore: asyncio.Semaphore) -> Optional[dict]:
    async with semaphore:
        try:
            future = asyncio.open_connection(ip, port)
            reader, writer = await asyncio.wait_for(future, timeout=1.0)
            
            # Pokud se připojíme, port je otevřený
            # Zkusíme přečíst banner
            banner = None
            try:
                # Malý trik: někdy server pošle banner hned, někdy čeká na input.
                # Zkusíme krátce počkat na data.
                data = await asyncio.wait_for(reader.read(1024), timeout=0.5)
                if data:
                    banner = data.decode('utf-8', errors='ignore').strip()
            except asyncio.TimeoutError:
                pass
            except Exception:
                pass

            # Získáme název služby (synchronní volání, ale rychlé)
            try:
                service = socket.getservbyport(port, "tcp")
            except:
                service = "unknown"

            writer.close()
            try:
                await writer.wait_closed()
            except Exception:
                pass

            return {
                "port": port,
                "protocol": "TCP",
                "status": "open",
                "banner": banner,
                "service": service,
                "scan_time": datetime.now().isoformat()
            }
        except (asyncio.TimeoutError, ConnectionRefusedError, OSError):
            return None
        except Exception as e:
            return None

async def scan_generator(target_host: str, ports: List[int]):
    """
    Skenuje porty a yieldue výsledky jako NDJSON řádky.
    """
    # Resolvujeme hostname na IP (synchronně, blokující, ale max jednou na request)
    try:
        ip = socket.gethostbyname(target_host)
    except socket.gaierror:
        yield json.dumps({"error": f"Nelze přeložit doménu {target_host}"}) + "\n"
        return

    yield json.dumps({"info": f"Skenuji {target_host} ({ip})..."}) + "\n"

    semaphore = asyncio.Semaphore(100) # Max 100 souběžných spojení
    
    # Vytvoříme tasks
    # Vytvoříme tasks
    tasks = [check_port(ip, p, semaphore) for p in ports]
    total_ports = len(tasks)
    completed_count = 0
    
    # Použijeme as_completed pro streamování výsledků ihned jak jsou hotové
    for future in asyncio.as_completed(tasks):
        result = await future
        completed_count += 1
        
        # Každých 10 portů nebo při dokončení pošleme progress
        if completed_count % 10 == 0 or completed_count == total_ports:
            progress = round((completed_count / total_ports) * 100, 2)
            yield json.dumps({"progress": progress + "%"}) + "\n"

        if result:
            yield json.dumps(result) + "\n"

    yield json.dumps({"info": "Skenování dokončeno."}) + "\n"

# --- APLIKACE ---

app = FastAPI()

@app.post("/")
async def scanner(request: ScanRequest):
    clean_target = ziskej_cisteho_hosta(request.target)
    if not clean_target:
        raise HTTPException(status_code=400, detail="Neplatný cíl.")

    return StreamingResponse(
        scan_generator(clean_target, PORTS),
        media_type="application/x-ndjson"
    )

@app.get("/")
def test():
    return {
        "status": "Server běží",
        "loaded_ports_count": len(PORTS)
    }
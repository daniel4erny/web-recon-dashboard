# BACKBONE OF THE API
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import socket
from typing import List, Dict, Optional
from datetime import datetime
from urllib.parse import urlparse # Pro čištění URL

# Import vlastních modulů (předpokládám, že soubory existují)
try:
    from ports import returnPorts
    from word_list import returnWordList
except ImportError:
    # Fallback pro případ, že soubory chybí, aby server nespadl při testu
    print("VAROVÁNÍ: Moduly 'ports' nebo 'word_list' nenalezeny. Používám defaultní hodnoty.")
    def returnPorts(): return "21,22,80,443,8080"
    def returnWordList(): return ["admin", "login", "test"]

# Inicializace Nmapu a načtení konfigurace
PORTS = returnPorts()
WORD_LIST = returnWordList()

# FastAPI init
app = FastAPI()

# --- MODELY ---

class ScanRequest(BaseModel):
    # Přejmenoval jsem na 'target', protože to může být IP i doména
    target: str 

class PortStats(BaseModel):
    protocol: str = "TCP"  # Výchozí hodnota
    status: str
    banner: Optional[str] = None
    service: Optional[str] = None  # např. "http", "ssh"
    version: Optional[str] = None  # např. "OpenSSH 8.2"
    scan_time: datetime

class ScanResponse(BaseModel):
    target: str
    info: str
    ports: Dict[int, PortStats] 
    endpoints: List[str]


# --- POMOCNÉ FUNKCE ---
def ziskej_cisteho_hosta(raw_target: str) -> str:
    """
    Převede 'https://site.com/admin' -> 'site.com'
    Převede '192.168.1.1' -> '192.168.1.1'
    """
    # Pokud chybí schéma, urlparse nefunguje správně, přidáme http://
    if "://" not in raw_target:
        raw_target = "http://" + raw_target
    
    parsed = urlparse(raw_target)
    # Vrátí hostname (doménu nebo IP) bez cesty a portu
    return parsed.hostname or parsed.path

def scan_to_dict(ip: str, ports_to_scan: list[int]) -> Dict[int, PortStats]:
    ports_results = {}
    
    for port in ports_to_scan:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(0.5)
            # connect_ex vrací 0 pokud je port otevřený
            result = s.connect_ex((ip, port))
            
            if result == 0:
                # 1. Získání banneru
                banner = None
                try:
                    banner_raw = s.recv(1024)
                    if banner_raw:
                        banner = banner_raw.decode('utf-8', errors='ignore').strip()
                except socket.timeout:
                    banner = "Timeout (No banner)"
                except Exception:
                    banner = "Error reading banner"

                # 2. Získání názvu služby
                try:
                    service = socket.getservbyport(port, "tcp")
                except:
                    service = "unknown"

                # 3. Vytvoření objektu a uložení do dictu pod klíčem portu
                ports_results[port] = PortStats(
                    status="open",
                    banner=banner,
                    service=service,
                    scan_time=datetime.now()
                )
            else:
                # Volitelně můžeš ukládat i zavřené porty, 
                # ale u scraperů se většinou ukládají jen ty otevřené.
                pass
                
    return ports_results




    pass


@app.post("/", response_model=ScanResponse)
def scanner(request: ScanRequest):
    
    # 1. Očištění vstupu (z URL na Hostname/IP)
    clean_target = ziskej_cisteho_hosta(request.target)
    
    if not clean_target:
        raise HTTPException(status_code=400, detail="Neplatný cíl (URL/IP).")

    # 2. Spuštění scanu
    # (Tady bys v budoucnu mohl přidat i logiku pro endpoints/wordlist)
    scan_data = scan_to_dict(clean_target)
    
    nalezené_cesty = ["/admin", "/login"] # Zatím hardcoded demo

    # 3. Sestavení odpovědi
    return ScanResponse(
        target=clean_target,
        info=f"Sken dokončen pro {clean_target}",
        ports=scan_data,  # Předáváme slovník, FastAPI ho převede na JSON
        endpoints=nalezené_cesty
    )

@app.get("/")
def test():
    return {
        "status": "Server běží",
        "loaded_ports": PORTS,
        "loaded_words_count": len(WORD_LIST) if isinstance(WORD_LIST, list) else "N/A"
    }
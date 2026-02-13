# BACKBONE OF THE API
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import nmap
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
NM = nmap.PortScanner()
PORTS = returnPorts()
WORD_LIST = returnWordList()

# FastAPI init
app = FastAPI()

# --- MODELY ---

class ScanRequest(BaseModel):
    # Přejmenoval jsem na 'target', protože to může být IP i doména
    target: str 

class ScanResponse(BaseModel):
    target: str
    info: str
    # Změněno na Dict - Pydantic očekává objekt, ne string z json.dumps
    ports: Dict[str, Any] 
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

def run_nmap_scan(host: str, ports: str) -> Dict:
    try:
        # PŘIDÁNO: '-Pn' (Treat all hosts as online -- skip host discovery)
        # PŘIDÁNO: '-F' (Fast mode - pokud máš hodně portů, urychlí to test)
        NM.scan(hosts=host, ports=ports, arguments='-Pn -sV')
        
        if host in NM.all_hosts():
            return NM[host]
        else:
            # Pokud i s -Pn nic nevrátí, může být problém v síti nebo právech
            return {"status": "error", "message": f"Nmap nenašel žádná data pro {host}."}
    except Exception as e:
        return {"error": str(e)}

# --- ENDPOINTY ---

# Důležité: Používám 'def' místo 'async def'. 
# FastAPI automaticky hodí tuto funkci do threadpoolu, 
# takže dlouhý Nmap scan nezablokuje celý server.
@app.post("/", response_model=ScanResponse)
def scanner(request: ScanRequest):
    
    # 1. Očištění vstupu (z URL na Hostname/IP)
    clean_target = ziskej_cisteho_hosta(request.target)
    
    if not clean_target:
        raise HTTPException(status_code=400, detail="Neplatný cíl (URL/IP).")

    # 2. Spuštění scanu
    # (Tady bys v budoucnu mohl přidat i logiku pro endpoints/wordlist)
    scan_data = run_nmap_scan(clean_target, PORTS)
    
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
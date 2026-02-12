#BACKBONE OF THE API
from fastapi import FastAPI
#this is used for easier work with classes
from pydantic import BaseModel
#typing with list (used in class)
from typing import List

#fastAPI init
app = FastAPI()

#Here we define class for req with base model
class ScanRequest(BaseModel):
    ip: str

#Here we define class for response, first I will do ports and then endpoints
class ScanResponse(BaseModel):
    info: str
    ports: List[int]
    endpoints: List[str]

def scanPorts(ip):
    


#MAIN PART-------------------------------------------------------------------------------
@app.post("/")
async def scanner(request: ScanRequest):
    # 1. Tady proběhne tvoje logika (např. skenování IP)
    vysledky_portu = [80, 443, 8080]
    nalezené_cesty = ["/admin", "/login"]
    
    # 2. Vytvoříš instanci třídy ScanResponse s daty
    moje_odpoved = ScanResponse(
        info=f"Sken dokončen pro {request.ip}",
        ports=vysledky_portu,
        endpoints=nalezené_cesty
    )
    
    # 3. Vrátíš celou instanci. FastAPI ji automaticky zkonvertuje na JSON.
    return moje_odpoved
#----------------------------------------------------------------------------------------
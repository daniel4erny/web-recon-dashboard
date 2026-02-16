import requests
import json
import sys

def verify_scan():
    url = "http://localhost:8000/"
    payload = {"target": "scanme.nmap.org"}
    
    print(f"Sending scan request to {url} with payload {payload}...")
    
    try:
        with requests.post(url, json=payload, stream=True) as r:
            r.raise_for_status()
            print("Response received, reading stream...")
            
            progress_seen = False
            last_progress = 0.0
            
            for line in r.iter_lines():
                if line:
                    try:
                        data = json.loads(line)
                        if "progress" in data:
                            progress = data["progress"]
                            print(f"Progress: {progress}%")
                            if progress < last_progress:
                                print(f"ERROR: Progress went backwards! {last_progress} -> {progress}")
                                sys.exit(1)
                            last_progress = progress
                            progress_seen = True
                        elif "info" in data:
                            print(f"Info: {data['info']}")
                        elif "port" in data:
                            print(f"Port found: {data['port']}")
                        elif "error" in data:
                            print(f"Error: {data['error']}")
                            
                    except json.JSONDecodeError:
                        print(f"Failed to decode line: {line}")
            
            if not progress_seen:
                print("ERROR: No progress messages received!")
                sys.exit(1)
                
            print("Verification successful! Progress messages received and ordered correctly.")
            
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    verify_scan()

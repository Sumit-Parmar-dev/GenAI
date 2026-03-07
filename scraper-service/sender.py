import os
import requests
from dotenv import load_dotenv

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL", "http://backend:5000/api/leads")
SCRAPER_API_KEY = os.getenv("SCRAPER_API_KEY", "super-secret-scraper-key-2026")

def send_leads(leads):
    """Send a list of leads to the backend API"""
    if not leads:
        print("[Sender] No leads to send.")
        return

    headers = {
        "X-Scraper-Key": SCRAPER_API_KEY,
        "Content-Type": "application/json"
    }

    try:
        print(f"[Sender] Sending {len(leads)} leads to {BACKEND_URL}...")
        # Increased timeout to 60s because backend processes leads one by one with AI enrichment
        response = requests.post(BACKEND_URL, json=leads, headers=headers, timeout=60)
        
        if response.status_code in [200, 201]:
            print(f"[Sender] Success: {response.json()}")
        else:
            print(f"[Sender] Failed ({response.status_code}): {response.text}")
    except Exception as e:
        print(f"[Sender] Error connecting to backend: {e}")

if __name__ == "__main__":
    # Test send
    test_lead = [{"name": "Test Lead", "company": "Test Co", "source": "Scraper Test"}]
    send_leads(test_lead)

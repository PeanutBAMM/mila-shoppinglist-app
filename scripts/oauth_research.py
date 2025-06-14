import json
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
import requests

def create_ios_oauth_client():
    # Service account path
    sa_path = os.path.join(os.path.dirname(__file__), '..', 'mcp-extensions', 'google-cloud-mcp-extended', 'service-account.json')
    
    # Load service account
    with open(sa_path, 'r') as f:
        sa_info = json.load(f)
    
    project_id = sa_info['project_id']
    
    # Create credentials
    credentials = service_account.Credentials.from_service_account_file(
        sa_path,
        scopes=[
            'https://www.googleapis.com/auth/cloud-platform',
            'https://www.googleapis.com/auth/cloudplatformprojects'
        ]
    )
    
    print(f"🔍 Project ID: {project_id}")
    
    # Try to use undocumented endpoints
    # This is what the Google Cloud Console uses internally
    access_token = credentials.token
    if not access_token:
        credentials.refresh(requests.Request())
        access_token = credentials.token
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json',
    }
    
    # The Console uses these internal endpoints
    console_base = 'https://console.cloud.google.com'
    
    # Unfortunately, after research, Google intentionally does NOT expose
    # OAuth client creation via any public API for security reasons
    
    print("\n❌ Resultaat van onderzoek:")
    print("   Google staat GEEN programmatische creatie van OAuth clients toe")
    print("   Dit is een bewuste security beslissing van Google")
    print("\n🔒 Redenen:")
    print("   1. OAuth clients hebben toegang tot gebruikersdata")
    print("   2. Handmatige review voorkomt misbruik")
    print("   3. Console UI forceert menselijke verificatie")
    
    print("\n✅ Wat WEL kan:")
    print("   - IAP OAuth clients (voor Identity-Aware Proxy)")
    print("   - Service accounts aanmaken")
    print("   - API keys genereren")
    print("   - Maar NIET: reguliere OAuth clients voor apps")
    
    print("\n📱 iOS OAuth Client - Handmatige stappen:")
    print(f"\n1. Open: https://console.cloud.google.com/apis/credentials/oauthclient?project={project_id}")
    print("2. Vul in:")
    print("   - Application type: iOS")
    print("   - Name: Mila iOS Client")
    print("   - Bundle ID: com.peanutventures.mila")
    print("3. Klik Create")
    print("4. Kopieer de Client ID")
    print("\n⏱️ Tijdsduur: ongeveer 30 seconden")

if __name__ == "__main__":
    create_ios_oauth_client()

import os
import requests
from dotenv import load_dotenv

load_dotenv()

def test_jira_connection():
    jira_url = os.getenv("JIRA_URL")
    email = os.getenv("JIRA_EMAIL")
    token = os.getenv("JIRA_API_TOKEN")

    if not all([jira_url, email, token]):
        print("❌ Missing Jira credentials in .env")
        return

    # Basic API call to get current user to verify credentials
    url = f"{jira_url.rstrip('/')}/rest/api/3/myself"
    response = requests.get(url, auth=(email, token))

    if response.status_code == 200:
        print(f"✅ Successfully connected to Jira API as {response.json().get('displayName')}")
    else:
        print(f"❌ Failed to connect to Jira API. Status: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    test_jira_connection()

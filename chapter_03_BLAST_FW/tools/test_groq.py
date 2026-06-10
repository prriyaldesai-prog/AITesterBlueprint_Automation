import os
import requests
from dotenv import load_dotenv

load_dotenv()

def test_groq_connection():
    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        print("❌ Missing Groq API Key in .env")
        return

    url = "https://api.groq.com/openai/v1/models"
    headers = {
        "Authorization": f"Bearer {api_key}"
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        print("✅ Successfully connected to Groq API. Models available.")
    else:
        print(f"❌ Failed to connect to Groq API. Status: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    test_groq_connection()

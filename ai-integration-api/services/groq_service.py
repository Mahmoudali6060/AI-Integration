import os
import requests
from deep_translator import GoogleTranslator
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def translate_to_arabic(text: str) -> str:
    try:
        return GoogleTranslator(source='en', target='ar').translate(text)
    except Exception as e:
        return f"❌ Translation Error: {str(e)}"

def analyze_prompt(prompt: str):
    try:
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "llama3-8b-8192",
            "messages": [
                {"role": "system", "content": "Extract financial data and calculate ROI, Net Profit, and Payback Period."},
                {"role": "user", "content": prompt}
            ]
        }

        response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
        data = response.json()

        result = data["choices"][0]["message"]["content"]
        translation = translate_to_arabic(result)

        return {
            "result_en": result,
            "result_ar": translation
        }

    except Exception as e:
        return {"error": str(e)}

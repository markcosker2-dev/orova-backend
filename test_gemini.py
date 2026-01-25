import os
import google.generativeai as genai

# Test if API key is accessible
api_key = os.environ.get("GEMINI_API_KEY")
print(f"API Key found: {'Yes' if api_key else 'No'}")
if api_key:
    print(f"API Key starts with: {api_key[:20]}...")

# Test Gemini API
try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Say 'Hello, OROVA!' if you can hear me.")
    print("\n✓ Gemini API is working!")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"\n✗ Gemini API error: {type(e).__name__}: {str(e)}")

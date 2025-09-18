from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import requests
# import language_tool_python
from transformers import pipeline
from supabase import create_client, Client
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build

load_dotenv()

app = FastAPI(title="Witai API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
# tool = language_tool_python.LanguageTool('en-US')  # Requires Java
rewriter = pipeline("text2text-generation", model="t5-small")

class TextRequest(BaseModel):
    text: str
    user_id: str = None

class ChatRequest(BaseModel):
    message: str
    user_id: str = None

@app.post("/autocorrect")
async def autocorrect_text(request: TextRequest):
    try:
        # Simple autocorrect using basic rules (Java-free alternative)
        import re
        text = request.text
        # Basic corrections
        corrections = {
            r'\bi\b': 'I',
            r'\bteh\b': 'the',
            r'\brecieve\b': 'receive',
            r'\boccur\b': 'occur'
        }
        corrected = text
        for pattern, replacement in corrections.items():
            corrected = re.sub(pattern, replacement, corrected, flags=re.IGNORECASE)
        return {"original": request.text, "corrected": corrected}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rewrite")
async def rewrite_text(request: TextRequest):
    try:
        result = rewriter(f"paraphrase: {request.text}", max_length=len(request.text.split()) * 2)
        return {"original": request.text, "rewritten": result[0]['generated_text']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chatbot")
async def chatbot_interaction(request: ChatRequest):
    try:
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{
                "parts": [{"text": f"You are Witai, a writing assistant with knowledge of writing lore and techniques. {request.message}"}]
            }]
        }
        
        response = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={os.getenv('GEMINI_API_KEY')}",
            headers=headers,
            json=payload
        )
        
        if response.status_code == 200:
            data = response.json()
            return {"response": data["candidates"][0]["content"]["parts"][0]["text"]}
        else:
            raise HTTPException(status_code=500, detail="Gemini API error")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-next")
async def predict_next_words(request: TextRequest):
    try:
        # Simple prediction using T5 model
        prompt = f"continue this text in the same tone: {request.text}"
        result = rewriter(prompt, max_length=100, num_return_sequences=1)
        return {"original": request.text, "prediction": result[0]['generated_text']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/drive-auth")
async def google_drive_auth():
    try:
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": os.getenv("GOOGLE_CLIENT_ID"),
                    "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [os.getenv("GOOGLE_REDIRECT_URI")]
                }
            },
            scopes=['https://www.googleapis.com/auth/drive.readonly']
        )
        flow.redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
        
        auth_url, _ = flow.authorization_url(prompt='consent')
        return {"auth_url": auth_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/drive-files")
async def get_drive_files(access_token: str):
    try:
        creds = Credentials(token=access_token)
        service = build('drive', 'v3', credentials=creds)
        
        results = service.files().list(pageSize=10, fields="files(id, name, mimeType)").execute()
        files = results.get('files', [])
        
        return {"files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
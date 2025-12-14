import os
from pathlib import Path

import google.generativeai as genai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.models.schemas import AnalysisRequest, AnalysisResponse


# ======================================================
# 1. Load environment variables
# ======================================================
backend_dir = Path(__file__).parent.parent
env_path = backend_dir / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GEMINI_API_KEY")

FLASH_MODEL_NAME = None

if not api_key:
    print("⚠️ WARNING: GEMINI_API_KEY not found in .env file!")
else:
    try:
        genai.configure(api_key=api_key)

        def get_flash_model():
            """Find first Flash model that supports generateContent."""
            for m in genai.list_models():
                if "generateContent" in m.supported_generation_methods:
                    if "flash" in m.name.lower():
                        return m.name
            return None

        FLASH_MODEL_NAME = get_flash_model()

    except Exception as e:
        print(f"⚠️ API Configuration Warning: {e}. Using fallback Flash model.")


# ======================================================
# 2. Fallback (guaranteed working)
# ======================================================
if not FLASH_MODEL_NAME:
    FLASH_MODEL_NAME = "models/gemini-1.5-flash-001"

print(f"✅ Gemini Flash model resolved: {FLASH_MODEL_NAME}")


# ======================================================
# 3. FastAPI App Setup
# ======================================================
app = FastAPI(title="LLM Firewall API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ======================================================
# 4. Health Check
# ======================================================
@app.get("/")
async def root():
    return {"message": "LLM Firewall Backend is running!"}


# ======================================================
# 5. Scan Endpoint
# ======================================================
@app.post("/scan", response_model=AnalysisResponse)
async def scan_prompt(request: AnalysisRequest):
    user_text = request.prompt.lower()

    # --- LAYER 1: Firewall ---
    forbidden_words = ["hack", "password", "ignore instructions", "drop table"]
    found_flags = [w for w in forbidden_words if w in user_text]

    if found_flags:
        return AnalysisResponse(
            is_safe=False,
            flagged_terms=found_flags,
            message="Content blocked due to security risks."
        )

    # --- LAYER 2: Gemini Flash ---
    if not api_key:
        return AnalysisResponse(
            is_safe=True,
            message="Firewall passed, but Gemini API key is not configured."
        )

    try:
        model = genai.GenerativeModel(FLASH_MODEL_NAME)
        response = model.generate_content(request.prompt)

        return AnalysisResponse(
            is_safe=True,
            message=response.text
        )

    except Exception as e:
        return AnalysisResponse(
            is_safe=True,
            message=f"Firewall allowed it, but LLM failed: {str(e)}"
        )

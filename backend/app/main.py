from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models.schemas import AnalysisRequest, AnalysisResponse

app = FastAPI(title="LLM Firewall API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "LLM Firewall Backend is running!"}

@app.post("/scan", response_model=AnalysisResponse)
async def scan_prompt(request: AnalysisRequest):
    user_text = request.prompt.lower()

    forbidden_words = ["hack", "password", "ignore instructions", "drop table"]
    found_flags = [w for w in forbidden_words if w in user_text]

    if found_flags:
        return AnalysisResponse(
            is_safe=False,
            flagged_terms=found_flags,
            message="Content blocked due to security risks."
        )

    return AnalysisResponse(
        is_safe=True,
        message="Content is safe."
    )

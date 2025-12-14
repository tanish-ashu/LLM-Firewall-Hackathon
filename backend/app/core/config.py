import os
from pathlib import Path
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load .env file from the backend root directory
# Get the backend directory (go up from app/core to backend)
backend_dir = Path(__file__).parent.parent.parent
env_path = backend_dir / ".env"
load_dotenv(dotenv_path=env_path)

class Settings(BaseSettings):
    PROJECT_NAME: str = "LLM Firewall Hackathon"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security: Origins that can talk to our backend (React Frontend)
    # For dev, we allow localhost:3000 (React default)
    BACKEND_CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:8000"]

    # AI Config
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Firewall Thresholds (We can tune these during the demo!)
    # 0.0 = Block everything, 1.0 = Allow everything
    JAILBREAK_SIMILARITY_THRESHOLD: float = 0.82 

    class Config:
        case_sensitive = True

settings = Settings()
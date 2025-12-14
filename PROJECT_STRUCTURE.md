# LLM Firewall Hackathon - Project Structure & Library Reference

## Project Overview
This is an LLM Firewall system that intercepts and validates user queries before they reach the LLM, protecting against:
1. **Jailbreak Attempts** - Using Vector DB similarity matching
2. **PII Leakage** - Using Microsoft Presidio
3. **Malicious Prompts** - Using Gemini API with canary injection

## Directory Structure

```
LLM-Firewall-Hackathon/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # Entry point, initializes FastAPI & WebSocket
│   │   ├── core/                # Configuration & Secrets
│   │   │   ├── __init__.py
│   │   │   └── config.py        # API Keys, Threshold settings
│   │   ├── services/            # The Logic Engines
│   │   │   ├── __init__.py
│   │   │   ├── jailbreak.py     # Vector DB & Similarity Logic
│   │   │   ├── pii.py           # Microsoft Presidio Logic
│   │   │   └── llm.py           # Gemini API Wrapper + Canary Injection
│   │   ├── models/              # Pydantic Schemas (Data Validation)
│   │   │   ├── __init__.py
│   │   │   └── schemas.py       # Request/Response formats
│   │   └── api/                 # Routes
│   │       ├── __init__.py
│   │       ├── endpoints.py     # POST /chat, GET /stats
│   │       └── websockets.py    # WebSocket for Real-time Dashboard
│   ├── data/                    # Storage for our Vector DB
│   │   └── chromadb/            # (Auto-generated later)
│   ├── requirements.txt
│   └── .env                     # API Keys (GitIgnore this!)
│
├── frontend/                    # React Dashboard (Phase 2)
│   ├── public/
│   └── src/
│
└── README.md
```

## Key Libraries & Technologies (To be documented as we build)

### Backend Stack:
- **FastAPI** - Web framework for API endpoints
- **WebSocket** - Real-time communication for dashboard
- **ChromaDB** - Vector database for jailbreak pattern matching
- **Microsoft Presidio** - PII detection and anonymization
- **Google Gemini API** - LLM provider with canary injection
- **Pydantic** - Data validation and serialization

### Frontend Stack (Phase 2):
- **React** - UI framework for dashboard

## Architecture Notes:
1. **main.py** - Initializes FastAPI app and WebSocket connections
2. **config.py** - Manages API keys and security thresholds
3. **jailbreak.py** - Vector similarity search against known jailbreak patterns
4. **pii.py** - Microsoft Presidio integration for PII detection
5. **llm.py** - Wraps Gemini API and injects canary tokens for detection
6. **endpoints.py** - REST API routes (POST /chat, GET /stats)
7. **websockets.py** - WebSocket handler for real-time dashboard updates
8. **schemas.py** - Pydantic models for request/response validation

from pydantic import BaseModel
from typing import List, Optional

class AnalysisRequest(BaseModel):
    prompt: str

class AnalysisResponse(BaseModel):
    is_safe: bool
    message: str
    flagged_terms: Optional[List[str]] = None

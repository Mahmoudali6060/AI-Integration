from fastapi import APIRouter
from schemas.groq import PromptRequest
from services.groq_service import analyze_prompt

router = APIRouter()

@router.post("/analyze")
async def analyze_with_groq(request: PromptRequest):
    return analyze_prompt(request.prompt)

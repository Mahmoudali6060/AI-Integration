# routers/ocr_routes.py

from fastapi import APIRouter, UploadFile, File, HTTPException
from services.ocr_service import extract_text

router = APIRouter()

@router.post("/image-to-text")
async def extract_text_from_image(file: UploadFile = File(...)):
    try:
        # print("📷 File received:", file.filename)
        image_bytes = await file.read()
        text = extract_text(image_bytes)
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR Error: {str(e)}")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import items, groq, ocr_routes, auth

from db.database import Base, engine
from models.item import Item


Base.metadata.create_all(bind=engine)

app = FastAPI()



# Include routers
app.include_router(items.router, prefix="/items", tags=["Items"])
app.include_router(groq.router, tags=["Groq"])
app.include_router(ocr_routes.router, tags=["OCR"])  # ← ضيف هنا برضو
app.include_router(auth.router, tags=["Auth"])

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

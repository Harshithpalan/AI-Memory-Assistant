"""
AI Memory Assistant – Main FastAPI Application
"""
import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from api import upload, query, summary
from database.db import init_db
from services.vector_store import init_vector_store

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    logger.info("🚀 Initialising AI Memory Assistant backend...")
    await init_db()
    init_vector_store()
    upload_dir = os.getenv("UPLOAD_DIR", "./uploads")
    os.makedirs(upload_dir, exist_ok=True)
    logger.info("✅ Backend ready.")
    yield
    logger.info("🛑 Shutting down backend.")


app = FastAPI(
    title="AI Memory Assistant API",
    description="Your personal AI Second Brain – Store, organise, and query all your knowledge.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router,  prefix="/api", tags=["Upload"])
app.include_router(query.router,   prefix="/api", tags=["Query"])
app.include_router(summary.router, prefix="/api", tags=["Summary"])


@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "message": "AI Memory Assistant API is running 🧠"}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting AI Memory Assistant...")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

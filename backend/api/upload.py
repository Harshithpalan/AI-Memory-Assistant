from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import get_db, Memory
from utils.pdf_parser import extract_text_from_pdf
from utils.ocr_processor import extract_text_from_image
from utils.speech_to_text import transcribe_audio
from utils.text_cleaner import clean_text, chunk_text
from services.embedding_service import embedding_service
from services.vector_store import add_memory_vector
from services.ai_engine import ai_engine
import os
import shutil
from typing import List

router = APIRouter()

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """Upload and process a file (PDF, Image, Voice, or Text)."""
    upload_dir = os.getenv("UPLOAD_DIR", "./uploads")
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Re-read for processing
    with open(file_path, "rb") as buffer:
        content = buffer.read()
        
    extracted_text = ""
    file_type = "note"
    
    # Determine file type and extract text
    ext = os.path.splitext(file.filename)[1].lower()
    if ext == ".pdf":
        extracted_text = extract_text_from_pdf(content)
        file_type = "pdf"
    elif ext in [".jpg", ".jpeg", ".png", ".bmp"]:
        extracted_text = extract_text_from_image(content)
        file_type = "image"
    elif ext in [".wav", ".mp3", ".m4a", ".ogg"]:
        extracted_text = transcribe_audio(content)
        file_type = "voice"
    elif ext in [".txt", ".md"]:
        extracted_text = content.decode("utf-8", errors="ignore")
        file_type = "note"
        
    if not extracted_text:
        raise HTTPException(status_code=400, detail="Could not extract text from file.")
        
    cleaned_text = clean_text(extracted_text)
    chunks = chunk_text(cleaned_text)
    
    # Detect topic using AI
    try:
        topic = ai_engine.detect_topic(cleaned_text)
    except Exception:
        topic = "General"
    
    # Store in Vector DB
    # We store each chunk in vector DB referencing the main memory entry
    vector_id = None
    for i, chunk in enumerate(chunks):
        embedding = embedding_service.embed_text(chunk)
        metadata = {
            "filename": file.filename,
            "type": file_type,
            "topic": topic,
            "chunk_index": i
        }
        v_id = add_memory_vector(chunk, embedding, metadata)
        if i == 0:
            vector_id = v_id # Reference the first chunk ID for simplicity in SQL
            
    # Store in SQL DB
    new_memory = Memory(
        filename=file.filename,
        file_type=file_type,
        content=cleaned_text,
        vector_id=vector_id,
        topic=topic,
        tags=""
    )
    
    db.add(new_memory)
    await db.commit()
    await db.refresh(new_memory)
    
    return {
        "id": new_memory.id,
        "filename": new_memory.filename,
        "topic": new_memory.topic,
        "status": "processed"
    }

@router.post("/note")
async def add_text_note(
    note: dict,
    db: AsyncSession = Depends(get_db)
):
    """Add a raw text note."""
    content = note.get("content", "")
    title = note.get("title", "Untitled Note")
    
    if not content:
        raise HTTPException(status_code=400, detail="Content is required.")
        
    cleaned_text = clean_text(content)
    chunks = chunk_text(cleaned_text)
    
    # Detect topic using AI
    try:
        topic = ai_engine.detect_topic(cleaned_text)
    except Exception:
        topic = "General"
    
    vector_id = None
    for i, chunk in enumerate(chunks):
        embedding = embedding_service.embed_text(chunk)
        metadata = {
            "filename": title,
            "type": "note",
            "topic": topic,
            "chunk_index": i
        }
        v_id = add_memory_vector(chunk, embedding, metadata)
        if i == 0:
            vector_id = v_id
            
    new_memory = Memory(
        filename=title,
        file_type="note",
        content=cleaned_text,
        vector_id=vector_id,
        topic=topic,
        tags=""
    )
    
    db.add(new_memory)
    await db.commit()
    await db.refresh(new_memory)
    
    return {"id": new_memory.id, "status": "saved"}

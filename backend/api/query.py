from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.embedding_service import embedding_service
from services.vector_store import search_vectors
from services.ai_engine import ai_engine
import logging

router = APIRouter()

class QueryRequest(BaseModel):
    question: str

@router.post("/query")
async def query_ai(request: QueryRequest):
    """Query the AI memory using semantic search and LLM."""
    try:
        # 1. Embed the question
        question_embedding = embedding_service.embed_text(request.question)
        
        # 2. Search vectors
        search_results = search_vectors(question_embedding, top_k=5)
        
        if not search_results:
            return {
                "answer": "I couldn't find any relevant memories to answer your question.",
                "sources": []
            }
            
        # 3. Prepare context
        context_chunks = [res['document'] for res in search_results]
        sources = []
        seen_files = set()
        
        for res in search_results:
            filename = res['metadata'].get('filename')
            if filename not in seen_files:
                sources.append({
                    "filename": filename,
                    "type": res['metadata'].get('type'),
                    "topic": res['metadata'].get('topic')
                })
                seen_files.add(filename)
                
        # 4. Generate answer via AI engine
        answer = ai_engine.generate_answer(request.question, context_chunks)
        
        return {
            "answer": answer,
            "sources": sources
        }
    except Exception as e:
        logging.error(f"Error in query: {e}")
        raise HTTPException(status_code=500, detail=str(e))

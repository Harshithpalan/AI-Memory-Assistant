import time
print("Checking imports...")
start = time.time()

print("1. Loading dotenv...")
from dotenv import load_dotenv
load_dotenv()
print(f"   Done in {time.time()-start:.2f}s")

print("2. Loading FastAPI...")
from fastapi import FastAPI
print(f"   Done in {time.time()-start:.2f}s")

print("3. Loading AI Engine (Google Gemini)...")
from services.ai_engine import ai_engine
print(f"   Done in {time.time()-start:.2f}s")

print("4. Loading Embedding Service (SentenceTransformer)...")
try:
    from services.embedding_service import embedding_service
    print(f"   Done in {time.time()-start:.2f}s")
except Exception as e:
    print(f"   FAILED: {e}")

print("5. Loading Vector Store (ChromaDB)...")
from services.vector_store import init_vector_store
print(f"   Done in {time.time()-start:.2f}s")

print("Import check complete.")

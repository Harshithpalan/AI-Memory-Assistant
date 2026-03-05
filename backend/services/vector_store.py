import chromadb
from chromadb.config import Settings
import os
from typing import List, Dict, Any
import uuid
from dotenv import load_dotenv

load_dotenv()

CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")

client = None
collection = None

def init_vector_store():
    global client, collection
    client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)
    collection = client.get_or_create_collection(
        name="ai_memory_collection",
        metadata={"hnsw:space": "cosine"}
    )

def add_memory_vector(text: str, vector: List[float], metadata: Dict[str, Any]):
    """Add a text chunk and its vector to ChromaDB."""
    chunk_id = str(uuid.uuid4())
    collection.add(
        ids=[chunk_id],
        embeddings=[vector],
        metadatas=[metadata],
        documents=[text]
    )
    return chunk_id

def search_vectors(vector: List[float], top_k: int = 5) -> List[Dict[str, Any]]:
    """Search for relevant chunks by vector similarity."""
    results = collection.query(
        query_embeddings=[vector],
        n_results=top_k
    )
    
    formatted_results = []
    for i in range(len(results['ids'][0])):
        formatted_results.append({
            "id": results['ids'][0][i],
            "document": results['documents'][0][i],
            "metadata": results['metadatas'][0][i],
            "distance": results['distances'][0][i]
        })
    return formatted_results

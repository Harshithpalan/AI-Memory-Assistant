import os
from sentence_transformers import SentenceTransformer
from typing import List
from dotenv import load_dotenv

load_dotenv()

class EmbeddingService:
    def __init__(self):
        model_name = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
        self.model = SentenceTransformer(model_name)

    def embed_text(self, text: str) -> List[float]:
        """Generate embeddings for a single string."""
        embedding = self.model.encode(text)
        return embedding.tolist()

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of strings."""
        embeddings = self.model.encode(texts)
        return embeddings.tolist()

# Singleton instance
embedding_service = EmbeddingService()

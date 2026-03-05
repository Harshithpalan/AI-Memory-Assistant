import re
from typing import List

def clean_text(text: str) -> str:
    """Basic text cleaning."""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    """Split text into overlapping chunks for better retrieval."""
    words = text.split()
    chunks = []
    
    if len(words) <= chunk_size:
        return [text]
        
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
        if i + chunk_size >= len(words):
            break
            
    return chunks

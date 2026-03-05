import os
import google.generativeai as genai
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

class AIEngine:
    def __init__(self):
        # Using Google Generative AI directly (avoids LangChain hangs)
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            print("⚠️ GOOGLE_API_KEY not found in environment.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def generate_answer(self, question: str, context_chunks: List[str]) -> str:
        """Generate an answer based on retrieved context."""
        context_text = "\n---\n".join(context_chunks)
        
        prompt = f"""
        You are a Personal AI Memory Assistant. Use the following pieces of extracted memory context from the user's past notes, documents, and recordings to answer the user's question.
        
        If the answer is not contained within the context, politely say that you don't remember any information about that topic in your database. 
        Always be helpful, concise, and friendly.
        
        Context:
        {context_text}
        
        Question: {question}
        
        Answer (Markdown format):
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Error generating answer: {e}")
            return "I encountered an error while processing your request."

    def detect_topic(self, text: str) -> str:
        """Detect the main topic of a text snippet."""
        prompt = f"""
        Identify the single most relevant topic or subject for the following text. 
        Return ONLY the topic name (e.g., 'Blockchain', 'Machine Learning', 'Shopping List').
        
        Text: {text[:2000]}
        
        Topic:
        """
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Error detecting topic: {e}")
            return "General"

# Singleton
ai_engine = AIEngine()

import whisper
import os
import tempfile
from dotenv import load_dotenv

load_dotenv()

def transcribe_audio(file_content: bytes) -> str:
    """Transcribe audio to text using OpenAI Whisper."""
    try:
        model_name = os.getenv("WHISPER_MODEL", "base")
        model = whisper.load_model(model_name)
        
        # Save bytes to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            temp_file.write(file_content)
            temp_path = temp_file.name
            
        try:
            result = model.transcribe(temp_path)
            return result["text"]
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
    except Exception as e:
        print(f"Error transcribing audio: {e}")
        return ""

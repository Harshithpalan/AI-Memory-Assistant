from PIL import Image
import pytesseract
import io

def extract_text_from_image(file_content: bytes) -> str:
    """Extract text from an image file using OCR."""
    try:
        image = Image.open(io.BytesIO(file_content))
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        print(f"Error performing OCR: {e}")
        return ""

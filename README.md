# AI Memory Assistant – Digital Second Brain 🧠

A production-ready personal AI assistant that remembers everything for you. Store notes, PDFs, images, and voice recordings, then ask questions about your past knowledge.

## 🚀 Features

- **Store Everything**: Support for Text Notes, PDFs, Images (OCR), and Voice Recordings (Transcription).
- **AI Memory Engine**: Automatic text extraction, cleaning, and semantic chunking.
- **Semantic Search**: Vector database (ChromaDB) integration for intelligent memory retrieval.
- **Ask Your Brain**: Chat interface to query your past knowledge with AI-generated answers (Google Gemini) and source tracking.
- **Smart Reminders**: Automatically detects deadlines and tasks from your memories.
- **Timeline & Stats**: Visualise your knowledge history and topic distribution.
- **Futuristic UI**: Modern dark theme with glassmorphism and smooth animations.

## 🛠️ Tech Stack

- **Backend**: FastAPI, LangChain, Google Gemini (1.5 Flash).
- **Vector DB**: ChromaDB.
- **Embeddings**: Sentence Transformers (Local).
- **Processing**: PyPDF, Tesseract OCR, OpenAI Whisper.
- **Frontend**: React, Vite, Framer Motion, Lucide Icons.

## 📋 Prerequisites

- Python 3.9+
- Node.js 18+
- Tesseract OCR (for image processing)
- OpenAI API Key

## ⚙️ Setup Instructions

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

Create a `.env` file from `.env.example` and add your `OPENAI_API_KEY`.

### 2. Frontend Setup
```bash
cd frontend
npm install
```

### 3. Run the Application
Start the backend:
```bash
cd backend
python main.py
```

Start the frontend:
```bash
cd frontend
npm run dev
```

## 🧠 System Architecture

1. **Upload**: Files are processed using specialized parsers (Whisper, Tesseract, PyPDF).
2. **Contextualise**: Text is cleaned and split into semantic chunks.
3. **Embed**: Chunks are converted to high-dimensional vectors.
4. **Store**: Vectors go to ChromaDB; metadata goes to SQL.
5. **Query**: User questions are embedded and matched against the vector store.
6. **Synthesise**: Top matches are sent to the LLM to generate a cited response.

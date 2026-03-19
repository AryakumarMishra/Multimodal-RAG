# Multimodal RAG Chatbot

A powerful, full-stack Retrieval-Augmented Generation (RAG) application that allows you to upload multimodal documents (PDFs, Word Documents, Images, and Audio files) and interactively chat with them. 

This project was built from the ground up focusing on clean architecture, robust API design, and a deep understanding of core AI engineering principles rather than just "vibecoding".

## Features
* **Multimodal Ingestion:** Dynamically routes and processes text, image, and audio files using `unstructured.io` and local `openai-whisper`.
* **Intelligent Chunking & Embedding:** Semantically chunks documents and embeds them using `sentence-transformers` via HuggingFace into a local `ChromaDB` vector store.
* **Context-Grounded Q&A:** Uses Groq's blazing-fast inference with the `llama-3` model to provide precise answers strictly grounded in the uploaded context.
* **Document Tracking:** Employs UUIDs mapped to LangChain metadata to ensure chat sessions only query the specific document the user uploaded.
* **Modern Frontend:** A beautiful, responsive Next.js frontend built purely with Vanilla CSS Modules (featuring automatic light/dark mode support).

## Technology Stack
**Backend:**
* Python & FastAPI
* LangChain & ChromaDB
* Groq API (LLM Inference)
* OpenAI Whisper (Audio processing)
* Unstructured (Document/Image partitioning)

**Frontend:**
* Next.js (App Router)
* React
* Vanilla CSS Modules

---

## Getting Started

### 1. Prerequisites
* Python 3.10+
* Node.js 18+
* A [Groq API Key](https://console.groq.com/)

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd main_app
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt # navigate to backend directory first
   ```
4. Create a `.env` file in `main_app/backend/` and add your Groq API key:
   ```env
   GROQ_API_KEY=your_api_key_here
   ```
5. Start the FastAPI server:
   ```bash
   uvicorn backend.main:app --reload
   ```
   *The backend will be available at `http://localhost:8000`*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd main_app/frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The frontend will be available at `http://localhost:3000`*

---

## Author's Note
This project represents a significant step in my journey as a developer, moving beyond simple scripts to architecting a complete, deployment-ready AI application.
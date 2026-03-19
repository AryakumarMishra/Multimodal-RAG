import shutil
import tempfile
import os
import uuid
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .schema.chat_schema import ChatInput
from .core.loader import load_document
from .core.chunker import chunk_document
from .core.langchain_doc import create_langchain_document
from .core.embed import add_to_vector_store
from .core.retriever import retrieve_documents
from .core.get_llm import get_llm

# loading environment variables
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(CURRENT_DIR, ".env")
load_dotenv(env_path, override=True)

# setting up the backend
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload a file and process it"""
    # generate a unique id for each file
    doc_id = str(uuid.uuid4())

    # save the file at a temporary location
    with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename) as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_file_path = temp_file.name
    
    try:
        # performing the ingestion pipeline
        elements = load_document(file_path=temp_file_path)
        chunks = chunk_document(elements=elements)
        langchain_documents = create_langchain_document(chunks, doc_id)
        add_to_vector_store(langchain_documents)

        return {
            "message": "Document loaded successfully",
            "document_id": doc_id,
            "total_chunks": len(langchain_documents)
        }
    
    except Exception as e:
        return {"error": str(e)}
    
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)


@app.post("/chat")
async def chat_with_doc(request: ChatInput):
    """Chat with the document"""
    retriever = retrieve_documents(query=request.query, doc_id=request.doc_id)

    if not retriever:
        return {
            "message": "No documents found",
            "answer": "No documents found"
        }

    context = "\n\n".join(retriever)

    # prompt for the llm
    prompt = f"""
    You are an Multi-Modal Chatbot performing context-grounded question answering.

        STRICT RULES (must be followed):
        1. Use ONLY the information contained in the provided context.
        2. Do NOT use prior knowledge or external information.
        3. If the answer exists in the context, you MUST extract and summarize it.
        4. ONLY reply "Not found in the provided document." if the information is completely absent.
        5. Every claim in the answer MUST be supported by the provided context.
        6. Include verbatim context excerpts that directly support the answer.

        Answer guidelines:
        - Answer the question fully using information from the context.
        - 3–5 concise sentences.
        - Prefer technical specificity over general summaries.

        Required output format:

        Answer:
        <concise, context-grounded answer>

        Supporting Context (verbatim):
        <exact excerpts used>

        Context:
        {context}

        Question:
        {request.query}
    """

    llm = get_llm()
    llm_response = llm.invoke(prompt)

    return {
        "answer": llm_response.content,
        "source_documents": retriever
    }
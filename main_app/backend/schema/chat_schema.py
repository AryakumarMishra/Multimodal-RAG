from pydantic import BaseModel

class ChatInput(BaseModel):
    query: str
    doc_id: str
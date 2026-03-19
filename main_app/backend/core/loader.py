import mimetypes
import whisper
from unstructured.partition.auto import partition
from unstructured.partition.text import Text

# loading the whisper model (outside function so the processing is faster)
model = whisper.load_model("base")

def load_document(file_path: str):
    """Load the documents or audio and return the elements"""
    # check for the mime type (file type)
    mime_type, _ = mimetypes.guess_type(file_path)

    # if there is an audio file, transcribe it with whisper
    if mime_type and mime_type.startswith("audio"):
        result = model.transcribe(file_path)
        extracted_text = result["text"]
        return [Text(text=extracted_text)]
    
    # if other than audio
    else:     
        elements = partition(filename=file_path)
        return elements
# Use a slim Python 3.10 image
FROM python:3.10-slim

# Install system dependencies required by unstructured (PDF parsing), opencv (images), and whisper (audio)
RUN apt-get update && apt-get install -y \
    poppler-utils \
    tesseract-ocr \
    libgl1-mesa-glx \
    libglib2.0-0 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Upgrade pip
RUN pip install --upgrade pip

# Copy only the backend folder to the working directory
COPY main_app/backend /app/backend

# Install python dependencies from the backend
# This might take a few minutes as PyTorch will be downloaded
RUN pip install -r /app/backend/requirements.txt

# Expose port 7860 as requested by Hugging Face Spaces
ENV PORT=7860
EXPOSE 7860

# Run uvicorn from the /app directory, binding to 0.0.0.0 and port 7860
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]

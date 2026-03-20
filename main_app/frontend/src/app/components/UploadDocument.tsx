"use client";

import { useState, useRef } from "react";
import styles from "./UploadDocument.module.css";

interface UploadDocumentProps {
  onUploadSuccess: (docId: string) => void;
}

export default function UploadDocument({ onUploadSuccess }: UploadDocumentProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccessMsg(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed. Make sure the backend is running.");
      }

      const data = await response.json();
      
      if (data.document_id) {
        setSuccessMsg(`Document processed! ${data.total_chunks} chunks generated.`);
        onUploadSuccess(data.document_id);
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <h2 className={styles.title}>1. Upload Knowledge</h2>
      <p className={styles.description}>
        Supported formats: PDF, DOCX, TXT, Images, Audio (WAV, MP3)
      </p>

      <div 
        className={`${styles.dropZone} ${file ? styles.hasFile : ""}`} 
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className={styles.hiddenInput} 
          accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg,.wav,.mp3"
        />
        
        {!file ? (
          <div className={styles.placeholder}>
            <span className={styles.uploadIcon}>📂</span>
            <p>Click to browse or drag a file here</p>
          </div>
        ) : (
          <div className={styles.fileSelected}>
            <span className={styles.fileIcon}>📄</span>
            <p className={styles.fileName}>{file.name}</p>
            <p className={styles.fileSize}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}
      </div>

      <button 
        className={styles.uploadButton} 
        onClick={handleUpload}
        disabled={!file || isUploading}
      >
        {isUploading ? "Processing..." : "Upload & Analyze"}
      </button>

      {error && <div className={styles.error}>{error}</div>}
      {successMsg && <div className={styles.success}>{successMsg}</div>}
    </div>
  );
}

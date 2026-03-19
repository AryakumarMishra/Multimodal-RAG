"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./ChatInterface.module.css";

interface ChatInterfaceProps {
  docId: string | null;
}

interface Message {
  role: "user" | "bot";
  content: string;
}

export default function ChatInterface({ docId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !docId) return;

    const userQuery = inputValue.trim();
    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", content: userQuery }]);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userQuery,
          doc_id: docId,
        }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed.");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: data.answer || data.message || "No response." },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: `Error: ${err.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  if (!docId) {
    return (
      <div className={styles.lockedContainer}>
        <div className={styles.lockedIcon}>🔒</div>
        <h2>Chat Locked</h2>
        <p>Please upload a document first to start asking questions.</p>
      </div>
    );
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <h2 className={styles.title}>2. Ask Questions</h2>
        <span className={styles.badge}>Doc: {docId.substring(0, 8)}...</span>
      </div>

      <div className={styles.messagesArea}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.waveIcon}>👋</span>
            <p>I am ready to answer questions about your document.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`${styles.messageWrapper} ${
                msg.role === "user" ? styles.userWrapper : styles.botWrapper
              }`}
            >
              <div
                className={`${styles.messageBubble} ${
                  msg.role === "user" ? styles.userBubble : styles.botBubble
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className={`${styles.messageWrapper} ${styles.botWrapper}`}>
            <div className={`${styles.messageBubble} ${styles.botBubble} ${styles.loadingBubble}`}>
              Thinking<span className={styles.dots}>...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputArea}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question here..."
          className={styles.input}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !inputValue.trim()}
          className={styles.sendButton}
        >
          Send
        </button>
      </div>
    </div>
  );
}

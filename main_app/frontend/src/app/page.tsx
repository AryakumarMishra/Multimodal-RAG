"use client";

import { useState } from "react";
import styles from "./page.module.css";
import UploadDocument from "./components/UploadDocument";
import ChatInterface from "./components/ChatInterface";

export default function Home() {
  const [docId, setDocId] = useState<string | null>(null);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.icon}>🤖</span>
          <h1>Multimodal RAG</h1>
        </div>
        <p className={styles.subtitle}>Upload documents and start chatting instantly.</p>
      </header>

      <div className={styles.container}>
        <section className={styles.leftPane}>
          <UploadDocument onUploadSuccess={(id) => setDocId(id)} />
        </section>

        <section className={styles.rightPane}>
          <ChatInterface docId={docId} />
        </section>
      </div>
    </main>
  );
}

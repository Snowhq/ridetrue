"use client";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Unbounded:wght@900&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } .display { font-family: 'Unbounded', sans-serif; }`}</style>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <p style={{ fontSize: 48, marginBottom: 16 }}>⚠️</p>
        <h1 className="display" style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 12 }}>Something went wrong</h1>
        <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, marginBottom: 32 }}>An unexpected error occurred. Try again or go back to the homepage.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={reset} style={{ background: "#F5C000", color: "#0a0a0a", padding: "13px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit" }}>Try again</button>
          <a href="/" style={{ background: "#1a1a1a", color: "#fff", padding: "13px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>Homepage</a>
        </div>
      </div>
    </main>
  );
}
import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Unbounded:wght@900&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } .display { font-family: 'Unbounded', sans-serif; }`}</style>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <p className="display" style={{ fontSize: 80, fontWeight: 900, color: "#F5C000", lineHeight: 1, marginBottom: 16 }}>404</p>
        <h1 className="display" style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 12 }}>Page not found</h1>
        <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, marginBottom: 32 }}>This page doesn't exist or was moved.</p>
        <Link href="/" style={{ background: "#F5C000", color: "#0a0a0a", padding: "13px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>
          Back to homepage →
        </Link>
      </div>
    </main>
  );
}
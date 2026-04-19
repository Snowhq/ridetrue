"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";

export default function DriverActivate() {
  const { user } = usePrivy();
  const [loading, setLoading] = useState(false);
  const [awaitingConfirm, setAwaitingConfirm] = useState(false);
  const [error, setError] = useState("");

  async function activateAgent() {
    setLoading(true);
    setError("");

    const popup = window.open(
      "about:blank",
      "locus-checkout",
      "width=500,height=700,left=" + (window.screenX + (window.outerWidth - 500) / 2) + ",top=" + (window.screenY + (window.outerHeight - 700) / 2)
    );

    try {
      const res = await fetch("/api/driver/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id }),
      });
      const data = await res.json();

      if (data.checkoutUrl && popup) {
        popup.location.href = data.checkoutUrl;
        setAwaitingConfirm(true);

        const timer = setInterval(() => {
          if (popup?.closed) {
            clearInterval(timer);
            setLoading(false);
            return;
          }
          try {
            const url = popup?.location?.href || "";
            if (url.includes("activated=true")) {
              clearInterval(timer);
              popup?.close();
              window.location.href = "/driver/dashboard?activated=true";
            }
          } catch { }
        }, 800);
      } else {
        popup?.close();
        setError(data.error || "Activation failed.");
        setLoading(false);
      }
    } catch {
      popup?.close();
      setError("Could not connect. Try again.");
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Unbounded:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .display { font-family: 'Unbounded', sans-serif; }
        .btn-primary { background: #F5C000; color: #0a0a0a; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 700; transition: all 0.2s; }
        .btn-primary:hover:not(:disabled) { background: #e6b400; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 440 }}>
        <a href="/"><img src="/logo.png" alt="RideTrue" style={{ height: 28, width: "auto", marginBottom: 40 }} /></a>

        <h1 className="display" style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.2, color: "#fff" }}>
          Activate your AI agent
        </h1>
        <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, marginBottom: 36 }}>
          One payment of $0.20 USDC activates your AI agent. It handles fare negotiation, payment collection, and trip confirmation. You just drive.
        </p>

        <div style={{ background: "#111", borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <p style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16, fontWeight: 600 }}>What your agent does</p>
          {["Negotiates fares based on real market data", "Confirms passenger payments before you drive", "Tracks the trip and releases payment on arrival", "Handles disputes automatically"].map(item => (
            <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
              <span style={{ color: "#F5C000", fontSize: 14, lineHeight: 1.6 }}>✓</span>
              <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>{item}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#111", borderRadius: 16, padding: 20, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>One-time activation fee</p>
            <p className="display" style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>$0.20</p>
            <p style={{ fontSize: 11, color: "#555", marginTop: 2 }}>USDC on Base</p>
          </div>
          <div style={{ width: 48, height: 48, background: "#F5C000", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🤖</div>
        </div>

        {error && (
          <p style={{ fontSize: 13, color: "#dc2626", background: "#1a0a0a", border: "1px solid #3a1a1a", padding: "10px 14px", borderRadius: 8, marginBottom: 16 }}>{error}</p>
        )}

        {!awaitingConfirm ? (
          <button className="btn-primary" onClick={activateAgent} disabled={loading} style={{ padding: "14px", fontSize: 15, borderRadius: 10, width: "100%" }}>
            {loading ? "Opening checkout..." : "Pay $0.20 and activate agent →"}
          </button>
        ) : (
          <div style={{ background: "#1a1a1a", borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>Complete payment in the popup, then confirm below.</p>
            <button onClick={() => window.location.href = "/driver/dashboard?activated=true"} style={{ background: "#F5C000", color: "#0a0a0a", border: "none", padding: "13px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", width: "100%", borderRadius: 10, marginBottom: 8 }}>
              I paid — activate my agent ✓
            </button>
            <button onClick={() => { setAwaitingConfirm(false); setLoading(false); }} style={{ background: "transparent", color: "#555", border: "none", padding: "8px 0", fontSize: 12, cursor: "pointer", fontFamily: "inherit", width: "100%" }}>
              Cancel
            </button>
          </div>
        )}

        <p style={{ fontSize: 12, color: "#444", textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
          Payment processed securely via Locus on Base blockchain.
        </p>
      </div>
    </main>
  );
}
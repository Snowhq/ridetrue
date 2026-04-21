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
          if (popup?.closed) { clearInterval(timer); setLoading(false); return; }
          try {
            const url = popup?.location?.href || "";
            if (url.includes("activated=true")) { clearInterval(timer); popup?.close(); window.location.href = "/driver/dashboard?activated=true"; }
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

  const features = [
    { title: "AI verified fares", desc: "Your agent checks real market rates for every route so passengers always get a fair price." },
    { title: "Payment confirmed before you drive", desc: "Passenger pays into escrow before you move. You never drive without confirmed payment." },
    { title: "Instant payout on arrival", desc: "When the passenger confirms they arrived, USDC lands in your wallet immediately." },
    { title: "Zero cash handling", desc: "No collecting money, no change, no disputes. Everything is on-chain." },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Unbounded:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .display { font-family: 'Unbounded', sans-serif; }
      `}</style>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid #111", padding: "0 24px", height: 56, display: "flex", alignItems: "center" }}>
        <a href="/"><img src="/logo.png" alt="RideTrue" style={{ height: 28, width: "auto" }} /></a>
      </nav>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 20px 60px" }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>One-time setup</p>
          <h1 className="display" style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.15, color: "#fff", marginBottom: 12 }}>
            Activate your<br />AI agent
          </h1>
          <p style={{ fontSize: 15, color: "#555", lineHeight: 1.75 }}>
            Pay $0.20 USDC once. Your agent handles everything from fare verification to payment collection. You focus on driving.
          </p>
        </div>

        {/* Features */}
        <div style={{ marginBottom: 24 }}>
          {features.map((f, i) => (
            <div key={f.title} style={{ display: "flex", gap: 16, padding: "18px 0", borderBottom: i < features.length - 1 ? "1px solid #111" : "none" }}>
              <div style={{ width: 28, height: 28, background: "#111", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5C000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{f.title}</p>
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing card */}
        <div style={{ background: "#111", borderRadius: 16, padding: 24, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 11, color: "#444", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Activation fee</p>
            <p className="display" style={{ fontSize: 32, fontWeight: 900, color: "#fff", lineHeight: 1 }}>$0.20</p>
            <p style={{ fontSize: 12, color: "#444", marginTop: 6 }}>One-time · USDC on Base</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 11, color: "#444", marginBottom: 4 }}>Powered by</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#F5C000" }}>Locus</p>
          </div>
        </div>

        {error && (
          <div style={{ background: "#1a0a0a", border: "1px solid #3a1a1a", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: "#dc2626" }}>{error}</p>
          </div>
        )}

        {!awaitingConfirm ? (
          <button
            onClick={activateAgent}
            disabled={loading}
            style={{ background: "#F5C000", color: "#0a0a0a", border: "none", padding: "15px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", borderRadius: 10, width: "100%", opacity: loading ? 0.5 : 1, transition: "opacity 0.2s" }}
          >
            {loading ? "Opening checkout..." : "Pay $0.20 and activate →"}
          </button>
        ) : (
          <div style={{ background: "#111", borderRadius: 14, padding: 20 }}>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 16, lineHeight: 1.6 }}>Complete the payment in the popup window, then confirm here.</p>
            <button
              onClick={() => window.location.href = "/driver/dashboard?activated=true"}
              style={{ background: "#F5C000", color: "#0a0a0a", border: "none", padding: "14px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", width: "100%", borderRadius: 10, marginBottom: 10 }}
            >
              I paid — activate my agent
            </button>
            <button
              onClick={() => { setAwaitingConfirm(false); setLoading(false); }}
              style={{ background: "transparent", color: "#444", border: "none", padding: "8px 0", fontSize: 12, cursor: "pointer", fontFamily: "inherit", width: "100%" }}
            >
              Cancel
            </button>
          </div>
        )}

        <p style={{ fontSize: 12, color: "#333", textAlign: "center", marginTop: 20, lineHeight: 1.7 }}>
          Secured by Locus · Base blockchain · USDC
        </p>
      </div>
    </main>
  );
}

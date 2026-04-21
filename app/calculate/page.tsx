"use client";
import { useState } from "react";

const CITIES = ["Lagos", "Abuja", "Kano", "Port Harcourt", "Ibadan", "Enugu"];

export default function Calculate() {
  const [form, setForm] = useState({ pickup: "", destination: "", city: "Lagos" });
  const [fare, setFare] = useState<{ amount: number; description: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function calculateFare() {
    if (!form.pickup || !form.destination) return;
    setLoading(true);
    const res = await fetch("/api/fare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setFare(data);
    setLoading(false);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Unbounded:wght@900&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } .display { font-family: 'Unbounded', sans-serif; } input, select { outline: none; font-family: 'DM Sans', sans-serif; } input:focus, select:focus { border-color: #F5C000 !important; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <nav style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "0 24px", height: 56, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/"><img src="/logo.png" alt="RideTrue" style={{ height: 28, width: "auto" }} /></a>
        <a href="/dashboard" style={{ fontSize: 13, color: "#666", fontWeight: 500, textDecoration: "none" }}>Book a ride →</a>
      </nav>

      <div style={{ maxWidth: 480, margin: "40px auto", padding: "0 20px" }}>
        <h1 className="display" style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 8, color: "#0a0a0a" }}>Estimate your fare</h1>
        <p style={{ fontSize: 14, color: "#666", marginBottom: 28, lineHeight: 1.6 }}>Check the fair market price for any route before you book.</p>

        <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #f0f0f0", display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#0a0a0a", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>City</label>
            <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={{ width: "100%", border: "1.5px solid #e5e5e5", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "#0a0a0a", background: "#fafafa", appearance: "none" }}>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#0a0a0a", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Pickup</label>
            <input type="text" placeholder="e.g. Lagos Island" value={form.pickup} onChange={e => setForm({ ...form, pickup: e.target.value })} style={{ width: "100%", border: "1.5px solid #e5e5e5", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "#0a0a0a", background: "#fafafa" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#0a0a0a", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Destination</label>
            <input type="text" placeholder="e.g. Victoria Island" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} style={{ width: "100%", border: "1.5px solid #e5e5e5", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "#0a0a0a", background: "#fafafa" }} />
          </div>
          <button onClick={calculateFare} disabled={loading || !form.pickup || !form.destination} style={{ background: "#0a0a0a", color: "#fff", border: "none", padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", borderRadius: 10, width: "100%", opacity: loading || !form.pickup || !form.destination ? 0.5 : 1 }}>
            {loading ? "Calculating..." : "Calculate fare →"}
          </button>
        </div>

        {fare && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #f0f0f0" }}>
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: "#92400e", marginBottom: 6 }}>AI verified fare</p>
              <p className="display" style={{ fontSize: 36, fontWeight: 900, color: "#0a0a0a", marginBottom: 6 }}>${fare.amount.toFixed(2)} USDC</p>
              <p style={{ fontSize: 12, color: "#92400e" }}>{fare.description}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#666" }}>From</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a" }}>{form.pickup}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ fontSize: 13, color: "#666" }}>To</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a" }}>{form.destination}</span>
            </div>
            <a href="/dashboard" style={{ display: "block", background: "#F5C000", color: "#0a0a0a", padding: "14px 0", borderRadius: 10, fontSize: 15, fontWeight: 700, textAlign: "center", textDecoration: "none" }}>
              Book this ride →
            </a>
          </div>
        )}

        <div style={{ marginTop: 16, background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #f0f0f0" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Fare tiers</p>
          {[
            { label: "Short city trip", price: "$0.10", desc: "Under 5km within same area" },
            { label: "Standard city trip", price: "$0.25", desc: "Most trips within a city" },
            { label: "Intercity trip", price: "$1.50", desc: "Between different cities" },
          ].map(t => (
            <div key={t.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a" }}>{t.label}</p>
                <p style={{ fontSize: 11, color: "#999" }}>{t.desc}</p>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#F5C000" }}>{t.price}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CITIES = ["Lagos", "Abuja", "Kano", "Port Harcourt", "Ibadan", "Enugu"];

export default function PassengerRegister() {
  const { user } = usePrivy();
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", phone: "", city: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!form.fullName || !form.phone || !form.city) { setError("Please fill in all fields."); return; }
    if (!user?.id) { setError("Please sign in first."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/register/passenger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId: user?.id, email: user?.email?.address }),
      });
      const data = await res.json();
      if (data.ok) { router.push("/dashboard"); }
      else { setError(data.error || "Something went wrong."); }
    } catch { setError("Could not connect. Try again."); }
    setLoading(false);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Unbounded:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .display { font-family: 'Unbounded', sans-serif; }
        input, select { outline: none; font-family: 'DM Sans', sans-serif; }
        input:focus, select:focus { border-color: #F5C000 !important; box-shadow: 0 0 0 3px rgba(245,192,0,0.08); }
      `}</style>

      {/* Nav */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "0 24px", height: 56, display: "flex", alignItems: "center" }}>
        <a href="/"><img src="/logo.png" alt="RideTrue" style={{ height: 28, width: "auto" }} /></a>
      </nav>

      <div style={{ maxWidth: 440, margin: "0 auto", padding: "48px 20px" }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Passenger account</p>
          <h1 className="display" style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.15, color: "#0a0a0a", marginBottom: 12 }}>
            Create your account
          </h1>
          <p style={{ fontSize: 15, color: "#888", lineHeight: 1.75 }}>
            Tell us a bit about yourself and start booking rides with AI verified fares.
          </p>
        </div>

        {/* Email badge */}
        {user?.email?.address && (
          <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 12, padding: "12px 16px", marginBottom: 28, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, background: "#f8f8f8", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#999", marginBottom: 2 }}>Signed in as</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a" }}>{user.email.address}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Full name</label>
            <input
              type="text"
              placeholder="e.g. Amara Okafor"
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
              style={{ width: "100%", border: "1.5px solid #e8e8e8", borderRadius: 10, padding: "13px 16px", fontSize: 14, color: "#0a0a0a", background: "#fff", transition: "all 0.2s" }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Phone number</label>
            <input
              type="tel"
              placeholder="08012345678"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              style={{ width: "100%", border: "1.5px solid #e8e8e8", borderRadius: 10, padding: "13px 16px", fontSize: 14, color: "#0a0a0a", background: "#fff", transition: "all 0.2s" }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>City</label>
            <select
              value={form.city}
              onChange={e => setForm({ ...form, city: e.target.value })}
              style={{ width: "100%", border: "1.5px solid #e8e8e8", borderRadius: 10, padding: "13px 16px", fontSize: 14, color: form.city ? "#0a0a0a" : "#aaa", background: "#fff", appearance: "none", transition: "all 0.2s" }}
            >
              <option value="">Select your city</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px" }}>
              <p style={{ fontSize: 13, color: "#dc2626" }}>{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ background: "#F5C000", color: "#0a0a0a", border: "none", padding: "15px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", borderRadius: 10, width: "100%", opacity: loading ? 0.5 : 1, transition: "opacity 0.2s", marginTop: 4 }}
          >
            {loading ? "Creating account..." : "Create account →"}
          </button>

          <p style={{ fontSize: 13, color: "#aaa", textAlign: "center" }}>
            Want to drive instead?{" "}
            <a href="/driver/register" style={{ color: "#F5C000", fontWeight: 600, textDecoration: "none" }}>Register as a driver</a>
          </p>
        </div>
      </div>
    </main>
  );
}

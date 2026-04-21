"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CITIES = ["Lagos", "Abuja", "Kano", "Port Harcourt", "Ibadan", "Enugu"];
const VEHICLE_TYPES = ["Sedan", "SUV", "Minibus", "Tricycle (Keke)", "Motorcycle (Okada)"];

export default function DriverRegister() {
  const { user } = usePrivy();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({ fullName: "", phone: "", city: "", vehicleType: "", vehiclePlate: "", vehicleModel: "", walletAddress: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStep1() {
    if (!form.fullName || !form.phone || !form.city) { setError("Please fill in all fields."); return; }
    setError(""); setStep(2);
  }

  async function handleStep2() {
    if (!form.vehicleType || !form.vehiclePlate || !form.vehicleModel) { setError("Please fill in all vehicle details."); return; }
    setError(""); setStep(3);
  }

  async function handleSubmit() {
    if (!form.walletAddress || !form.walletAddress.startsWith("0x")) {
      setError("Please enter a valid wallet address starting with 0x.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/register/driver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId: user?.id, email: user?.email?.address }),
      });
      const data = await res.json();
      if (data.ok) { router.push("/driver/activate"); }
      else { setError(data.error || "Something went wrong."); }
    } catch { setError("Could not connect. Try again."); }
    setLoading(false);
  }

  const inputStyle = { width: "100%", border: "1.5px solid #1a1a1a", borderRadius: 10, padding: "13px 16px", fontSize: 14, color: "#fff", background: "#111", outline: "none", fontFamily: "DM Sans, sans-serif", transition: "border-color 0.2s" };
  const selectStyle = { ...inputStyle, appearance: "none" as const };

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Unbounded:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .display { font-family: 'Unbounded', sans-serif; }
        input:focus, select:focus { border-color: #F5C000 !important; }
      `}</style>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid #111", padding: "0 24px", height: 56, display: "flex", alignItems: "center" }}>
        <a href="/"><img src="/logo.png" alt="RideTrue" style={{ height: 28, width: "auto" }} /></a>
      </nav>

      <div style={{ maxWidth: 440, margin: "0 auto", padding: "40px 20px 60px" }}>

        {/* Step label */}
        <p style={{ fontSize: 12, fontWeight: 600, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
          Step {step} of 3
        </p>

        {/* Progress bar */}
        <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: s <= step ? "#F5C000" : "#1a1a1a", transition: "background 0.3s" }} />
          ))}
        </div>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <>
            <h1 className="display" style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.15, color: "#fff", marginBottom: 10 }}>Register as a driver</h1>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, marginBottom: 32 }}>Tell us who you are and where you operate.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#555", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Full name</label>
                <input type="text" placeholder="e.g. Emeka Obi" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#555", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Phone number</label>
                <input type="tel" placeholder="08012345678" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#555", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>City you drive in</label>
                <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={{ ...selectStyle, color: form.city ? "#fff" : "#555" }}>
                  <option value="">Select your city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {error && <div style={{ background: "#1a0a0a", border: "1px solid #3a1a1a", borderRadius: 10, padding: "12px 16px" }}><p style={{ fontSize: 13, color: "#dc2626" }}>{error}</p></div>}
              <button onClick={handleStep1} style={{ background: "#F5C000", color: "#0a0a0a", border: "none", padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", borderRadius: 10, width: "100%", marginTop: 4 }}>Next — Vehicle details →</button>
              <p style={{ fontSize: 13, color: "#444", textAlign: "center" }}>Passenger instead? <a href="/register" style={{ color: "#F5C000", fontWeight: 600, textDecoration: "none" }}>Register here</a></p>
            </div>
          </>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <>
            <h1 className="display" style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.15, color: "#fff", marginBottom: 10 }}>Your vehicle</h1>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, marginBottom: 32 }}>Add your vehicle details so passengers know what to expect.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#555", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Vehicle type</label>
                <select value={form.vehicleType} onChange={e => setForm({ ...form, vehicleType: e.target.value })} style={{ ...selectStyle, color: form.vehicleType ? "#fff" : "#555" }}>
                  <option value="">Select vehicle type</option>
                  {VEHICLE_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#555", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Vehicle model</label>
                <input type="text" placeholder="e.g. Toyota Camry 2018" value={form.vehicleModel} onChange={e => setForm({ ...form, vehicleModel: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#555", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Plate number</label>
                <input type="text" placeholder="ABC 123 XY" value={form.vehiclePlate} onChange={e => setForm({ ...form, vehiclePlate: e.target.value.toUpperCase() })} style={{ ...inputStyle, letterSpacing: "0.05em" }} />
              </div>
              {error && <div style={{ background: "#1a0a0a", border: "1px solid #3a1a1a", borderRadius: 10, padding: "12px 16px" }}><p style={{ fontSize: 13, color: "#dc2626" }}>{error}</p></div>}
              <button onClick={handleStep2} style={{ background: "#F5C000", color: "#0a0a0a", border: "none", padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", borderRadius: 10, width: "100%", marginTop: 4 }}>Next — Locus wallet →</button>
              <button onClick={() => { setStep(1); setError(""); }} style={{ background: "transparent", border: "1px solid #1a1a1a", color: "#555", padding: "13px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", borderRadius: 10, width: "100%" }}>← Back</button>
            </div>
          </>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <>
            <h1 className="display" style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1.15, color: "#fff", marginBottom: 10 }}>Locus wallet</h1>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, marginBottom: 28 }}>Connect your Locus wallet to receive trip payouts directly on Base.</p>

            <div style={{ background: "#111", borderRadius: 14, padding: 20, marginBottom: 24 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>How to get your address</p>
              {[
                { n: "1", text: "Go to", link: { href: "https://beta.paywithlocus.com", label: "beta.paywithlocus.com" } },
                { n: "2", text: "Sign in and open your wallet dashboard", link: null },
                { n: "3", text: "Copy your wallet address — it starts with 0x", link: null },
              ].map(item => (
                <div key={item.n} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#F5C000", minWidth: 16 }}>{item.n}.</span>
                  <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
                    {item.text}{" "}
                    {item.link && <a href={item.link.href} target="_blank" rel="noopener noreferrer" style={{ color: "#F5C000", fontWeight: 600, textDecoration: "none" }}>{item.link.label}</a>}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#555", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Locus wallet address</label>
                <input type="text" placeholder="0x1234...abcd" value={form.walletAddress} onChange={e => setForm({ ...form, walletAddress: e.target.value })} style={{ ...inputStyle, fontFamily: "monospace", fontSize: 13 }} />
                <p style={{ fontSize: 12, color: "#333", marginTop: 6 }}>Payouts go to this address on Base after each completed trip.</p>
              </div>

              <div style={{ background: "#111", borderRadius: 12, padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 3 }}>AI agent activation</p>
                  <p style={{ fontSize: 12, color: "#444" }}>One-time payment — next step</p>
                </div>
                <span style={{ background: "#F5C000", color: "#0a0a0a", padding: "6px 14px", borderRadius: 100, fontSize: 13, fontWeight: 800 }}>$0.20</span>
              </div>

              {error && <div style={{ background: "#1a0a0a", border: "1px solid #3a1a1a", borderRadius: 10, padding: "12px 16px" }}><p style={{ fontSize: 13, color: "#dc2626" }}>{error}</p></div>}
              <button onClick={handleSubmit} disabled={loading} style={{ background: "#F5C000", color: "#0a0a0a", border: "none", padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", borderRadius: 10, width: "100%", opacity: loading ? 0.5 : 1, marginTop: 4 }}>
                {loading ? "Saving..." : "Continue to agent activation →"}
              </button>
              <button onClick={() => { setStep(2); setError(""); }} style={{ background: "transparent", border: "1px solid #1a1a1a", color: "#555", padding: "13px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", borderRadius: 10, width: "100%" }}>← Back</button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

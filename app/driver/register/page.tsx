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
      if (data.ok) {
        router.push("/driver/activate");
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Could not connect. Try again.");
    }
    setLoading(false);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Unbounded:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .display { font-family: 'Unbounded', sans-serif; }
        input, select { outline: none; font-family: 'DM Sans', sans-serif; }
        input:focus, select:focus { border-color: #F5C000 !important; }
        .submit-btn { background: #F5C000; color: #0a0a0a; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 700; transition: all 0.2s; width: 100%; padding: 14px; font-size: 15px; border-radius: 10px; }
        .submit-btn:hover:not(:disabled) { background: #e6b400; }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .back-btn { background: transparent; border: 1.5px solid #222; color: #888; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; transition: all 0.2s; width: 100%; padding: 13px; font-size: 14px; border-radius: 10px; }
        .back-btn:hover { border-color: #444; color: #ccc; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 440 }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 40, textDecoration: "none" }}>
          <img src="/logo.png" alt="RideTrue" style={{ height: 28, width: "auto" }} />
        </a>

        {/* Progress */}
        <div style={{ display: "flex", gap: 6, marginBottom: 36 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? "#F5C000" : "#1a1a1a", transition: "background 0.3s" }} />
          ))}
        </div>

        {step === 1 && (
          <>
            <h1 className="display" style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.2, color: "#fff" }}>Register as a driver</h1>
            <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, marginBottom: 36 }}>Step 1 of 3. Tell us who you are and where you operate.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#ccc", display: "block", marginBottom: 6 }}>Full name</label>
                <input type="text" placeholder="Tony Stark" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} style={{ width: "100%", border: "1.5px solid #1a1a1a", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#fff", background: "#111" }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#ccc", display: "block", marginBottom: 6 }}>Phone number</label>
                <input type="tel" placeholder="08012345678" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ width: "100%", border: "1.5px solid #1a1a1a", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#fff", background: "#111" }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#ccc", display: "block", marginBottom: 6 }}>City you drive in</label>
                <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={{ width: "100%", border: "1.5px solid #1a1a1a", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: form.city ? "#fff" : "#555", background: "#111", appearance: "none" }}>
                  <option value="">Select your city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {error && <p style={{ fontSize: 13, color: "#dc2626", background: "#1a0a0a", border: "1px solid #3a1a1a", padding: "10px 14px", borderRadius: 8 }}>{error}</p>}
              <button className="submit-btn" onClick={handleStep1}>Next — Vehicle details →</button>
              <p style={{ fontSize: 13, color: "#555", textAlign: "center" }}>Looking to ride instead? <a href="/register" style={{ color: "#F5C000", fontWeight: 600, textDecoration: "none" }}>Passenger registration</a></p>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="display" style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.2, color: "#fff" }}>Your vehicle</h1>
            <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, marginBottom: 36 }}>Step 2 of 3. Add your vehicle details.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#ccc", display: "block", marginBottom: 6 }}>Vehicle type</label>
                <select value={form.vehicleType} onChange={e => setForm({ ...form, vehicleType: e.target.value })} style={{ width: "100%", border: "1.5px solid #1a1a1a", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: form.vehicleType ? "#fff" : "#555", background: "#111", appearance: "none" }}>
                  <option value="">Select vehicle type</option>
                  {VEHICLE_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#ccc", display: "block", marginBottom: 6 }}>Vehicle model</label>
                <input type="text" placeholder="Toyota Camry 2018" value={form.vehicleModel} onChange={e => setForm({ ...form, vehicleModel: e.target.value })} style={{ width: "100%", border: "1.5px solid #1a1a1a", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#fff", background: "#111" }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#ccc", display: "block", marginBottom: 6 }}>Plate number</label>
                <input type="text" placeholder="ABC 123 XY" value={form.vehiclePlate} onChange={e => setForm({ ...form, vehiclePlate: e.target.value.toUpperCase() })} style={{ width: "100%", border: "1.5px solid #1a1a1a", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#fff", background: "#111", letterSpacing: "0.05em" }} />
              </div>
              {error && <p style={{ fontSize: 13, color: "#dc2626", background: "#1a0a0a", border: "1px solid #3a1a1a", padding: "10px 14px", borderRadius: 8 }}>{error}</p>}
              <button className="submit-btn" onClick={handleStep2}>Next — Locus wallet →</button>
              <button className="back-btn" onClick={() => { setStep(1); setError(""); }}>← Back</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="display" style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.2, color: "#fff" }}>Locus wallet</h1>
            <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, marginBottom: 24 }}>Step 3 of 3. Connect your Locus wallet to receive trip payouts directly.</p>

            <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, padding: 16, marginBottom: 24 }}>
              <p style={{ fontSize: 12, color: "#555", marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>How to get your wallet address</p>
              <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, marginBottom: 12 }}>1. Go to <a href="https://beta.paywithlocus.com" target="_blank" rel="noopener noreferrer" style={{ color: "#F5C000", fontWeight: 600 }}>beta.paywithlocus.com</a></p>
              <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, marginBottom: 12 }}>2. Sign in and go to your wallet dashboard</p>
              <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7 }}>3. Copy your wallet address (starts with 0x)</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#ccc", display: "block", marginBottom: 6 }}>Locus wallet address</label>
                <input type="text" placeholder="0x1234...abcd" value={form.walletAddress} onChange={e => setForm({ ...form, walletAddress: e.target.value })} style={{ width: "100%", border: "1.5px solid #1a1a1a", borderRadius: 10, padding: "12px 14px", fontSize: 13, color: "#fff", background: "#111", fontFamily: "monospace" }} />
                <p style={{ fontSize: 12, color: "#555", marginTop: 6 }}>Trip earnings will be sent directly to this address on Base.</p>
              </div>

              <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 3 }}>Activate your AI agent</p>
                    <p style={{ fontSize: 12, color: "#555" }}>One-time payment after registration</p>
                  </div>
                  <span style={{ background: "#F5C000", color: "#0a0a0a", padding: "6px 14px", borderRadius: 100, fontSize: 13, fontWeight: 800 }}>$0.20</span>
                </div>
              </div>

              {error && <p style={{ fontSize: 13, color: "#dc2626", background: "#1a0a0a", border: "1px solid #3a1a1a", padding: "10px 14px", borderRadius: 8 }}>{error}</p>}
              <button className="submit-btn" onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : "Continue to agent activation →"}</button>
              <button className="back-btn" onClick={() => { setStep(2); setError(""); }}>← Back</button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
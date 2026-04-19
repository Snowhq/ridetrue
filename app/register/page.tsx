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
    console.log("Form:", form);
    console.log("User:", user);
    if (!form.fullName || !form.phone || !form.city) {
      setError("Please fill in all fields.");
      return;
    }
    if (!user?.id) {
      setError("Please sign in first.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/register/passenger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId: user?.id, email: user?.email?.address }),
      });
      const data = await res.json();
      if (data.ok) {
        router.push("/dashboard");
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Could not connect. Try again.");
    }
    setLoading(false);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#fff", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Unbounded:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .display { font-family: 'Unbounded', sans-serif; }
        input, select { outline: none; font-family: 'DM Sans', sans-serif; }
        input:focus, select:focus { border-color: #F5C000 !important; }
        .submit-btn { background: #F5C000; color: #0a0a0a; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 700; transition: all 0.2s; width: 100%; padding: 14px; font-size: 15px; border-radius: 10px; }
        .submit-btn:hover:not(:disabled) { background: #e6b400; }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 440 }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 40, color: "#999", fontSize: 13, textDecoration: "none" }}>
          <img src="/logo.png" alt="RideTrue" style={{ height: 28, width: "auto" }} />
        </a>

        <h1 className="display" style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.2 }}>
          Create your account
        </h1>
        <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, marginBottom: 36 }}>
          You are signing up as a passenger. Tell us a bit about yourself and you can start booking rides.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a", display: "block", marginBottom: 6 }}>Full name</label>
            <input
              type="text"
              placeholder="Tony Stark"
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
              style={{ width: "100%", border: "1.5px solid #e5e5e5", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#0a0a0a", background: "#fafafa", transition: "border-color 0.2s" }}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a", display: "block", marginBottom: 6 }}>Phone number</label>
            <input
              type="tel"
              placeholder="08012345678"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              style={{ width: "100%", border: "1.5px solid #e5e5e5", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#0a0a0a", background: "#fafafa", transition: "border-color 0.2s" }}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a", display: "block", marginBottom: 6 }}>Your city</label>
            <select
              value={form.city}
              onChange={e => setForm({ ...form, city: e.target.value })}
              style={{ width: "100%", border: "1.5px solid #e5e5e5", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: form.city ? "#0a0a0a" : "#999", background: "#fafafa", transition: "border-color 0.2s", appearance: "none" }}
            >
              <option value="">Select your city</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {user?.email?.address && (
            <div style={{ background: "#f8f8f8", border: "1px solid #e5e5e5", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16 }}>✉️</span>
              <div>
                <p style={{ fontSize: 11, color: "#999", marginBottom: 2 }}>Signed in as</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a" }}>{user.email.address}</p>
              </div>
            </div>
          )}

          {error && (
            <p style={{ fontSize: 13, color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", padding: "10px 14px", borderRadius: 8 }}>{error}</p>
          )}

          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating account..." : "Create account →"}
          </button>

          <p style={{ fontSize: 13, color: "#999", textAlign: "center" }}>
            Want to drive instead?{" "}
            <a href="/driver/register" style={{ color: "#F5C000", fontWeight: 600, textDecoration: "none" }}>Register as a driver</a>
          </p>
        </div>
      </div>
    </main>
  );
}
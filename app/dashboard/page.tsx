"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";

const CITIES = ["Lagos", "Abuja", "Kano", "Port Harcourt", "Ibadan", "Enugu"];

export default function Dashboard() {
  const { user, logout } = usePrivy();
  const [step, setStep] = useState<"home" | "searching" | "fare" | "paying">("home");
  const [form, setForm] = useState({ pickup: "", destination: "", city: "Lagos" });
  const [fare, setFare] = useState<{ amount: number; description: string } | null>(null);
  const [error, setError] = useState("");
  const [awaitingConfirm, setAwaitingConfirm] = useState(false);

  async function searchFare() {
    if (!form.pickup || !form.destination) {
      setError("Please enter pickup and destination.");
      return;
    }
    setError("");
    setStep("searching");
    try {
      const res = await fetch("/api/fare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickup: form.pickup, destination: form.destination, city: form.city }),
      });
      const data = await res.json();
      setFare(data);
      setStep("fare");
    } catch {
      setError("Could not get fare. Try again.");
      setStep("home");
    }
  }

  async function bookRide() {
    if (!fare) return;

    // Open popup immediately on click — before async call to avoid browser blocking
    const popup = window.open(
      "about:blank",
      "locus-checkout",
      "width=500,height=700,left=" + (window.screenX + (window.outerWidth - 500) / 2) + ",top=" + (window.screenY + (window.outerHeight - 700) / 2)
    );

    setStep("paying");

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup: form.pickup,
          destination: form.destination,
          city: form.city,
          fareAmount: fare.amount,
          userId: user?.id,
        }),
      });
      const data = await res.json();

      if (data.checkoutUrl && popup) {
        popup.location.href = data.checkoutUrl;
        setStep("fare");
        setAwaitingConfirm(true);

        const timer = setInterval(() => {
          if (popup?.closed) {
            clearInterval(timer);
            setAwaitingConfirm(false);
            return;
          }
          try {
            const url = popup?.location?.href || "";
            if (url.includes("confirmed")) {
              clearInterval(timer);
              popup?.close();
              setAwaitingConfirm(false);
              window.location.href = `/trip/confirmed?pickup=${encodeURIComponent(form.pickup)}&destination=${encodeURIComponent(form.destination)}&amount=${fare.amount}&userId=${user?.id}`;
            }
          } catch { /* cross-origin */ }
        }, 800);
      } else {
        popup?.close();
        setError(data.error || "Booking failed.");
        setStep("fare");
      }
    } catch {
      popup?.close();
      setError("Could not complete booking.");
      setStep("fare");
    }
  }

  async function confirmPayment() {
    setAwaitingConfirm(false);
    window.location.href = `/trip/confirmed?pickup=${encodeURIComponent(form.pickup)}&destination=${encodeURIComponent(form.destination)}&amount=${fare?.amount}&userId=${user?.id}`;
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Unbounded:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .display { font-family: 'Unbounded', sans-serif; }
        input, select { outline: none; font-family: 'DM Sans', sans-serif; }
        input:focus, select:focus { border-color: #F5C000 !important; }
        .btn-primary { background: #F5C000; color: #0a0a0a; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 700; transition: all 0.2s; }
        .btn-primary:hover:not(:disabled) { background: #e6b400; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-dark { background: #0a0a0a; color: #fff; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 700; transition: all 0.2s; }
        .btn-dark:hover { background: #222; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <nav style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "0 24px", height: 56, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/"><img src="/logo.png" alt="RideTrue" style={{ height: 28, width: "auto" }} /></a>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#666" }}>{user?.email?.address}</span>
          <button onClick={logout} style={{ background: "transparent", border: "1px solid #e5e5e5", color: "#666", padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 8, fontFamily: "inherit" }}>Sign out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 480, margin: "40px auto", padding: "0 20px" }}>

        {step === "home" && (
          <>
            <h1 className="display" style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 8, color: "#0a0a0a" }}>
              Book a ride
            </h1>
            <p style={{ fontSize: 14, color: "#666", marginBottom: 28, lineHeight: 1.6 }}>
              Enter your route and we will find the fair market price before you pay anything.
            </p>

            <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #f0f0f0", display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0a0a0a", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>City</label>
                <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={{ width: "100%", border: "1.5px solid #e5e5e5", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "#0a0a0a", background: "#fafafa", appearance: "none" }}>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0a0a0a", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Pickup location</label>
                <input type="text" placeholder="e.g. Lagos Island" value={form.pickup} onChange={e => setForm({ ...form, pickup: e.target.value })} style={{ width: "100%", border: "1.5px solid #e5e5e5", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "#0a0a0a", background: "#fafafa" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0a0a0a", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Destination</label>
                <input type="text" placeholder="e.g. Victoria Island" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} style={{ width: "100%", border: "1.5px solid #e5e5e5", borderRadius: 10, padding: "11px 14px", fontSize: 14, color: "#0a0a0a", background: "#fafafa" }} />
              </div>
              {error && <p style={{ fontSize: 13, color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", padding: "10px 14px", borderRadius: 8 }}>{error}</p>}
              <button className="btn-primary" onClick={searchFare} style={{ padding: "14px", fontSize: 15, borderRadius: 10, width: "100%" }}>
                Find fair price →
              </button>
            </div>

            <div style={{ marginTop: 24, background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #f0f0f0" }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>How your money is protected</p>
              {["Your payment is held in escrow until you arrive", "The driver only gets paid after you confirm", "If the trip does not happen you get refunded"].map(t => (
                <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                  <span style={{ color: "#F5C000", fontSize: 16, lineHeight: 1.4 }}>✓</span>
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>{t}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {step === "searching" && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ width: 48, height: 48, border: "3px solid #F5C000", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 24px" }} />
            <h2 className="display" style={{ fontSize: 18, fontWeight: 900, color: "#0a0a0a", marginBottom: 8 }}>Finding fair price</h2>
            <p style={{ fontSize: 14, color: "#666" }}>The AI agent is checking current market rates for your route.</p>
          </div>
        )}

        {(step === "fare" || step === "paying") && fare && (
          <>
            <a onClick={() => { setStep("home"); setAwaitingConfirm(false); }} style={{ fontSize: 13, color: "#999", display: "inline-block", marginBottom: 24, cursor: "pointer" }}>← Change route</a>
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #f0f0f0", marginBottom: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>Your route</p>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 11, color: "#999", marginBottom: 3 }}>From</p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#0a0a0a" }}>{form.pickup}</p>
                </div>
                <span style={{ color: "#F5C000", fontSize: 18 }}>→</span>
                <div style={{ flex: 1, textAlign: "right" }}>
                  <p style={{ fontSize: 11, color: "#999", marginBottom: 3 }}>To</p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#0a0a0a" }}>{form.destination}</p>
                </div>
              </div>

              <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: 20, marginBottom: 20 }}>
                <p style={{ fontSize: 12, color: "#92400e", marginBottom: 6 }}>Fair market fare</p>
                <p className="display" style={{ fontSize: 32, fontWeight: 900, color: "#0a0a0a", marginBottom: 6 }}>${fare.amount.toFixed(2)} USDC</p>
                <p style={{ fontSize: 12, color: "#92400e" }}>{fare.description}</p>
              </div>

              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 14, marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 18 }}>🔐</span>
                <p style={{ fontSize: 13, color: "#15803d", lineHeight: 1.5 }}>This amount will be held in escrow. The driver only receives it after you confirm arrival.</p>
              </div>

              {error && <p style={{ fontSize: 13, color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", padding: "10px 14px", borderRadius: 8, marginBottom: 16 }}>{error}</p>}

              {!awaitingConfirm ? (
                <button className="btn-primary" onClick={bookRide} disabled={step === "paying"} style={{ padding: "14px", fontSize: 15, borderRadius: 10, width: "100%" }}>
                  {step === "paying" ? "Opening checkout..." : `Pay $${fare.amount.toFixed(2)} and book →`}
                </button>
              ) : (
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: 16 }}>
                  <p style={{ fontSize: 13, color: "#15803d", marginBottom: 12, fontWeight: 600 }}>Paid on Locus? Click to confirm your booking.</p>
                  <button onClick={confirmPayment} style={{ background: "#15803d", color: "#fff", border: "none", padding: "12px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", width: "100%", borderRadius: 10 }}>
                    I paid — confirm booking ✓
                  </button>
                  <button onClick={() => setAwaitingConfirm(false)} style={{ background: "transparent", color: "#aaa", border: "none", padding: "8px 0", fontSize: 12, cursor: "pointer", fontFamily: "inherit", width: "100%", marginTop: 6 }}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

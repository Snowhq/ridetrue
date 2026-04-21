"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function TripConfirmedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pickup = searchParams.get("pickup") || "";
  const destination = searchParams.get("destination") || "";
  const amount = searchParams.get("amount") || "0";
  const tripId = searchParams.get("tripId") || "";
  const [status, setStatus] = useState("pending");
  const [driver, setDriver] = useState<any>(null);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);

  async function fetchStatus() {
    if (!tripId) return;
    try {
      const res = await fetch(`/api/trips/status?tripId=${tripId}`);
      const data = await res.json();
      if (data.status) setStatus(data.status);
      if (data.driver) setDriver(data.driver);
    } catch {}
  }

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [tripId]);

  async function confirmArrival() {
    setCompleting(true);
    await fetch("/api/trips/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tripId }),
    });
    setCompleted(true);
    setCompleting(false);
  }

  async function cancelRide() {
    await fetch("/api/trips/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tripId }),
    });
    router.push("/dashboard");
  }

  function shareTrip() {
    const url = `${window.location.origin}/trip/track?tripId=${tripId}`;
    navigator.clipboard.writeText(url);
    alert("Trip link copied. Share with someone you trust.");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Unbounded:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .display { font-family: 'Unbounded', sans-serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes moveDot { 0% { left: 6%; } 100% { left: 86%; } }
        @keyframes pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.3); opacity: 0.7; } }
      `}</style>

      {/* Nav */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "0 24px", height: 56, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/"><img src="/logo.png" alt="RideTrue" style={{ height: 28, width: "auto" }} /></a>
        <a href="/dashboard" style={{ fontSize: 13, color: "#666", fontWeight: 500, textDecoration: "none" }}>Dashboard</a>
      </nav>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 20px" }}>

        {completed ? (
          /* ── COMPLETED STATE ── */
          <div style={{ textAlign: "center", paddingTop: 24 }}>
            <div style={{ width: 64, height: 64, background: "#F5C000", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h1 className="display" style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 8, color: "#0a0a0a" }}>Trip complete</h1>
            <p style={{ fontSize: 14, color: "#888", lineHeight: 1.7, marginBottom: 32 }}>Payment released to the driver.</p>

            {!rated ? (
              <div style={{ background: "#fff", borderRadius: 16, padding: 28, marginBottom: 20, border: "1px solid #f0f0f0" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#0a0a0a", marginBottom: 20 }}>How was your ride?</p>
                <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 20 }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => setRating(star)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 36, color: star <= rating ? "#F5C000" : "#e5e5e5", transition: "color 0.15s", padding: "0 2px" }}>★</button>
                  ))}
                </div>
                {rating > 0 && (
                  <button onClick={() => setRated(true)} style={{ background: "#0a0a0a", color: "#fff", border: "none", padding: "12px 32px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", borderRadius: 10 }}>
                    Submit rating
                  </button>
                )}
              </div>
            ) : (
              <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 20, border: "1px solid #f0f0f0" }}>
                <p style={{ fontSize: 13, color: "#888" }}>Thanks for rating your trip.</p>
              </div>
            )}

            <button onClick={() => router.push("/dashboard")} style={{ background: "#0a0a0a", color: "#fff", border: "none", padding: "14px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", width: "100%", borderRadius: 10 }}>
              Book another ride →
            </button>
          </div>

        ) : (
          /* ── ACTIVE TRIP STATE ── */
          <>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                <div style={{ width: 10, height: 10, background: status === "accepted" ? "#22c55e" : "#F5C000", borderRadius: "50%" }} />
                <p style={{ fontSize: 12, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {status === "accepted" ? "Driver on the way" : "Finding your driver"}
                </p>
              </div>
              <h1 className="display" style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", color: "#0a0a0a" }}>Booking confirmed</h1>
            </div>

            {/* Route animation */}
            <div style={{ background: "#0a0a0a", borderRadius: 16, padding: 20, marginBottom: 16, position: "relative", overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ textAlign: "center", maxWidth: 100 }}>
                  <div style={{ width: 10, height: 10, background: "#F5C000", borderRadius: "50%", margin: "0 auto 6px", animation: "pulse 1.5s ease infinite" }} />
                  <p style={{ fontSize: 11, color: "#F5C000", fontWeight: 600 }}>{pickup}</p>
                </div>
                <div style={{ flex: 1, height: 1.5, background: "#1a1a1a", margin: "0 12px", position: "relative" }}>
                  <div style={{ position: "absolute", width: "100%", height: "100%", background: "linear-gradient(to right, #F5C000, transparent)", opacity: 0.2 }} />
                  <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", width: 9, height: 9, background: "#F5C000", borderRadius: "50%", animation: "moveDot 3s ease-in-out infinite alternate", boxShadow: "0 0 6px #F5C000" }} />
                </div>
                <div style={{ textAlign: "center", maxWidth: 100 }}>
                  <div style={{ width: 10, height: 10, background: "#444", borderRadius: "50%", margin: "0 auto 6px" }} />
                  <p style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>{destination}</p>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontSize: 11, color: "#444" }}>{status === "accepted" ? "Driver is on the way" : "Waiting for driver..."}</p>
                {status === "accepted" && <p style={{ fontSize: 11, color: "#F5C000", fontWeight: 600 }}>ETA ~10 min</p>}
              </div>
            </div>

            {/* Escrow info */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 16, border: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>Amount in escrow</p>
                <p className="display" style={{ fontSize: 22, fontWeight: 900, color: "#0a0a0a" }}>${parseFloat(amount).toFixed(2)} <span style={{ fontSize: 12, fontWeight: 600, color: "#999" }}>USDC</span></p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>Protected by</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#0a0a0a" }}>Locus escrow</p>
              </div>
            </div>

            {/* Driver info */}
            {status === "accepted" && driver && (
              <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 16, border: "1px solid #f0f0f0" }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Your driver</p>
                {[
                  { label: "Name", value: driver.name },
                  { label: "Vehicle", value: driver.vehicleModel },
                  { label: "Plate", value: driver.vehiclePlate },
                  { label: "Phone", value: driver.phone },
                ].map((item, i) => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? "1px solid #f5f5f5" : "none" }}>
                    <span style={{ fontSize: 13, color: "#999" }}>{item.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a" }}>{item.value || "—"}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Waiting state */}
            {status === "pending" && (
              <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 16, border: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 18, height: 18, border: "2px solid #F5C000", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: "#666" }}>Waiting for a driver to accept your trip...</p>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {status === "accepted" && (
                <button onClick={confirmArrival} disabled={completing} style={{ background: "#0a0a0a", color: "#F5C000", border: "none", padding: "15px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", width: "100%", borderRadius: 10, opacity: completing ? 0.5 : 1 }}>
                  {completing ? "Processing..." : "I have arrived — release payment"}
                </button>
              )}

              {status === "accepted" && (
                <button onClick={shareTrip} style={{ background: "#fff", color: "#0a0a0a", border: "1px solid #e5e5e5", padding: "13px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", width: "100%", borderRadius: 10 }}>
                  Share trip link
                </button>
              )}

              {status === "pending" && (
                <button onClick={cancelRide} style={{ background: "transparent", color: "#dc2626", border: "1px solid #fecaca", padding: "12px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", width: "100%", borderRadius: 10 }}>
                  Cancel ride
                </button>
              )}

              <button onClick={() => router.push("/dashboard")} style={{ background: "transparent", color: "#999", border: "none", padding: "10px 0", fontSize: 13, cursor: "pointer", fontFamily: "inherit", width: "100%" }}>
                Back to dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function TripConfirmed() {
  return (
    <Suspense>
      <TripConfirmedContent />
    </Suspense>
  );
}

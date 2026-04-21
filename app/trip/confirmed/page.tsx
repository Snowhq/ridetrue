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

  return (
    <main style={{ minHeight: "100vh", background: "#fff", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Unbounded:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .display { font-family: 'Unbounded', sans-serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
      `}</style>

      <div style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>

        {completed ? (
  <>
    <div style={{ width: 72, height: 72, background: "#F5C000", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 24px" }}>✓</div>
    <h1 className="display" style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 8, color: "#0a0a0a" }}>Trip complete</h1>
    <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, marginBottom: 24 }}>Payment released to the driver. Thanks for riding with RideTrue.</p>

    {!rated ? (
      <div style={{ background: "#f8f8f8", borderRadius: 16, padding: 24, marginBottom: 24, textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a", marginBottom: 16 }}>How was your ride?</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} onClick={() => setRating(star)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 32, color: star <= rating ? "#F5C000" : "#e5e5e5", transition: "color 0.2s" }}>★</button>
          ))}
        </div>
        {rating > 0 && (
          <button onClick={() => setRated(true)} style={{ background: "#0a0a0a", color: "#fff", border: "none", padding: "11px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", borderRadius: 10 }}>
            Submit rating
          </button>
        )}
      </div>
    ) : (
      <div style={{ background: "#f8f8f8", borderRadius: 16, padding: 20, marginBottom: 24, textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "#666" }}>Thanks for rating your trip.</p>
      </div>
    )}

    <button onClick={() => router.push("/dashboard")} style={{ background: "#0a0a0a", color: "#fff", border: "none", padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", width: "100%", borderRadius: 10 }}>
      Book another ride →
    </button>
  </>
        ) : (
          <>
            <div style={{ width: 72, height: 72, background: "#F5C000", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 24px" }}>✓</div>
            <h1 className="display" style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 8, color: "#0a0a0a" }}>Booking confirmed</h1>
            <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, marginBottom: 32 }}>Your payment is in escrow. The driver has been notified.</p>

            {/* Animated route */}
<div style={{ background: "#0a0a0a", borderRadius: 16, padding: 20, marginBottom: 24, position: "relative", overflow: "hidden" }}>
  <style>{`
    @keyframes moveDot {
      0% { left: 8%; }
      100% { left: 88%; }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.4); opacity: 0.7; }
    }
  `}</style>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
    <div style={{ textAlign: "center" }}>
      <div style={{ width: 12, height: 12, background: "#F5C000", borderRadius: "50%", margin: "0 auto 6px", animation: "pulse 1.5s ease infinite" }} />
      <p style={{ fontSize: 11, color: "#F5C000", fontWeight: 600, maxWidth: 80, textAlign: "center" }}>{pickup}</p>
    </div>
    <div style={{ flex: 1, height: 2, background: "#1a1a1a", margin: "0 12px", position: "relative", borderRadius: 2 }}>
      <div style={{ position: "absolute", width: "100%", height: "100%", background: "linear-gradient(to right, #F5C000, transparent)", borderRadius: 2, opacity: 0.3 }} />
      <div style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: 10,
        height: 10,
        background: "#F5C000",
        borderRadius: "50%",
        animation: "moveDot 3s ease-in-out infinite alternate",
        boxShadow: "0 0 8px #F5C000",
      }} />
    </div>
    <div style={{ textAlign: "center" }}>
      <div style={{ width: 12, height: 12, background: "#fff", borderRadius: "50%", margin: "0 auto 6px" }} />
      <p style={{ fontSize: 11, color: "#fff", fontWeight: 600, maxWidth: 80, textAlign: "center" }}>{destination}</p>
    </div>
  </div>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <p style={{ fontSize: 11, color: "#444" }}>
    {status === "accepted" ? "Driver is on the way" : status === "completed" ? "Trip completed" : "Finding your driver..."}
  </p>
  {status === "accepted" && (
    <p style={{ fontSize: 11, color: "#F5C000", fontWeight: 600 }}>ETA ~10 min</p>
  )}
</div>
</div>
            <div style={{ background: "#f8f8f8", borderRadius: 16, padding: 24, marginBottom: 24, textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 11, color: "#999", marginBottom: 3 }}>From</p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#0a0a0a" }}>{pickup}</p>
                </div>
                <span style={{ color: "#F5C000", fontSize: 20 }}>→</span>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 11, color: "#999", marginBottom: 3 }}>To</p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#0a0a0a" }}>{destination}</p>
                </div>
              </div>
              <div style={{ borderTop: "1px solid #e5e5e5", paddingTop: 16, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "#666" }}>Amount in escrow</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0a0a0a" }}>${parseFloat(amount).toFixed(2)} USDC</span>
              </div>
            </div>

            {/* Trip status */}
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: 16, marginBottom: 24, textAlign: "left" }}>
              {status === "accepted" && driver ? (
                <div>
                  <p style={{ fontSize: 13, color: "#92400e", fontWeight: 700, marginBottom: 12 }}>🚗 Driver accepted — on the way</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "#92400e" }}>Driver</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a" }}>{driver.name}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "#92400e" }}>Vehicle</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a" }}>{driver.vehicleModel}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "#92400e" }}>Plate</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a" }}>{driver.vehiclePlate}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "#92400e" }}>Phone</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a" }}>{driver.phone}</span>
                    </div>
                  </div>
                </div>
              ) : status === "accepted" ? (
                <p style={{ fontSize: 13, color: "#92400e", fontWeight: 600 }}>🚗 Driver accepted your trip — they are on the way.</p>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 16, height: 16, border: "2px solid #F5C000", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: "#92400e" }}>Waiting for a driver to accept your trip...</p>
                </div>
              )}
            </div>

            {status === "accepted" && !completed && (
              <button onClick={confirmArrival} disabled={completing} style={{ background: "#0a0a0a", color: "#F5C000", border: "none", padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", width: "100%", borderRadius: 10, marginBottom: 12, opacity: completing ? 0.5 : 1 }}>
                {completing ? "Processing..." : "I have arrived — release payment ✓"}
              </button>
            )}

            {status === "pending" && (
  <button onClick={async () => {
    await fetch("/api/trips/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tripId }),
    });
    router.push("/dashboard");
  }} style={{ background: "transparent", color: "#dc2626", border: "1px solid #fecaca", padding: "12px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", width: "100%", borderRadius: 10, marginBottom: 8 }}>
    Cancel ride
  </button>
)}
<button onClick={() => router.push("/dashboard")} style={{ background: "transparent", color: "#999", border: "none", padding: "10px 0", fontSize: 13, cursor: "pointer", fontFamily: "inherit", width: "100%" }}>
  {status === "accepted" && !completed && (
  <button onClick={() => {
    const url = `${window.location.origin}/trip/track?tripId=${tripId}`;
    navigator.clipboard.writeText(url);
    alert("Trip link copied! Share with someone you trust.");
  }} style={{ background: "transparent", color: "#0a0a0a", border: "1px solid #e5e5e5", padding: "12px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", width: "100%", borderRadius: 10, marginBottom: 8 }}>
    Share trip link
  </button>
)}
  Back to dashboard
</button>
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

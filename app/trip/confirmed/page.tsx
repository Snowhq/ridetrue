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
            <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, marginBottom: 32 }}>Payment released to the driver. Thanks for riding with RideTrue.</p>
            <button onClick={() => router.push("/dashboard")} style={{ background: "#0a0a0a", color: "#fff", border: "none", padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", width: "100%", borderRadius: 10 }}>
              Book another ride →
            </button>
          </>
        ) : (
          <>
            <div style={{ width: 72, height: 72, background: "#F5C000", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 24px" }}>✓</div>
            <h1 className="display" style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 8, color: "#0a0a0a" }}>Booking confirmed</h1>
            <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, marginBottom: 32 }}>Your payment is in escrow. The driver has been notified.</p>

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

            <button onClick={() => router.push("/dashboard")} style={{ background: "transparent", color: "#999", border: "none", padding: "10px 0", fontSize: 13, cursor: "pointer", fontFamily: "inherit", width: "100%" }}>
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

"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type Trip = {
  id: string;
  pickup: string;
  destination: string;
  city: string;
  amount: number;
  passengerEmail: string;
  passengerName: string;
  passengerPhone: string;
  status: string;
};

function DriverDashboardContent() {
  const { user, logout } = usePrivy();
  const searchParams = useSearchParams();
  const activated = searchParams.get("activated");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [prevTripCount, setPrevTripCount] = useState(0);
  const [newTrip, setNewTrip] = useState(false);
  const [earnings, setEarnings] = useState(0);
  const [completedTrips, setCompletedTrips] = useState(0);
  const [isOnline, setIsOnline] = useState(false);

  async function fetchTrips() {
    const res = await fetch("/api/trips");
    const data = await res.json();
    const incoming = data.trips || [];

    if (incoming.length > prevTripCount && prevTripCount !== 0) {
      setNewTrip(true);
      setTimeout(() => setNewTrip(false), 3000);
      try {
        const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFhYB8dnBqaW5weIGJjpCNiIJ8eHh8gYeNkZCMh4F8eHh9go");
        audio.play().catch(() => {});
      } catch {}
    }

    setPrevTripCount(incoming.length);
    setTrips(incoming);

    if (user?.id) {
      const driverRes = await fetch(`/api/trips/driver?driverId=${user.id}`);
      const driverData = await driverRes.json();
      setEarnings(driverData.earnings || 0);
      setCompletedTrips(driverData.trips?.filter((t: any) => t.status === "completed").length || 0);
    }
  }

  useEffect(() => {
    fetchTrips();
    const interval = setInterval(fetchTrips, 5000);
    return () => clearInterval(interval);
  }, [user?.id]);

  async function acceptTrip(tripId: string) {
    setAccepting(tripId);
    await fetch("/api/trips/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tripId, driverId: user?.id }),
    });
    fetchTrips();
    setAccepting(null);
  }

  async function toggleOnline() {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    await fetch("/api/driver/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user?.id, isOnline: newStatus }),
    });
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Unbounded:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .display { font-family: 'Unbounded', sans-serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid #111", padding: "0 24px", height: 56, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/"><img src="/logo.png" alt="RideTrue" style={{ height: 28, width: "auto" }} /></a>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/driver/profile" style={{ fontSize: 13, color: "#555", fontWeight: 500, textDecoration: "none" }}>Profile</a>
          <button onClick={logout} style={{ background: "transparent", border: "1px solid #1a1a1a", color: "#555", padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 8, fontFamily: "inherit" }}>Sign out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "28px 20px" }}>

        {/* New trip notification */}
        {newTrip && (
          <div style={{ background: "#F5C000", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", animation: "fadeIn 0.3s ease" }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#0a0a0a" }}>New trip request</p>
            <button onClick={() => setNewTrip(false)} style={{ background: "transparent", border: "none", color: "#0a0a0a", cursor: "pointer", fontSize: 20, lineHeight: 1, fontFamily: "inherit", padding: 0 }}>×</button>
          </div>
        )}

        {/* Agent activated banner */}
        {activated && (
          <div style={{ background: "#0d1f0d", border: "1px solid #1a3a1a", borderRadius: 12, padding: 16, marginBottom: 20, display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 36, height: 36, background: "#14532d", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#4ade80", marginBottom: 2 }}>Agent activated</p>
              <p style={{ fontSize: 12, color: "#555" }}>Your AI agent is live and ready to accept trips.</p>
            </div>
          </div>
        )}

        {/* Page title */}
        <div style={{ marginBottom: 24 }}>
          <h1 className="display" style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", color: "#fff", marginBottom: 4 }}>Driver dashboard</h1>
          <p style={{ fontSize: 13, color: "#444" }}>Trips refresh every 5 seconds.</p>
        </div>

        {/* Stats */}
        <div style={{ background: "#111", borderRadius: 16, padding: 24, marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 11, color: "#444", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Trips done</p>
            <p className="display" style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{completedTrips}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 11, color: "#444", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Earned</p>
            <p className="display" style={{ fontSize: 28, fontWeight: 900, color: "#F5C000" }}>${earnings.toFixed(2)}</p>
          </div>
        </div>

        {/* Online toggle */}
        <div style={{ background: "#111", borderRadius: 16, padding: 20, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: isOnline ? "#22c55e" : "#333", transition: "background 0.2s" }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{isOnline ? "Online" : "Offline"}</p>
              <p style={{ fontSize: 11, color: "#444" }}>{isOnline ? "Accepting trips" : "Not accepting trips"}</p>
            </div>
          </div>
          <button onClick={toggleOnline} style={{ background: isOnline ? "#F5C000" : "#1a1a1a", color: isOnline ? "#0a0a0a" : "#666", border: "none", padding: "9px 20px", borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
            {isOnline ? "Go offline" : "Go online"}
          </button>
        </div>

        {/* Incoming trips */}
        <div style={{ background: "#111", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <p style={{ fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Incoming trips</p>
            {trips.length > 0 && (
              <span style={{ background: "#F5C000", color: "#0a0a0a", padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 800 }}>{trips.length}</span>
            )}
          </div>

          {trips.length === 0 ? (
            <div style={{ textAlign: "center", padding: "36px 0" }}>
              <div style={{ width: 36, height: 36, border: "2px solid #1a1a1a", borderTopColor: "#F5C000", borderRadius: "50%", animation: "spin 1.5s linear infinite", margin: "0 auto 14px" }} />
              <p style={{ fontSize: 13, color: "#333" }}>Waiting for passengers...</p>
            </div>
          ) : (
            trips.map((trip, i) => (
              <div key={trip.id} style={{ background: "#0a0a0a", borderRadius: 12, padding: 18, marginBottom: i < trips.length - 1 ? 10 : 0, border: "1px solid #151515" }}>

                {/* Route */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <p style={{ fontSize: 10, color: "#444", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>From</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{trip.pickup}</p>
                  </div>
                  <span style={{ color: "#F5C000", fontSize: 14, marginTop: 14 }}>→</span>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 10, color: "#444", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>To</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{trip.destination}</p>
                  </div>
                </div>

                {/* Details */}
                <div style={{ borderTop: "1px solid #111", paddingTop: 12, marginBottom: 14 }}>
                  {[
                    { label: "City", value: trip.city },
                    { label: "Passenger", value: trip.passengerName },
                    { label: "Phone", value: trip.passengerPhone || "—" },
                    { label: "Fare", value: `$${trip.amount.toFixed(2)} USDC` },
                  ].map(item => (
                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: "#444" }}>{item.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: item.label === "Fare" ? "#F5C000" : "#fff" }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => acceptTrip(trip.id)}
                  disabled={accepting === trip.id}
                  style={{ background: "#F5C000", color: "#0a0a0a", border: "none", padding: "12px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", width: "100%", borderRadius: 10, opacity: accepting === trip.id ? 0.5 : 1, transition: "opacity 0.2s" }}
                >
                  {accepting === trip.id ? "Accepting..." : "Accept trip →"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default function DriverDashboard() {
  return (
    <Suspense>
      <DriverDashboardContent />
    </Suspense>
  );
}

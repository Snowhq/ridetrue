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
  const [earnings, setEarnings] = useState(0);
  const [completedTrips, setCompletedTrips] = useState(0);

  async function fetchTrips() {
    const res = await fetch("/api/trips");
    const data = await res.json();
    setTrips(data.trips || []);

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

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Unbounded:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .display { font-family: 'Unbounded', sans-serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <nav style={{ borderBottom: "1px solid #1a1a1a", padding: "0 24px", height: 56, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/"><img src="/logo.png" alt="RideTrue" style={{ height: 28, width: "auto" }} /></a>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
  <span style={{ fontSize: 13, color: "#555" }}>{user?.email?.address}</span>
  <a href="/driver/profile" style={{ fontSize: 13, color: "#555", fontWeight: 500, textDecoration: "none" }}>Profile</a>
  <button onClick={logout} style={{ background: "transparent", border: "1px solid #222", color: "#555", padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 8, fontFamily: "inherit" }}>Sign out</button>
</div>
      </nav>

      <div style={{ maxWidth: 480, margin: "40px auto", padding: "0 20px" }}>

        {activated && (
          <div style={{ background: "#0a1a0a", border: "1px solid #1a3a1a", borderRadius: 16, padding: 20, marginBottom: 28, display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 24 }}>🤖</span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#4ade80", marginBottom: 3 }}>Agent activated</p>
              <p style={{ fontSize: 12, color: "#555" }}>Your AI agent is live and ready to accept trips.</p>
            </div>
          </div>
        )}

        <h1 className="display" style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 8, color: "#fff" }}>Driver dashboard</h1>
        <p style={{ fontSize: 14, color: "#555", marginBottom: 28, lineHeight: 1.6 }}>Incoming trips refresh every 5 seconds.</p>

        {/* Earnings card */}
        <div style={{ background: "#111", borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <p style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16, fontWeight: 600 }}>Your stats</p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>Trips completed</p>
              <p className="display" style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>{completedTrips}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>Total earned</p>
              <p className="display" style={{ fontSize: 24, fontWeight: 900, color: "#F5C000" }}>${earnings.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div style={{ background: "#111", borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <p style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16, fontWeight: 600 }}>
            Incoming trips {trips.length > 0 && <span style={{ background: "#F5C000", color: "#0a0a0a", padding: "2px 8px", borderRadius: 100, fontSize: 10, fontWeight: 800, marginLeft: 8 }}>{trips.length}</span>}
          </p>

          {trips.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ width: 40, height: 40, border: "2px solid #222", borderTopColor: "#F5C000", borderRadius: "50%", animation: "spin 1.5s linear infinite", margin: "0 auto 16px" }} />
              <p style={{ fontSize: 13, color: "#444" }}>Waiting for passengers...</p>
            </div>
          ) : (
            trips.map(trip => (
              <div key={trip.id} style={{ background: "#0a0a0a", borderRadius: 12, padding: 16, marginBottom: 12, border: "1px solid #1a1a1a" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <p style={{ fontSize: 11, color: "#555", marginBottom: 3 }}>From</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{trip.pickup}</p>
                  </div>
                  <span style={{ color: "#F5C000", fontSize: 18 }}>→</span>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 11, color: "#555", marginBottom: 3 }}>To</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{trip.destination}</p>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#555" }}>{trip.city}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#F5C000" }}>${trip.amount.toFixed(2)} USDC</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#555" }}>Passenger</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{trip.passengerName}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: "#555" }}>Phone</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{trip.passengerPhone || "—"}</span>
                </div>
                <button
                  onClick={() => acceptTrip(trip.id)}
                  disabled={accepting === trip.id}
                  style={{ background: "#F5C000", color: "#0a0a0a", border: "none", padding: "11px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", width: "100%", borderRadius: 8, opacity: accepting === trip.id ? 0.5 : 1 }}
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
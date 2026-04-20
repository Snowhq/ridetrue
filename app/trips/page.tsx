"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Trip = {
  id: string;
  pickup: string;
  destination: string;
  city: string;
  amount: number;
  status: string;
  createdAt: string;
};

export default function TripHistory() {
  const { user, logout } = usePrivy();
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/trips/history?userId=${user.id}`)
      .then(r => r.json())
      .then(d => { setTrips(d.trips || []); setLoading(false); });
  }, [user?.id]);

  const statusColor: Record<string, string> = {
    pending: "#F5C000",
    accepted: "#3b82f6",
    completed: "#22c55e",
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Unbounded:wght@900&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } .display { font-family: 'Unbounded', sans-serif; }`}</style>

      <nav style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "0 24px", height: 56, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/dashboard"><img src="/logo.png" alt="RideTrue" style={{ height: 28, width: "auto" }} /></a>
        <button onClick={logout} style={{ background: "transparent", border: "1px solid #e5e5e5", color: "#666", padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 8, fontFamily: "inherit" }}>Sign out</button>
      </nav>

      <div style={{ maxWidth: 480, margin: "40px auto", padding: "0 20px" }}>
        <h1 className="display" style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 8 }}>Trip history</h1>
        <p style={{ fontSize: 14, color: "#666", marginBottom: 28 }}>All your rides with RideTrue.</p>

        {loading ? (
          <p style={{ fontSize: 14, color: "#999", textAlign: "center", padding: "40px 0" }}>Loading...</p>
        ) : trips.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, textAlign: "center", border: "1px solid #f0f0f0" }}>
            <p style={{ fontSize: 14, color: "#999", marginBottom: 16 }}>No trips yet.</p>
            <button onClick={() => router.push("/dashboard")} style={{ background: "#F5C000", color: "#0a0a0a", border: "none", padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", borderRadius: 10, fontFamily: "inherit" }}>Book your first ride →</button>
          </div>
        ) : (
          trips.map(trip => (
            <div key={trip.id} style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 12, border: "1px solid #f0f0f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a", marginBottom: 3 }}>{trip.pickup} → {trip.destination}</p>
                  <p style={{ fontSize: 11, color: "#999" }}>{trip.city} · {new Date(trip.createdAt).toLocaleDateString()}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0a0a0a" }}>${trip.amount.toFixed(2)}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: statusColor[trip.status] || "#999", background: "#f8f8f8", padding: "3px 10px", borderRadius: 100 }}>{trip.status}</span>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
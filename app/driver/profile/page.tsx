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

  const statusLabel: Record<string, string> = {
    pending: "Pending",
    accepted: "In progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  const statusStyle: Record<string, { color: string; background: string }> = {
    pending: { color: "#92400e", background: "#fffbeb" },
    accepted: { color: "#1e40af", background: "#eff6ff" },
    completed: { color: "#14532d", background: "#f0fdf4" },
    cancelled: { color: "#991b1b", background: "#fef2f2" },
  };

  return (
    <main style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Unbounded:wght@900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .display { font-family: 'Unbounded', sans-serif; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 6px; }
      `}</style>

      <nav style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "0 24px", height: 56, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/dashboard"><img src="/logo.png" alt="RideTrue" style={{ height: 28, width: "auto" }} /></a>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="/profile" style={{ fontSize: 13, color: "#666", fontWeight: 500, textDecoration: "none" }}>Profile</a>
          <button onClick={logout} style={{ background: "transparent", border: "1px solid #e5e5e5", color: "#666", padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 8, fontFamily: "inherit" }}>Sign out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 20px" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 className="display" style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", color: "#0a0a0a", marginBottom: 4 }}>Trip history</h1>
          <p style={{ fontSize: 14, color: "#888" }}>All your rides with RideTrue.</p>
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #f0f0f0" }}>
                <div className="skeleton" style={{ height: 14, width: "60%", marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 11, width: "40%", marginBottom: 14 }} />
                <div className="skeleton" style={{ height: 22, width: "20%" }} />
              </div>
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 16, padding: 40, textAlign: "center", border: "1px solid #f0f0f0" }}>
            <p style={{ fontSize: 14, color: "#999", marginBottom: 20, lineHeight: 1.6 }}>You haven't taken any trips yet.</p>
            <button onClick={() => router.push("/dashboard")} style={{ background: "#F5C000", color: "#0a0a0a", border: "none", padding: "12px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer", borderRadius: 10, fontFamily: "inherit" }}>
              Book your first ride →
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {trips.map(trip => {
              const s = statusStyle[trip.status] || { color: "#666", background: "#f8f8f8" };
              return (
                <div key={trip.id} style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #f0f0f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ flex: 1, marginRight: 12 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#0a0a0a", marginBottom: 4, lineHeight: 1.4 }}>
                        {trip.pickup} → {trip.destination}
                      </p>
                      <p style={{ fontSize: 12, color: "#aaa" }}>
                        {trip.city} · {new Date(trip.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <p className="display" style={{ fontSize: 14, fontWeight: 900, color: "#0a0a0a", whiteSpace: "nowrap" }}>
                      ${trip.amount.toFixed(2)}
                    </p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: s.color, background: s.background, padding: "4px 12px", borderRadius: 100, display: "inline-block" }}>
                    {statusLabel[trip.status] || trip.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

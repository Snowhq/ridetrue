"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PassengerProfile() {
  const { user, logout } = usePrivy();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ trips: 0, spent: 0 });

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/me?userId=${user.id}&role=passenger`)
      .then(r => r.json())
      .then(d => setProfile(d.user));
    fetch(`/api/trips/history?userId=${user.id}`)
      .then(r => r.json())
      .then(d => {
        const trips = d.trips || [];
        const completed = trips.filter((t: any) => t.status === "completed");
        setStats({ trips: completed.length, spent: completed.reduce((s: number, t: any) => s + t.amount, 0) });
      });
  }, [user?.id]);

  return (
    <main style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Unbounded:wght@900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .display { font-family: 'Unbounded', sans-serif; }
      `}</style>

      <nav style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "0 24px", height: 56, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/dashboard"><img src="/logo.png" alt="RideTrue" style={{ height: 28, width: "auto" }} /></a>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="/trips" style={{ fontSize: 13, color: "#666", fontWeight: 500, textDecoration: "none" }}>History</a>
          <button onClick={logout} style={{ background: "transparent", border: "1px solid #e5e5e5", color: "#666", padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 8, fontFamily: "inherit" }}>Sign out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 20px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Passenger</p>
          <h1 className="display" style={{ fontSize: 22, fontWeight: 900, color: "#0a0a0a", letterSpacing: "-0.02em" }}>Your profile</h1>
        </div>

        {/* Stats */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, marginBottom: 12, border: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#aaa", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Trips taken</p>
            <p className="display" style={{ fontSize: 28, fontWeight: 900, color: "#0a0a0a" }}>{stats.trips}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#aaa", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Total spent</p>
            <p className="display" style={{ fontSize: 28, fontWeight: 900, color: "#F5C000" }}>${stats.spent.toFixed(2)}</p>
          </div>
        </div>

        {/* Personal info */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, marginBottom: 16, border: "1px solid #f0f0f0" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 18 }}>Personal info</p>
          {[
            { label: "Full name", value: profile?.fullName },
            { label: "Phone", value: profile?.phone },
            { label: "City", value: profile?.city },
            { label: "Email", value: user?.email?.address },
          ].map((item, i) => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 3 ? "1px solid #f5f5f5" : "none" }}>
              <span style={{ fontSize: 13, color: "#aaa" }}>{item.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a" }}>{item.value || "—"}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => router.push("/trips")} style={{ flex: 1, background: "#fff", color: "#0a0a0a", border: "1px solid #e5e5e5", padding: "14px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", borderRadius: 10 }}>
            Trip history
          </button>
          <button onClick={() => router.push("/dashboard")} style={{ flex: 1, background: "#F5C000", color: "#0a0a0a", border: "none", padding: "14px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", borderRadius: 10 }}>
            Book a ride →
          </button>
        </div>
      </div>
    </main>
  );
}

"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DriverProfile() {
  const { user, logout } = usePrivy();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ trips: 0, earnings: 0 });

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/me?userId=${user.id}&role=driver`)
      .then(r => r.json())
      .then(d => setProfile(d.user));
    fetch(`/api/trips/driver?driverId=${user.id}`)
      .then(r => r.json())
      .then(d => setStats({ trips: d.trips?.filter((t: any) => t.status === "completed").length || 0, earnings: d.earnings || 0 }));
  }, [user?.id]);

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Unbounded:wght@900&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } .display { font-family: 'Unbounded', sans-serif; }`}</style>

      <nav style={{ borderBottom: "1px solid #1a1a1a", padding: "0 24px", height: 56, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/driver/dashboard"><img src="/logo.png" alt="RideTrue" style={{ height: 28, width: "auto" }} /></a>
        <button onClick={logout} style={{ background: "transparent", border: "1px solid #222", color: "#555", padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 8, fontFamily: "inherit" }}>Sign out</button>
      </nav>

      <div style={{ maxWidth: 480, margin: "40px auto", padding: "0 20px" }}>
        <h1 className="display" style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 28, letterSpacing: "-0.02em" }}>Your profile</h1>

        {/* Stats */}
        <div style={{ background: "#111", borderRadius: 16, padding: 24, marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>Trips completed</p>
            <p className="display" style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{stats.trips}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>Total earned</p>
            <p className="display" style={{ fontSize: 28, fontWeight: 900, color: "#F5C000" }}>${stats.earnings.toFixed(2)}</p>
          </div>
        </div>

        {/* Profile info */}
        <div style={{ background: "#111", borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <p style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16, fontWeight: 600 }}>Personal info</p>
          {[
            { label: "Full name", value: profile?.fullName },
            { label: "Phone", value: profile?.phone },
            { label: "City", value: profile?.city },
            { label: "Email", value: user?.email?.address },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #1a1a1a" }}>
              <span style={{ fontSize: 13, color: "#555" }}>{item.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{item.value || "—"}</span>
            </div>
          ))}
        </div>

        {/* Vehicle info */}
        <div style={{ background: "#111", borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <p style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16, fontWeight: 600 }}>Vehicle</p>
          {[
            { label: "Type", value: profile?.vehicleType },
            { label: "Model", value: profile?.vehicleModel },
            { label: "Plate", value: profile?.vehiclePlate },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #1a1a1a" }}>
              <span style={{ fontSize: 13, color: "#555" }}>{item.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{item.value || "—"}</span>
            </div>
          ))}
        </div>

        <button onClick={() => router.push("/driver/dashboard")} style={{ background: "#F5C000", color: "#0a0a0a", border: "none", padding: "14px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", width: "100%", borderRadius: 10 }}>
          Back to dashboard →
        </button>
      </div>
    </main>
  );
}
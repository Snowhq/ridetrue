"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function TrackContent() {
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId") || "";
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tripId) return;
    async function fetchTrip() {
      const res = await fetch(`/api/trips/status?tripId=${tripId}`);
      const data = await res.json();
      setTrip(data);
      setLoading(false);
    }
    fetchTrip();
    const interval = setInterval(fetchTrip, 5000);
    return () => clearInterval(interval);
  }, [tripId]);

  const statusLabel: Record<string, string> = {
    pending: "Finding a driver",
    accepted: "Driver on the way",
    completed: "Trip completed",
    cancelled: "Trip cancelled",
  };

  const statusColor: Record<string, string> = {
    pending: "#92400e",
    accepted: "#15803d",
    completed: "#0a0a0a",
    cancelled: "#dc2626",
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=Unbounded:wght@900&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } .display { font-family: 'Unbounded', sans-serif; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <nav style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", padding: "0 24px", height: 56, display: "flex", alignItems: "center" }}>
        <a href="/"><img src="/logo.png" alt="RideTrue" style={{ height: 28, width: "auto" }} /></a>
      </nav>

      <div style={{ maxWidth: 440, margin: "40px auto", padding: "0 20px" }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Live trip tracking</p>
        <h1 className="display" style={{ fontSize: 22, fontWeight: 900, color: "#0a0a0a", marginBottom: 24, letterSpacing: "-0.02em" }}>Track this ride</h1>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 32, height: 32, border: "2px solid #F5C000", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} />
          </div>
        ) : !trip || trip.error ? (
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #f0f0f0", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "#666" }}>Trip not found or link has expired.</p>
          </div>
        ) : (
          <>
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #f0f0f0", marginBottom: 16 }}>
              <div style={{ display: "inline-block", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 100, padding: "4px 14px", marginBottom: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: statusColor[trip.status] || "#666" }}>{statusLabel[trip.status] || trip.status}</p>
              </div>

              {trip.driver && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Driver</p>
                  {[
                    { label: "Name", value: trip.driver.name },
                    { label: "Vehicle", value: trip.driver.vehicleModel },
                    { label: "Plate", value: trip.driver.vehiclePlate },
                    { label: "Phone", value: trip.driver.phone },
                  ].map(item => (
                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                      <span style={{ fontSize: 13, color: "#666" }}>{item.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a" }}>{item.value || "—"}</span>
                    </div>
                  ))}
                </div>
              )}

              <p style={{ fontSize: 12, color: "#999", textAlign: "center", marginTop: 16 }}>This page updates every 5 seconds.</p>
            </div>

            <div style={{ background: "#0a0a0a", borderRadius: 16, padding: 20, textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "#555", marginBottom: 8 }}>Powered by</p>
              <img src="/logo.png" alt="RideTrue" style={{ height: 24, width: "auto", opacity: 0.6 }} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function TrackTrip() {
  return (
    <Suspense>
      <TrackContent />
    </Suspense>
  );
}
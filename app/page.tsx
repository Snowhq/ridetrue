"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CITIES = [
  { name: "Lagos", areas: "Island · Mainland · Lekki · VI · Ikeja", state: "Lagos State" },
  { name: "Abuja", areas: "Wuse · Garki · Maitama · Gwarinpa", state: "FCT" },
  { name: "Kano", areas: "Sabon Gari · Nassarawa · Fagge", state: "Kano State" },
  { name: "Port Harcourt", areas: "GRA · Trans Amadi · Rumuola", state: "Rivers State" },
  { name: "Ibadan", areas: "Bodija · Dugbe · Ring Road · Ojoo", state: "Oyo State" },
  { name: "Enugu", areas: "GRA · New Haven · Ogui · Trans-Ekulu", state: "Enugu State" },
];

const STEPS = [
  { n: "01", title: "Enter your route", desc: "Tell RideTrue where you are going. The AI agent checks what people are actually paying for that route right now." },
  { n: "02", title: "See the fair price", desc: "You get the real market rate before you agree to anything. No surprises, no negotiating blind." },
  { n: "03", title: "Pay with USDC", desc: "Pay with USDC on Base. Your money goes into escrow and the driver knows payment is confirmed and ready." },
  { n: "04", title: "Arrive and release", desc: "When you get there, confirm arrival and the driver gets paid instantly. Clean and done." },
];

const TICKER_ROUTES = ["Lagos Island → VI", "Abuja CBD → Airport", "Kano → Sabon Gari", "PH GRA → Trans Amadi", "Ibadan Bodija → Dugbe", "Enugu GRA → New Haven"];

const CARD_STEPS = [
  { step: "Step 1 of 4", label: "Route entered" },
  { step: "Step 2 of 4", label: "Fare confirmed" },
  { step: "Step 3 of 4", label: "Payment in escrow" },
  { step: "Step 4 of 4", label: "Trip complete" },
];

const WHY = [
  {
    title: "AI verified fares",
    desc: "Before you get in, RideTrue shows you what the route actually costs right now. The AI agent checks real market data so you always know what is fair.",
  },
  {
    title: "Escrow protection",
    desc: "You pay before the trip starts but the driver only receives the money after you confirm you arrived safely. Both sides are protected on every ride.",
  },
  {
    title: "USDC on Base",
    desc: "Payments run on Base blockchain using USDC. Fast, borderless, and settled instantly. No bank issues, no currency problems, no waiting.",
  },
];

export default function Home() {
  const { login, authenticated, user, logout } = usePrivy();
  const router = useRouter();
  const [activeCity, setActiveCity] = useState(0);
  const [cardStep, setCardStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setActiveCity(prev => (prev + 1) % CITIES.length), 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCardStep(prev => (prev + 1) % CARD_STEPS.length), 2000);
    return () => clearInterval(interval);
  }, []);

  async function handleCTA() {
    if (!authenticated) { login(); return; }
    const res = await fetch(`/api/me?userId=${user?.id}&role=passenger`);
    const data = await res.json();
    router.push(data.user ? "/dashboard" : "/register");
  }

  async function handleDriverCTA() {
    if (!authenticated) { login(); return; }
    const res = await fetch(`/api/me?userId=${user?.id}&role=driver`);
    const data = await res.json();
    router.push(data.user ? "/driver/dashboard" : "/driver/register");
  }

  return (
    <main style={{ background: "#fff", color: "#0a0a0a", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Unbounded:wght@700;900&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        .display { font-family: 'Unbounded', sans-serif; }
        .mono { font-family: 'DM Mono', monospace; }
        .btn-primary { background: #F5C000; color: #0a0a0a; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 700; transition: all 0.2s; }
        .btn-primary:hover { background: #e6b400; }
        .btn-dark { background: #0a0a0a; color: #F5C000; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 700; transition: all 0.2s; }
        .btn-dark:hover { background: #1a1a1a; }
        .btn-outline { background: transparent; border: 1.5px solid #e5e5e5; color: #0a0a0a; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; transition: all 0.2s; }
        .btn-outline:hover { border-color: #0a0a0a; }
        .step-card { border: 1px solid #f0f0f0; transition: all 0.2s; }
        .step-card:hover { border-color: #F5C000; box-shadow: 0 8px 32px rgba(245,192,0,0.08); }
        .city-card { border: 2px solid transparent; transition: all 0.3s; cursor: pointer; background: #111; }
        .city-card.active { border-color: #F5C000; background: #fffbeb; }
        .ticker-wrap { display: flex; gap: 48px; animation: ticker 20s linear infinite; white-space: nowrap; }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .nav-desktop { display: flex; }
        .nav-email { display: block; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-email { display: none !important; }
          .hide-mobile { display: none !important; }
          .hero-section { padding: 90px 20px 48px !important; min-height: auto !important; }
          .section-pad { padding: 64px 20px !important; }
          .two-col { grid-template-columns: 1fr !important; gap: 32px !important; }
          .three-col { grid-template-columns: 1fr !important; gap: 16px !important; }
          .four-col { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
          .cities-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; padding: 40px 20px !important; }
          .stats-row { gap: 24px !important; }
          .driver-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 60, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 24px", background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid #f0f0f0" }}>
        <a href="/"><img src="/logo.png" alt="RideTrue" style={{ height: 30, width: "auto" }} /></a>
        <div className="nav-desktop" style={{ gap: 28, alignItems: "center" }}>
          <a href="#how" style={{ color: "#666", fontSize: 13, fontWeight: 500 }}>How it works</a>
          <a href="#cities" style={{ color: "#666", fontSize: 13, fontWeight: 500 }}>Cities</a>
          <a href="#drivers" style={{ color: "#666", fontSize: 13, fontWeight: 500 }}>Drive with us</a>
          <a href="/calculate" style={{ color: "#666", fontSize: 13, fontWeight: 500 }}>Estimate fare</a>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className="nav-email" style={{ fontSize: 12, color: "#999" }}>{user?.email?.address}</span>
          {authenticated ? (
            <>
              <button onClick={handleCTA} className="btn-primary" style={{ padding: "8px 16px", fontSize: 13, borderRadius: 8 }}>Dashboard</button>
              <button onClick={logout} className="btn-outline" style={{ padding: "8px 14px", fontSize: 13, borderRadius: 8 }}>Sign out</button>
            </>
          ) : (
            <>
              <button onClick={login} className="btn-outline" style={{ padding: "8px 14px", fontSize: 13, borderRadius: 8 }}>Sign in</button>
              <button onClick={handleCTA} className="btn-primary" style={{ padding: "8px 16px", fontSize: 13, borderRadius: 8 }}>Get started →</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section" style={{ minHeight: "100vh", padding: "120px 48px 80px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 15% 50%, rgba(245,192,0,0.06) 0%, transparent 55%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          <div className="fade-up" style={{ marginBottom: 20 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600, background: "#fffbeb", border: "1px solid #F5C000", color: "#92400e" }}>
              <span style={{ width: 6, height: 6, background: "#F5C000", borderRadius: "50%" }} />
              Travel With Trust · Powered by Locus
            </span>
          </div>

          <h1 className="display fade-up" style={{ fontSize: "clamp(36px,6vw,80px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 24, maxWidth: 780 }}>
            Fair fares.<br /><span style={{ color: "#F5C000" }}>Every ride.</span><br />Guaranteed.
          </h1>

          <p className="fade-up" style={{ fontSize: 17, color: "#555", lineHeight: 1.8, maxWidth: 460, marginBottom: 20 }}>
            Enter your route. Our AI agent checks the real going rate. You pay in USDC, held in escrow until you arrive. The driver gets paid the moment you confirm.
          </p>

          <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
            {["USDC on Base", "Instant escrow", "AI verified fare"].map(tag => (
              <span key={tag} style={{ background: "#f8f8f8", border: "1px solid #e8e8e8", color: "#555", fontSize: 11, padding: "5px 12px", borderRadius: 100, fontWeight: 600 }}>{tag}</span>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 52 }}>
            <button onClick={handleCTA} className="btn-primary" style={{ padding: "14px 28px", fontSize: 14, borderRadius: 10 }}>Book a ride →</button>
            <button onClick={handleDriverCTA} className="btn-dark" style={{ padding: "14px 28px", fontSize: 14, borderRadius: 10 }}>Become a driver</button>
          </div>

          <div className="stats-row" style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            {[
              { value: "₦0", label: "Overcharge ever" },
              { value: "100%", label: "Escrow protected" },
              { value: "USDC", label: "On Base blockchain" },
            ].map(s => (
              <div key={s.label}>
                <p className="display" style={{ fontSize: 24, fontWeight: 900, color: "#0a0a0a", lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 12, color: "#aaa", marginTop: 5, fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Floating card */}
        <div className="hide-mobile" style={{ position: "absolute", right: 80, top: "50%", transform: "translateY(-50%)", background: "#fff", border: "1px solid #ebebeb", borderRadius: 20, padding: 24, width: 276, boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <p className="mono" style={{ fontSize: 10, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.1em" }}>Live trip</p>
            <span style={{ background: "#fffbeb", border: "1px solid #F5C000", color: "#92400e", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>Locus escrow</span>
          </div>
          <div style={{ marginBottom: 10 }}>
            <p style={{ fontSize: 10, color: "#aaa", marginBottom: 3 }}>From</p>
            <p style={{ fontSize: 13, fontWeight: 600 }}>Lagos Island, Lagos</p>
          </div>
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 10, color: "#aaa", marginBottom: 3 }}>To</p>
            <p style={{ fontSize: 13, fontWeight: 600 }}>Victoria Island, Lagos</p>
          </div>
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: 14, marginBottom: 14 }}>
            <p style={{ fontSize: 10, color: "#92400e", marginBottom: 5 }}>AI verified fare</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p className="display" style={{ fontSize: 20, fontWeight: 900, color: "#0a0a0a" }}>$0.25</p>
              <span style={{ fontSize: 11, color: "#92400e", fontWeight: 600 }}>USDC</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 5, marginBottom: 6 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ flex: 1, height: 3, background: i <= cardStep + 1 ? "#F5C000" : "#f0f0f0", borderRadius: 2, transition: "background 0.4s" }} />
            ))}
          </div>
          <p style={{ fontSize: 10, color: "#aaa" }}>{CARD_STEPS[cardStep].step} — {CARD_STEPS[cardStep].label}</p>
        </div>
      </section>

      {/* Ticker */}
      <div style={{ background: "#0a0a0a", padding: "11px 0", overflow: "hidden" }}>
        <div className="ticker-wrap">
          {[0, 1].map(copy => (
            <div key={copy} style={{ display: "flex", gap: 48, alignItems: "center" }}>
              {TICKER_ROUTES.map(route => (
                <span key={`${copy}-${route}`} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="mono" style={{ fontSize: 11, color: "#F5C000", fontWeight: 500, whiteSpace: "nowrap" }}>{route}</span>
                  <span style={{ width: 3, height: 3, background: "#333", borderRadius: "50%" }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section id="how" className="section-pad" style={{ padding: "88px 48px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "end", marginBottom: 52 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#F5C000", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>How it works</p>
              <h2 className="display" style={{ fontSize: "clamp(24px,4vw,44px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em" }}>Four steps.<br />Every trip.</h2>
            </div>
            <p style={{ fontSize: 15, color: "#777", lineHeight: 1.85 }}>Getting overcharged on transport in Nigeria is something most people have accepted as normal. RideTrue is built to end that. The AI agent verifies the fair fare for your route before you pay a single naira.</p>
          </div>
          <div className="four-col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {STEPS.map(step => (
              <div key={step.n} className="step-card" style={{ padding: 22, borderRadius: 16, background: "#fff" }}>
                <p className="display" style={{ fontSize: 11, color: "#F5C000", fontWeight: 900, marginBottom: 14, letterSpacing: "0.06em" }}>{step.n}</p>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, lineHeight: 1.3, color: "#0a0a0a" }}>{step.title}</h3>
                <p style={{ fontSize: 12, color: "#777", lineHeight: 1.75 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section id="cities" className="section-pad" style={{ padding: "88px 48px", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#F5C000", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>Where we operate</p>
              <h2 className="display" style={{ fontSize: "clamp(24px,4vw,44px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#fff", marginBottom: 16 }}>
                Starting in<br /><span style={{ color: "#F5C000" }}>Nigeria.</span>
              </h2>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.85, marginBottom: 24 }}>Launching in six major Nigerian cities. Once running well, we expand to Ghana, Senegal, and the rest of West Africa in Q3 2026.</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
                <span style={{ background: "#1a1a1a", color: "#F5C000", padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600 }}>Nigeria — Live</span>
                <span style={{ background: "#111", color: "#444", padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600 }}>Ghana — Soon</span>
                <span style={{ background: "#111", color: "#444", padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600 }}>Senegal — Soon</span>
              </div>
              <button onClick={handleCTA} className="btn-primary" style={{ padding: "12px 24px", fontSize: 13, borderRadius: 10 }}>Start riding →</button>
            </div>
            <div className="cities-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {CITIES.map((c, i) => (
                <div key={c.name} className={`city-card ${i === activeCity ? "active" : ""}`} onClick={() => setActiveCity(i)} style={{ padding: 16, borderRadius: 12 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: i === activeCity ? "#0a0a0a" : "#fff", marginBottom: 2 }}>{c.name}</p>
                  <p style={{ fontSize: 10, color: i === activeCity ? "#666" : "#444", marginBottom: 4, fontWeight: 500 }}>{c.state}</p>
                  <p style={{ fontSize: 10, color: i === activeCity ? "#888" : "#333", lineHeight: 1.5 }}>{c.areas}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why RideTrue */}
      <section className="section-pad" style={{ padding: "88px 48px", background: "#fffbeb" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#92400e", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>Why RideTrue</p>
          <h2 className="display" style={{ fontSize: "clamp(24px,4vw,44px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 52 }}>
            Transport in Nigeria<br />has always had problems.<br />Here is how we fix them.
          </h2>
          <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {WHY.map(f => (
              <div key={f.title} style={{ background: "#fff", padding: 28, borderRadius: 16, border: "1px solid #fde68a" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "#0a0a0a" }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "#777", lineHeight: 1.8 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Driver CTA */}
      <section id="drivers" className="section-pad" style={{ padding: "88px 48px", background: "#F5C000" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="driver-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.4)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>For drivers</p>
              <h2 className="display" style={{ fontSize: "clamp(24px,4vw,44px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 20 }}>
                Pay $0.20.<br />Get an AI agent<br />that runs your trips.
              </h2>
              <p style={{ fontSize: 15, color: "rgba(0,0,0,0.6)", lineHeight: 1.85, marginBottom: 12 }}>
                Register as a driver and pay $0.20 USDC once. Your AI agent handles fare verification, payment confirmation, and trip tracking. You just drive.
              </p>
              <p style={{ fontSize: 14, color: "rgba(0,0,0,0.45)", lineHeight: 1.8, marginBottom: 32 }}>
                When a passenger confirms arrival, the money leaves escrow and lands in your Locus wallet immediately. No chasing payments, no cash disputes.
              </p>
              <button onClick={handleDriverCTA} className="btn-dark" style={{ padding: "14px 28px", fontSize: 14, borderRadius: 10 }}>Register as a driver →</button>
            </div>
            <div style={{ background: "#0a0a0a", borderRadius: 20, padding: 28 }}>
              <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 20, fontWeight: 600 }}>Driver AI agent</p>
              {[
                { label: "Agent activation", value: "$0.20 USDC" },
                { label: "Fare verification", value: "AI powered" },
                { label: "Payment collection", value: "Escrow secured" },
                { label: "Trip confirmation", value: "AI handled" },
                { label: "Payout speed", value: "Instant on arrival" },
                { label: "Cash handling", value: "Zero" },
              ].map((item, i) => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 5 ? "1px solid #111" : "none" }}>
                  <span style={{ fontSize: 13, color: "#555" }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#F5C000" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-grid" style={{ background: "#0a0a0a", padding: "48px 48px", display: "grid", gridTemplateColumns: "1fr auto auto", gap: 60, alignItems: "start" }}>
        <div>
          <img src="/logo.png" alt="RideTrue" style={{ height: 28, width: "auto", marginBottom: 16 }} />
          <p style={{ fontSize: 13, color: "#444", lineHeight: 1.75, maxWidth: 220 }}>Fair transport payments for Nigeria and West Africa. AI verified fares, USDC escrow, instant driver payouts.</p>
        </div>
        <div>
          <p style={{ fontSize: 10, color: "#2a2a2a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>Product</p>
          {[
            { label: "How it works", href: "#how" },
            { label: "Cities", href: "#cities" },
            { label: "For drivers", href: "#drivers" },
            { label: "Estimate fare", href: "/calculate" },
          ].map(l => (
            <a key={l.label} href={l.href} style={{ display: "block", fontSize: 13, color: "#555", marginBottom: 10, textDecoration: "none" }}>{l.label}</a>
          ))}
        </div>
        <div>
          <p style={{ fontSize: 10, color: "#2a2a2a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>Built on</p>
          {["Base blockchain", "Locus payments", "USDC escrow", "Privy auth"].map(l => (
            <p key={l} style={{ fontSize: 13, color: "#555", marginBottom: 10 }}>{l}</p>
          ))}
        </div>
      </footer>
    </main>
  );
}

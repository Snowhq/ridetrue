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
  { n: "01", title: "Enter your route", desc: "Tell RideTrue where you are going. The AI agent looks up what people are actually paying for that route right now." },
  { n: "02", title: "See the fair price", desc: "You get the real market rate before you agree to anything. No surprises, no negotiating from a position of ignorance." },
  { n: "03", title: "Pay and get in", desc: "Pay with your bank account, card, or USDC. Your money goes into escrow and the driver knows it is confirmed and waiting." },
  { n: "04", title: "Arrive and release", desc: "When you get there, you confirm arrival and the driver gets paid instantly. Simple, clean, done." },
];

const TICKER_ROUTES = ["Lagos Island → VI", "Abuja CBD → Airport", "Kano → Sabon Gari", "PH GRA → Trans Amadi", "Ibadan Bodija → Dugbe", "Enugu GRA → New Haven"];

export default function Home() {
  const { login, authenticated, user, logout } = usePrivy();
  const router = useRouter();
  const [activeCity, setActiveCity] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCity(prev => (prev + 1) % CITIES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  function handleCTA() {
    authenticated ? router.push("/dashboard") : login();
  }

  function handleDriverCTA() {
    authenticated ? router.push("/driver/register") : login();
  }

  return (
    <main style={{ background: "#fff", color: "#0a0a0a", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Unbounded:wght@700;900&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        .display { font-family: 'Unbounded', sans-serif; }
        .mono { font-family: 'DM Mono', monospace; }
        .btn-primary { background: #F5C000; color: #0a0a0a; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 700; letter-spacing: 0.02em; transition: all 0.2s; }
        .btn-primary:hover { background: #e6b400; transform: translateY(-1px); }
        .btn-dark { background: #0a0a0a; color: #F5C000; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 700; letter-spacing: 0.02em; transition: all 0.2s; }
        .btn-dark:hover { background: #1a1a1a; transform: translateY(-1px); }
        .btn-outline { background: transparent; border: 1.5px solid #e5e5e5; color: #0a0a0a; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; transition: all 0.2s; }
        .btn-outline:hover { border-color: #0a0a0a; }
        .nav-link { color: #666; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .nav-link:hover { color: #0a0a0a; }
        .step-card { border: 1px solid #f0f0f0; transition: all 0.2s; }
        .step-card:hover { border-color: #F5C000; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(245,192,0,0.1); }
        .city-card { border: 2px solid transparent; transition: all 0.3s; cursor: pointer; background: #111; }
        .city-card.active { border-color: #F5C000; background: #fffbeb; }
        .city-card:hover { border-color: #F5C000; }
        .ticker-wrap { display: flex; gap: 48px; animation: ticker 20s linear infinite; white-space: nowrap; }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .hero-badge { background: #fffbeb; border: 1px solid #F5C000; color: #92400e; }
        .escrow-pill { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
        .payment-tag { background: #f8f8f8; border: 1px solid #e5e5e5; color: #555; font-size: 11px; padding: 4px 10px; border-radius: 100px; font-weight: 600; }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .nav-links { display: none !important; }
          .two-col { grid-template-columns: 1fr !important; gap: 32px !important; }
          .three-col { grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
          .four-col { grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
          .pad { padding: 60px 20px !important; }
          .hero-pad { padding: 100px 20px 60px !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; padding: 40px 20px !important; }
          .nav-inner { padding: 0 20px !important; }
          .stats-row { gap: 24px !important; }
        }
      `}</style>

      {/* Nav */}
      <nav className="nav-inner" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 64, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 48px", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid #f0f0f0" }}>
        <a href="/"><img src="/logo.png" alt="RideTrue" style={{ height: 36, width: "auto" }} /></a>
        <div className="nav-links" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          <a href="#how" className="nav-link">How it works</a>
          <a href="#cities" className="nav-link">Cities</a>
          <a href="#drivers" className="nav-link">Drive with us</a>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {authenticated ? (
            <>
              <span style={{ fontSize: 13, color: "#666" }}>{user?.email?.address}</span>
              <button onClick={() => router.push("/dashboard")} className="btn-primary" style={{ padding: "8px 18px", fontSize: 13, borderRadius: 8 }}>Dashboard</button>
              <button onClick={logout} className="btn-outline" style={{ padding: "8px 18px", fontSize: 13, borderRadius: 8 }}>Sign out</button>
            </>
          ) : (
            <>
              <button onClick={login} className="btn-outline" style={{ padding: "8px 18px", fontSize: 13, borderRadius: 8 }}>Sign in</button>
              <button onClick={handleCTA} className="btn-primary" style={{ padding: "9px 20px", fontSize: 13, borderRadius: 8 }}>Get started →</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-pad" style={{ minHeight: "100vh", padding: "120px 48px 80px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 15% 50%, rgba(245,192,0,0.07) 0%, transparent 55%), radial-gradient(circle at 85% 20%, rgba(245,192,0,0.04) 0%, transparent 50%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          <div className="fade-up" style={{ marginBottom: 24 }}>
            <span className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, background: "#F5C000", borderRadius: "50%", display: "inline-block" }} />
              Live in Nigeria · West Africa coming soon
            </span>
          </div>
          <h1 className="display fade-up" style={{ fontSize: "clamp(40px,7vw,84px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.03em", marginBottom: 28, animationDelay: "0.1s", maxWidth: 820 }}>
            Fair fares.<br /><span style={{ color: "#F5C000" }}>Every ride.</span><br />Guaranteed.
          </h1>
          <p className="fade-up" style={{ fontSize: 18, color: "#555", lineHeight: 1.75, maxWidth: 520, marginBottom: 20, animationDelay: "0.2s" }}>
            You tell RideTrue where you are going. An AI agent checks the real market rate for that route, and your payment is held until you arrive safely. The driver gets paid when you confirm arrival.
          </p>
          <div className="fade-up" style={{ display: "flex", gap: 8, marginBottom: 36, flexWrap: "wrap", animationDelay: "0.25s" }}>
            <span className="payment-tag">🏦 Bank transfer</span>
            <span className="payment-tag">💳 Debit card</span>
            <span className="payment-tag">🔷 USDC on Base</span>
          </div>
          <div className="fade-up" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 64, animationDelay: "0.3s" }}>
            <button onClick={handleCTA} className="btn-primary" style={{ padding: "14px 32px", fontSize: 15, borderRadius: 10 }}>
              Book a ride →
            </button>
            <button onClick={handleDriverCTA} className="btn-dark" style={{ padding: "14px 32px", fontSize: 15, borderRadius: 10 }}>
              Become a driver
            </button>
          </div>
          <div className="fade-up stats-row" style={{ display: "flex", gap: 48, flexWrap: "wrap", animationDelay: "0.4s" }}>
            {[{ value: "₦0", label: "Overcharge ever" }, { value: "100%", label: "Escrow protected" }, { value: "3 ways", label: "To pay" }].map(s => (
              <div key={s.label}>
                <p className="display" style={{ fontSize: 28, fontWeight: 900, color: "#0a0a0a", lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 13, color: "#999", marginTop: 4, fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="hide-mobile" style={{ position: "absolute", right: 80, top: "50%", transform: "translateY(-50%)", background: "#fff", border: "1px solid #f0f0f0", borderRadius: 20, padding: 24, width: 300, boxShadow: "0 24px 64px rgba(0,0,0,0.09)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <p className="mono" style={{ fontSize: 10, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em" }}>Live trip</p>
            <span className="escrow-pill" style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>Escrow active</span>
          </div>
          <div style={{ marginBottom: 14 }}><p style={{ fontSize: 11, color: "#999", marginBottom: 3 }}>From</p><p style={{ fontSize: 14, fontWeight: 600 }}>Lagos Island, Lagos</p></div>
          <div style={{ marginBottom: 16 }}><p style={{ fontSize: 11, color: "#999", marginBottom: 3 }}>To</p><p style={{ fontSize: 14, fontWeight: 600 }}>Victoria Island, Lagos</p></div>
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: 14, marginBottom: 16 }}>
            <p style={{ fontSize: 11, color: "#92400e", marginBottom: 4 }}>Fair market fare</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p className="display" style={{ fontSize: 22, fontWeight: 900, color: "#0a0a0a" }}>₦1,200</p>
              <span style={{ fontSize: 11, color: "#92400e", fontWeight: 600 }}>≈ $0.85 USDC</span>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 11, color: "#999", marginBottom: 8 }}>Payment method</p>
            <div style={{ display: "flex", gap: 6 }}>
              {["Bank", "Card", "USDC"].map((p, i) => (
                <span key={p} style={{ flex: 1, textAlign: "center", padding: "6px 0", fontSize: 11, fontWeight: 600, background: i === 0 ? "#0a0a0a" : "#f5f5f5", color: i === 0 ? "#F5C000" : "#999", borderRadius: 6 }}>{p}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[1, 2, 3, 4].map(i => (<div key={i} style={{ flex: 1, height: 5, background: i <= 2 ? "#F5C000" : "#f0f0f0", borderRadius: 3 }} />))}
          </div>
          <p style={{ fontSize: 11, color: "#999", marginTop: 6 }}>Step 2 of 4 — fare confirmed</p>
        </div>
      </section>

      {/* Ticker */}
      <div style={{ background: "#0a0a0a", padding: "14px 0", overflow: "hidden" }}>
        <div className="ticker-wrap">
          {[0, 1].map(copy => (
            <div key={copy} style={{ display: "flex", gap: 48, alignItems: "center" }}>
              {TICKER_ROUTES.map(route => (
                <span key={`${copy}-${route}`} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="mono" style={{ fontSize: 12, color: "#F5C000", fontWeight: 500, whiteSpace: "nowrap" }}>{route}</span>
                  <span style={{ width: 4, height: 4, background: "#333", borderRadius: "50%" }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section id="how" className="pad" style={{ padding: "100px 48px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "end", marginBottom: 56 }}>
            <div>
              <p style={{ fontSize: 13, color: "#F5C000", fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>How it works</p>
              <h2 className="display" style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em" }}>Four steps.<br />Every trip.</h2>
            </div>
            <p style={{ fontSize: 16, color: "#666", lineHeight: 1.8 }}>Getting overcharged on transport in Nigeria is something most people have just accepted. RideTrue is built to change that. The AI agent knows what a fair fare looks like for your route and makes sure that is what you pay.</p>
          </div>
          <div className="four-col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {STEPS.map(step => (
              <div key={step.n} className="step-card" style={{ padding: 24, borderRadius: 16, background: "#fff" }}>
                <p className="display" style={{ fontSize: 12, color: "#F5C000", fontWeight: 900, marginBottom: 14, letterSpacing: "0.05em" }}>{step.n}</p>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section id="cities" className="pad" style={{ padding: "100px 48px", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 13, color: "#F5C000", fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>Where we operate</p>
              <h2 className="display" style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#fff", marginBottom: 16 }}>Starting in<br /><span style={{ color: "#F5C000" }}>Nigeria.</span></h2>
              <p style={{ fontSize: 15, color: "#888", lineHeight: 1.8, marginBottom: 20 }}>We are launching in six major Nigerian cities. Once that is running well, we are expanding to Ghana, Senegal, and the rest of West Africa in Q3 2026.</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
                <span style={{ background: "#1a1a1a", color: "#F5C000", padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600 }}>🇳🇬 Nigeria — Live</span>
                <span style={{ background: "#111", color: "#555", padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600 }}>🇬🇭 Ghana — Coming soon</span>
                <span style={{ background: "#111", color: "#555", padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600 }}>🇸🇳 Senegal — Coming soon</span>
              </div>
              <button onClick={handleCTA} className="btn-primary" style={{ padding: "13px 28px", fontSize: 14, borderRadius: 10 }}>Start riding →</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {CITIES.map((c, i) => (
                <div key={c.name} className={`city-card ${i === activeCity ? "active" : ""}`} onClick={() => setActiveCity(i)} style={{ padding: 18, borderRadius: 12 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: i === activeCity ? "#0a0a0a" : "#fff", marginBottom: 3 }}>{c.name}</p>
                  <p style={{ fontSize: 10, color: i === activeCity ? "#666" : "#444", marginBottom: 6, fontWeight: 500 }}>{c.state}</p>
                  <p style={{ fontSize: 10, color: i === activeCity ? "#888" : "#333", lineHeight: 1.5 }}>{c.areas}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why RideTrue */}
      <section className="pad" style={{ padding: "100px 48px", background: "#fffbeb" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontSize: 13, color: "#92400e", fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>Why RideTrue</p>
          <h2 className="display" style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 56 }}>Transport in Nigeria<br />has always had problems.<br />Here is how we fix them.</h2>
          <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {[
              { icon: "🚫", title: "You always know the price", desc: "Before you get in the car, RideTrue shows you what the fair rate is for that route. You decide if you want to proceed." },
              { icon: "🔐", title: "Your money is safe", desc: "You pay before the trip starts but the driver only receives the money after you confirm you arrived. The escrow protects both of you." },
              { icon: "📲", title: "Use whatever you have", desc: "Bank transfer, debit card, or USDC. You do not need a crypto wallet to use RideTrue. Pay the way that works for you." },
            ].map(f => (
              <div key={f.title} style={{ background: "#fff", padding: 28, borderRadius: 16, border: "1px solid #fde68a" }}>
                <p style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</p>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Driver CTA */}
      <section id="drivers" className="pad" style={{ padding: "100px 48px", background: "#F5C000" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 13, color: "rgba(0,0,0,0.4)", fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.1em" }}>For drivers</p>
              <h2 className="display" style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 20 }}>Pay $0.20.<br />Get an AI agent<br />that runs your trips.</h2>
              <p style={{ fontSize: 16, color: "rgba(0,0,0,0.65)", lineHeight: 1.8, marginBottom: 16 }}>When you register as a driver, you pay $0.20 USDC to activate your AI agent. That agent handles everything — fare negotiation, payment confirmation, trip tracking. You just drive.</p>
              <p style={{ fontSize: 14, color: "rgba(0,0,0,0.5)", lineHeight: 1.7, marginBottom: 36 }}>When a passenger confirms they arrived, the money leaves escrow and lands in your wallet immediately. No chasing payments, no cash disputes, no waiting.</p>
              <button onClick={handleDriverCTA} className="btn-dark" style={{ padding: "14px 32px", fontSize: 15, borderRadius: 10 }}>Register as a driver →</button>
            </div>
            <div style={{ background: "#0a0a0a", borderRadius: 20, padding: 32 }}>
              <p style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 20, fontWeight: 600 }}>Driver AI agent</p>
              {[
                { label: "Agent activation", value: "$0.20 USDC" },
                { label: "Fare negotiation", value: "Automatic" },
                { label: "Payment collection", value: "Escrow secured" },
                { label: "Trip confirmation", value: "AI handled" },
                { label: "Payout speed", value: "Instant on arrival" },
                { label: "Cash handling", value: "Zero" },
              ].map((item, i) => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: i < 5 ? "1px solid #1a1a1a" : "none" }}>
                  <span style={{ fontSize: 13, color: "#666" }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#F5C000" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-grid" style={{ background: "#0a0a0a", padding: "48px 48px", display: "grid", gridTemplateColumns: "1fr auto auto", gap: 80, alignItems: "start" }}>
        <div>
          <img src="/logo.png" alt="RideTrue" style={{ height: 32, width: "auto", marginBottom: 16 }} />
          <p style={{ fontSize: 13, color: "#444", lineHeight: 1.7, maxWidth: 240 }}>Transport payments for Nigeria and West Africa. Fair fares, guaranteed delivery, instant driver payouts.</p>
        </div>
        <div>
          <p style={{ fontSize: 10, color: "#333", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>Product</p>
          {["How it works", "Cities", "For drivers", "Pricing"].map(l => (<p key={l} style={{ fontSize: 13, color: "#555", marginBottom: 10 }}>{l}</p>))}
        </div>
        <div>
          <p style={{ fontSize: 10, color: "#333", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>Built on</p>
          {["Base blockchain", "Locus payments", "Paystack", "USDC escrow"].map(l => (<p key={l} style={{ fontSize: 13, color: "#555", marginBottom: 10 }}>{l}</p>))}
        </div>
      </footer>
    </main>
  );
}

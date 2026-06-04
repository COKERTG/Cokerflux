import { useState } from "react";

const sections = [
  {
    num: "01",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
    title: "Information we collect",
    body: "We may collect personal data such as name, email, and payment information when you create an account or make a purchase.",
  },
  {
    num: "02",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v4c0 1.66 4.03 3 9 3s9-1.34 9-3V5" /><path d="M3 13v4c0 1.66 4.03 3 9 3s9-1.34 9-3v-4" />
      </svg>
    ),
    title: "How we use your data",
    body: "Data is used to process orders, provide support, and send promotional communications. You can opt out at any time.",
  },
  {
    num: "03",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 3" />
      </svg>
    ),
    title: "Cookies",
    body: "We use cookies to improve site functionality and remember your preferences. Manage them anytime in your browser settings.",
  },
  {
    num: "04",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
    ),
    title: "Data security",
    body: "We implement industry-standard security measures to protect your information, though no method is entirely 100% secure.",
  },
  {
    num: "05",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4" /><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
      </svg>
    ),
    title: "Your rights",
    body: "You may request access, correction, or deletion of your personal data at any time. We aim to respond within 30 days in accordance with applicable data protection laws.",
    full: true,
  },
];

export default function PrivacyPolicy() {
  const [hovered, setHovered] = useState(null);

  return (
    <section style={{ fontFamily: "'DM Sans', sans-serif", padding: "2rem 0 3rem", maxWidth: 720, margin: "0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=DM+Serif+Display&display=swap');
        .pp-card { transition: border-color .15s, transform .15s; }
        .pp-card:hover { border-color: #AFA9EC !important; transform: translateY(-1px); }
        .pp-btn:hover { background: #CECBF6 !important; }
        .pp-link:hover { text-decoration: underline; }
      `}</style>

      {/* Hero */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        background: "var(--color-background)",
        border: `0.5px solid var(--color-muted)`,
        borderRadius: 16,
        padding: "2rem 2rem 1.75rem",
        marginBottom: 12,
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 180, height: 180, borderRadius: "50%", background: "#EEEDFE", opacity: 0.5, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "#CECBF6", opacity: 0.3, pointerEvents: "none" }} />

        {/* Badge */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-primary)", background: "var(--color-primary)", opacity: 0.2, padding: "4px 10px", borderRadius: 20, marginBottom: "1rem" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z" />
          </svg>
          Privacy policy
        </div>

        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, fontWeight: 400, color: "var(--color-text)", lineHeight: 1.2, marginBottom: "0.5rem" }}>
          Your data,<br />handled with care.
        </h1>
        <p style={{ fontSize: 14, color: "var(--color-muted)", lineHeight: 1.65, maxWidth: 480, margin: 0 }}>
          This policy explains what we collect, how we use it, and the rights you have over your personal information.
        </p>

        {/* Meta row */}
        <div style={{ display: "flex", gap: "1.5rem", marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "0.5px solid #ebebeb" }}>
          {[
            { icon: "📅", label: "Last updated June 2025" },
            { icon: "🌍", label: "Applies globally" },
            { icon: "📄", label: "6 sections" },
          ].map(({ icon, label }) => (
            <span key={label} style={{ fontSize: 12, color: "#999", display: "flex", alignItems: "center", gap: 5 }}>
              <span aria-hidden="true">{icon}</span>{label}
            </span>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
        {sections.map((s, i) => (
          <div
            key={s.num}
            className="pp-card"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              gridColumn: s.full ? "1 / -1" : undefined,
              background: "var(--color-surface)",
              border: `0.5px solid ${hovered === i ? "var(--color-primary)" : "var(--color-muted)"}`,
              borderRadius: 14,
              padding: "1.25rem",
              cursor: "default",
              color: "var(--color-text)",
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "#252538", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.875rem", color: "#AFA9EC" }}>
              {s.icon}
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: "#666", marginBottom: 4, letterSpacing: "0.04em" }}>{s.num}</div>
            <h2 style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>{s.title}</h2>
            <p style={{ fontSize: 13, color: "#ccc", lineHeight: 1.65, margin: 0 }}>{s.body}</p>
          </div>
        ))}
      </div>

      {/* Contact bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        background: "var(--color-surface)",
        border: `0.5px solid var(--color-muted)`,
        borderRadius: 14,
        padding: "1.25rem 1.5rem",
        marginTop: 12,
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--color-text)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.39 18a19.5 19.5 0 0 1-4.5-4.5 19.79 19.79 0 0 1-3.93-8.41A2 2 0 0 1 5.14 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L9.91 10.09a16 16 0 0 0 5.5 5.5l.46-.46a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.92z" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#1a1a2e", margin: 0, marginBottom: 2 }}>Questions about this policy?</p>
            <p style={{ fontSize: 13, color: "#666", margin: 0 }}>
              Reach our privacy team at{" "}
              <a href="mailto:privacy@cokerflux.com" className="pp-link" style={{ color: "#534AB7", textDecoration: "none", fontWeight: 500 }}>
                privacy@cokerflux.com
              </a>
            </p>
          </div>
        </div>
        <a
          href="mailto:privacy@cokerflux.com"
          className="pp-btn"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: "var(--color-primary)", background: "var(--color-primary)", padding: "8px 14px", borderRadius: 9, textDecoration: "none", whiteSpace: "nowrap", transition: "background .15s" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
          </svg>
          Send email
        </a>
      </div>

      <p style={{ fontSize: 12, color: "#bbb", textAlign: "center", marginTop: "1.5rem" }}>
        CokerFlux &middot; All rights reserved &middot; 2025
      </p>
    </section>
  );
}
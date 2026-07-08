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
    <main className="bg-background text-primary min-h-screen">

      {/* ── Banner ── */}
      <section className="px-5 md:px-10 py-10 md:py-16 border-b border-primary/10">
        <p className="text-[10px] font-bold tracking-[0.35em] text-muted uppercase mb-3">
          Legal
        </p>
        <h1 className="font-display text-[48px] sm:text-[70px] md:text-[110px] leading-[0.88] tracking-[0.02em]">
          PRIVACY<br />POLICY
        </h1>
      </section>

      {/* ── Hero card ── */}
      <section className="px-4 md:px-10 py-8 md:py-12">
        <div className="relative overflow-hidden bg-surface border border-primary/10 rounded-2xl p-5 md:p-8 mb-3">
          {/* Decorative circles */}
          <div className="absolute -top-[60px] -right-[60px] w-[180px] h-[180px] rounded-full bg-primary/5 pointer-events-none" />
          <div className="absolute -top-[20px] -right-[20px] w-[100px] h-[100px] rounded-full bg-primary/10 pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-muted bg-primary/5 px-3 py-1.5 rounded-full mb-4 md:mb-6">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z" />
            </svg>
            Privacy policy
          </div>

          <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[0.02em] mb-2 md:mb-3">
            YOUR DATA,<br />HANDLED WITH CARE.
          </h2>
          <p className="text-[13px] md:text-[14px] text-muted leading-relaxed tracking-[0.03em] max-w-[480px]">
            This policy explains what we collect, how we use it, and the rights you have over your personal information.
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap gap-3 md:gap-6 mt-5 md:mt-6 pt-5 md:pt-6 border-t border-primary/8">
            {[
              { icon: "📅", label: "Last updated June 2025" },
              { icon: "🌍", label: "Applies globally" },
              { icon: "📄", label: "5 sections" },
            ].map(({ icon, label }) => (
              <span key={label} className="text-[11px] md:text-[12px] text-muted flex items-center gap-1.5">
                <span aria-hidden="true">{icon}</span>{label}
              </span>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sections.map((s, i) => (
            <div
              key={s.num}
              className={`bg-surface border border-primary/10 rounded-xl p-5 md:p-6 transition-all duration-200 hover:border-primary/25 hover:-translate-y-px ${s.full ? 'sm:col-span-2' : ''}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center mb-4 text-primary/60">
                {s.icon}
              </div>
              <p className="text-[10px] font-bold tracking-[0.15em] text-muted uppercase mb-1">{s.num}</p>
              <h3 className="text-[13px] md:text-[14px] font-bold tracking-[0.04em] mb-2">{s.title}</h3>
              <p className="text-[12px] md:text-[13px] text-muted leading-relaxed tracking-[0.03em]">{s.body}</p>
            </div>
          ))}
        </div>

        {/* Contact bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface border border-primary/10 rounded-xl p-5 md:p-6 mt-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary/60">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.39 18a19.5 19.5 0 0 1-4.5-4.5 19.79 19.79 0 0 1-3.93-8.41A2 2 0 0 1 5.14 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L9.91 10.09a16 16 0 0 0 5.5 5.5l.46-.46a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.92z" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] md:text-[14px] font-bold tracking-[0.04em] mb-0.5">Questions about this policy?</p>
              <p className="text-[12px] md:text-[13px] text-muted">
                Reach our privacy team at{" "}
                <a href="mailto:privacy@cokerflux.com" className="text-primary/70 hover:text-primary underline transition-colors duration-200">
                  privacy@cokerflux.com
                </a>
              </p>
            </div>
          </div>
          <a
            href="mailto:privacy@cokerflux.com"
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase bg-primary text-text-dark px-5 py-2.5 hover:bg-primary/85 transition-colors duration-200 shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
            </svg>
            Send email
          </a>
        </div>

        <p className="text-[11px] text-muted/50 text-center mt-6 tracking-[0.1em] uppercase">
          CokerFlux · All rights reserved · 2025
        </p>
      </section>

    </main>
  );
}
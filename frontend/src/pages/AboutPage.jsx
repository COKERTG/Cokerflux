import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const values = [
  {
    number: '01',
    title:  'Culture First',
    body:   'We don\'t chase trends. We move with the culture that creates them — rooted in the streets, worn by those who shape the narrative.',
  },
  {
    number: '02',
    title:  'Built to Last',
    body:   'Every piece is cut and constructed to outlast seasons. Premium fabrics, deliberate silhouettes, no shortcuts.',
  },
  {
    number: '03',
    title:  'Limited Always',
    body:   'We never flood the market. Every drop is intentionally small — exclusivity isn\'t a marketing tactic, it\'s a commitment.',
  },
]

export default function AboutPage() {
  return (
    <main className="bg-background text-primary min-h-screen">

      {/* ── Hero ── */}
      <section className="px-5 md:px-10 py-12 md:py-20 border-b border-primary/10">
        <p className="text-[10px] font-bold tracking-[0.35em] text-muted uppercase mb-4">
          Est. 2024 — Lagos
        </p>
        <h1 className="font-display text-[44px] sm:text-[70px] md:text-[120px] leading-[0.88] tracking-[0.02em] max-w-[900px]">
          WE WERE BUILT DIFFERENT
        </h1>
      </section>

      {/* ── Origin story ── */}
      <section className="grid md:grid-cols-2 border-b border-primary/10">
        <div className="px-5 md:px-10 py-10 md:py-16 md:border-r border-primary/10">
          <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-4 md:mb-6">The Origin</p>
          <p className="text-[14px] md:text-[15px] text-primary/80 leading-relaxed tracking-[0.03em] mb-5">
            Cokerflux was born from a simple frustration — there was nowhere to buy clothes that actually reflected how we moved. Not Lagos fashion weeks, not fast fashion imports. Something real.
          </p>
          <p className="text-[14px] md:text-[15px] text-muted leading-relaxed tracking-[0.03em]">
            So we built it. Starting with one hoodie, one drop, and a frequency that people felt before they even saw the logo.
          </p>
        </div>
        <div className="px-5 md:px-10 py-10 md:py-16 border-t md:border-t-0 border-primary/10">
          <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-4 md:mb-6">The Mission</p>
          <p className="text-[14px] md:text-[15px] text-primary/80 leading-relaxed tracking-[0.03em] mb-5">
            To make premium streetwear that belongs here — designed for the climate, the culture, and the people who are building something whether the world is watching or not.
          </p>
          <p className="text-[14px] md:text-[15px] text-muted leading-relaxed tracking-[0.03em]">
            Cokerflux is for those who move with intention. For those who are built different.
          </p>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="px-4 md:px-10 py-10 md:py-16 border-b border-primary/10">
        <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-8 md:mb-12 px-1">What We Stand For</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-primary/8">
          {values.map(v => (
            <div key={v.number} className="bg-background p-6 md:p-8">
              <p className="font-display text-[32px] md:text-[40px] text-primary/15 leading-none mb-4 md:mb-6">{v.number}</p>
              <h3 className="font-display text-[20px] md:text-[22px] tracking-[0.06em] mb-3 md:mb-4">{v.title}</h3>
              <p className="text-[12px] md:text-[13px] text-muted leading-relaxed tracking-[0.03em]">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Manifesto ── */}
      <section className="px-5 md:px-10 py-16 md:py-24 border-b border-primary/10">
        <h2 className="font-display text-[32px] sm:text-[48px] md:text-[88px] leading-[0.9] tracking-[0.02em] max-w-[820px] mb-8 md:mb-12">
          THE ONES WHO MOVE DIFFERENT DON'T WAIT FOR PERMISSION.
        </h2>
        <Link
          to="/shop"
          className="inline-flex items-center gap-3 bg-primary text-text-dark px-6 md:px-8 py-3 md:py-3.5 text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-primary/85 transition-colors duration-200"
        >
          Shop the Collection <ArrowRight size={12} strokeWidth={2.2} />
        </Link>
      </section>

    </main>
  )
}

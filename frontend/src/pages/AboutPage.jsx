import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import heroImg from '../assets/top.webp'
import quoteImg from '../assets/image.webp'
import workImg from '../assets/product.webp'
import Reveal from '../components/Reveal'

const principles = [
  {
    n: '01',
    title: 'Culture First',
    body: 'We move with the culture that makes the trends — never the one that waits to copy them.',
  },
  {
    n: '02',
    title: 'Built to Last',
    body: 'Premium fabric, deliberate cuts, zero shortcuts. Made to outlive the season it dropped in.',
  },
  {
    n: '03',
    title: 'Limited Always',
    body: "Every run is small on purpose. When it's gone, it's gone — no restocks, no apologies.",
  },
]

export default function AboutPage() {
  return (
    <main className="bg-background text-primary overflow-x-clip">

      {/* ══ Hero — type crashes in left, image bleeds off the right ══ */}
      <section className="relative min-h-[86vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 md:left-auto md:right-0 md:w-[58%]">
          <img src={heroImg} alt="" className="w-full h-full object-cover object-[50%_25%]" />
          <div className="absolute inset-0 bg-background/65 md:hidden" />
          <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-background via-background/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        </div>

        <span className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 text-[9px] font-bold tracking-[0.45em] uppercase text-primary/30">
          Est. 2024 · Lagos
        </span>

        <div className="relative z-10 w-full px-5 md:pl-16 md:pr-10">
          <p className="text-[10px] font-bold tracking-[0.4em] text-primary/55 uppercase mb-5">
            The Cokerflux story
          </p>
          <h1 className="font-display leading-[0.78] tracking-[0.01em] -ml-[2px] md:-ml-1">
            <span className="block text-[58px] sm:text-[104px] md:text-[150px] lg:text-[188px]">WE WERE</span>
            <span className="block text-[58px] sm:text-[104px] md:text-[150px] lg:text-[188px] whitespace-nowrap">BUILT DIFFERENT</span>
          </h1>
        </div>
      </section>

      {/* ══ Founder's note — asymmetric, first person, no centered column ══ */}
      <section className="px-5 md:px-16 py-16 md:py-28 border-t border-primary/10">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-3">
            <Reveal>
              <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-muted mb-4">
                A note from the founder
              </p>
              <p className="text-[11px] tracking-[0.15em] uppercase text-primary/40 leading-relaxed hidden md:block">
                Coker<br />Founder, Cokerflux
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-8 md:col-start-5">
            <Reveal>
              <h2 className="font-display text-[34px] sm:text-[52px] md:text-[76px] leading-[0.86] tracking-[0.01em] mb-9 md:mb-12 max-w-[16ch]">
                I DIDN'T SET OUT TO BUILD A BRAND. I SET OUT TO FIX A PROBLEM.
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <div className="max-w-[520px] space-y-5 text-[15px] md:text-[16px] leading-relaxed tracking-[0.02em] text-primary/75">
                <p>
                  Nothing on the shelves in Lagos fit the way we actually move — imports cut
                  for another climate, another body, another life. Runway pieces priced like
                  they were never meant for the street in the first place.
                </p>
                <p>
                  So I made one hoodie, exactly the way I wanted it, and dropped it to a
                  handful of people. They wore it like it meant something, and asked for the
                  next one before I'd even made it.
                </p>
                <p className="text-primary">
                  That was the whole plan. It still is — small runs, made right, for the
                  people who already get it.
                </p>
              </div>
              <p className="md:hidden mt-8 text-[11px] tracking-[0.15em] uppercase text-primary/40">
                — Coker, Founder
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ Rhythm break — pull-quote left, photo confined right, diagonal cut on the PHOTO only ══ */}
      <section className="relative bg-background overflow-hidden min-h-[68vh] flex items-end pt-28 md:pt-40 pb-14 md:pb-20">
        {/* Photo layer: full-bleed on mobile, right ~56% on desktop. The clip-path lives here,
            so it shapes the image edge and never touches the heading. */}
        <div
          className="absolute inset-0 md:left-auto md:right-0 md:w-[56%]"
          style={{ clipPath: 'polygon(0 clamp(32px,6vw,96px), 100% 0, 100% 100%, 0 100%)' }}
        >
          <img src={quoteImg} alt="" className="w-full h-full object-cover object-center" />
          {/* darken, then fade the photo's left edge into the dark section so the heading stays legible */}
          <div className="absolute inset-0 bg-background/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/55 md:via-background/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Heading: left column, sits fully inside the section — never crosses the cut line */}
        <div className="relative z-10 w-full px-5 md:px-16">
          <Reveal>
            <h2 className="font-display text-[40px] sm:text-[64px] md:text-[96px] lg:text-[116px] leading-[0.82] tracking-[0.01em] max-w-[13ch] md:max-w-[600px]">
              WE DON'T DROP FOR EVERYONE. WE DROP FOR THE ONES WHO GET IT.
            </h2>
          </Reveal>
        </div>
      </section>

      {/* ══ Principles — asymmetric rows, NOT a 3-icon grid ══ */}
      <section className="px-5 md:px-16 py-16 md:py-24">
        <Reveal>
          <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-muted mb-10 md:mb-16">
            How we move
          </p>
        </Reveal>
        <div>
          {principles.map((p, i) => (
            <Reveal key={p.n} delay={i * 60}>
              <div className="grid md:grid-cols-12 items-baseline gap-4 md:gap-8 py-8 md:py-12 border-t border-primary/10">
                <p className="md:col-span-2 font-display text-[44px] md:text-[72px] leading-none text-primary/15">
                  {p.n}
                </p>
                <h3 className="md:col-span-4 font-display text-[26px] md:text-[38px] tracking-[0.04em] leading-none">
                  {p.title}
                </h3>
                <p className="md:col-span-5 md:col-start-8 text-[14px] md:text-[15px] text-muted leading-relaxed tracking-[0.02em] max-w-[420px]">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ The work — one image, treated big ══ */}
      <section className="relative">
        <div className="relative h-[70vh] md:h-[92vh] overflow-hidden">
          <img src={workImg} alt="Cokerflux SS25" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/20" />
          <div className="absolute bottom-6 md:bottom-8 left-5 md:left-16 right-5 flex items-end justify-between">
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-primary/70">
              SS25 — Shot in Lagos
            </p>
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-primary/40 hidden sm:block">
              No models. Just us.
            </p>
          </div>
        </div>
      </section>

      {/* ══ Closing — cropped wordmark + CTA ══ */}
      <section className="relative px-5 md:px-16 pt-16 md:pt-24 overflow-hidden">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8 md:mb-10">
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-muted max-w-[300px] leading-relaxed">
              You've read the why. The rest is on the rack.
            </p>
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 text-[13px] font-bold tracking-[0.25em] uppercase text-primary border-b border-primary/30 hover:border-primary pb-1 transition-colors duration-200"
            >
              Shop the drop
              <ArrowUpRight size={15} strokeWidth={2.2} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>
        <h2
          aria-hidden="true"
          className="font-display text-primary/[0.07] leading-[0.7] tracking-[0.02em] select-none pointer-events-none text-[22vw] translate-y-[12%]"
        >
          BUILT DIFFERENT
        </h2>
      </section>

    </main>
  )
}

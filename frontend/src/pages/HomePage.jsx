import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowRight, Loader2 } from 'lucide-react'
import { useProducts } from '../context/productContextValue'
import hero from '../assets/hero.webp'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'

const marqueeItems = [
  'SS25 Live', 'Built Different', 'Small Numbers', 'Lagos Made', 'Cokerflux',
]

export default function HomePage() {
  const { products, loading } = useProducts()

  const featured = products.slice(0, 5)
  const editorialImg =
    products[3]?.image || products[2]?.image || products[0]?.image || hero

  return (
    <main className="bg-background text-primary overflow-x-clip">

      {/* ══ Hero — asymmetric: type crashes in from the left, image bleeds off the right ══ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Image plate: full-bleed on mobile, right ~64% on desktop, running off the edge */}
        <div className="absolute inset-0 md:left-auto md:right-0 md:w-[64%]">
          <img
            src={hero}
            alt=""
            className="w-full h-full object-cover object-[50%_20%]"
          />
          {/* mobile: flat scrim for legibility. desktop: horizontal fade into the dark so type sits over it */}
          <div className="absolute inset-0 bg-background/65 md:hidden" />
          <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-background via-background/45 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Vertical edge marker — small hand-set detail */}
        <span className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 text-[9px] font-bold tracking-[0.45em] uppercase text-primary/30">
          Est. Lagos · Vol. 01
        </span>

        <div className="relative z-10 w-full px-5 md:pl-16 md:pr-10">
          <p className="text-[10px] font-bold tracking-[0.4em] text-primary/55 uppercase mb-5">
            Lagos, Nigeria — SS25
          </p>

          {/* Oversized, tight, allowed to run past its column into the image */}
          <h1 className="font-display leading-[0.78] tracking-[0.01em] text-primary -ml-[2px] md:-ml-1 mb-9">
            <span className="block text-[68px] sm:text-[120px] md:text-[180px] lg:text-[224px]">
              BUILT
            </span>
            <span className="block text-[68px] sm:text-[120px] md:text-[180px] lg:text-[224px] whitespace-nowrap">
              DIFFERENT
            </span>
          </h1>

          <p className="text-[15px] md:text-[16px] text-primary/70 leading-snug tracking-[0.02em] max-w-[380px] mb-9">
            A frequency, not a brand. Cut for the ones who set the tone —
            never the ones who wait for it.
          </p>

          <div className="flex items-center gap-6">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 bg-primary text-text-dark pl-7 pr-6 py-3.5 text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-primary/85 transition-colors duration-200"
            >
              See the drop
              <ArrowUpRight size={14} strokeWidth={2.2} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to="/about"
              className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary/45 hover:text-primary transition-colors duration-200 border-b border-primary/20 hover:border-primary/60 pb-px"
            >
              Our story
            </Link>
          </div>
        </div>
      </section>

      {/* ══ Marquee band ══ */}
      <div className="border-y border-primary/10 bg-surface overflow-hidden py-[14px]">
        <div className="flex gap-16 whitespace-nowrap animate-ticker">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((t, i) => (
            <span key={i} className="text-[10px] font-bold tracking-[0.28em] uppercase text-muted">
              {t} <span className="opacity-25 mx-2">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ The Drop — editorial grid, one piece runs large, the rest hold rank ══ */}
      <section className="px-4 md:px-10 pt-14 md:pt-24 pb-16 md:pb-28">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-9 md:mb-12">
            <div>
              <p className="text-[10px] font-bold tracking-[0.35em] text-muted uppercase mb-3">
                SS25 — Limited runs
              </p>
              <h2 className="font-display text-[52px] sm:text-[76px] md:text-[104px] leading-[0.82] tracking-[0.01em]">
                THE DROP
              </h2>
            </div>
            <div className="md:text-right md:pb-3 max-w-[300px]">
              <p className="text-[13px] text-muted leading-snug tracking-[0.02em] mb-3">
                Five pieces. Small numbers. When they're gone, that's the whole
                conversation.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase text-primary border-b border-primary/25 hover:border-primary pb-px transition-colors duration-200"
              >
                Everything <ArrowRight size={11} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </Reveal>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={24} className="animate-spin text-muted" />
          </div>
        ) : featured.length === 0 ? (
          <div className="flex items-center justify-center py-32 border border-primary/10">
            <p className="text-[12px] font-bold tracking-[0.2em] uppercase text-muted">
              The next drop is loading
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[58vw] md:auto-rows-[23vw] gap-px bg-primary/10">
            {featured.map((p, i) => {
              const big = i === 0
              return (
                <Reveal
                  key={p.id}
                  delay={Math.min(i, 4) * 55}
                  className={big ? 'col-span-2 md:row-span-2' : 'col-span-1'}
                >
                  <ProductCard p={p} big={big} />
                </Reveal>
              )
            })}
          </div>
        )}
      </section>

      {/* ══ Rhythm break — full-bleed editorial, diagonal top edge, type set INTO the image ══ */}
      <section
        className="relative min-h-[80vh] flex items-end overflow-hidden"
        style={{ clipPath: 'polygon(0 clamp(28px,6vw,90px), 100% 0, 100% 100%, 0 100%)' }}
      >
        <img
          src={editorialImg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-background/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 to-transparent" />

        <div className="relative z-10 w-full px-5 md:px-16 pb-14 md:pb-20">
          <Reveal>
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary/60 mb-5">
              The ethos
            </p>
            <h2 className="font-display text-[52px] sm:text-[92px] md:text-[130px] lg:text-[158px] leading-[0.8] tracking-[0.01em] max-w-[15ch]">
              WORN BY THE ONES WHO MOVE
            </h2>
          </Reveal>
          <Reveal delay={90}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mt-8">
              <p className="text-[14px] text-primary/70 leading-snug tracking-[0.02em] max-w-[360px]">
                We don't chase seasons or ask for permission. Every run is small,
                every cut deliberate, and nothing gets remade once it's gone.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-3 text-[11px] font-bold tracking-[0.25em] uppercase text-primary border-b border-primary/40 hover:border-primary pb-px transition-colors duration-200 whitespace-nowrap"
              >
                Read the story <ArrowRight size={11} strokeWidth={2} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ Closing — the wordmark, oversized and cropped off the bottom edge ══ */}
      <section className="relative px-5 md:px-10 pt-16 md:pt-24 overflow-hidden">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8 md:mb-10">
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-muted max-w-[280px] leading-relaxed">
              The SS25 drop is live. Small numbers, no restocks.
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

        {/* Giant wordmark, clipped by the section's bottom — reads as a print bleed */}
        <h2
          aria-hidden="true"
          className="font-display text-primary/[0.07] leading-[0.7] tracking-[0.02em] select-none pointer-events-none text-[26vw] translate-y-[12%]"
        >
          COKERFLUX
        </h2>
      </section>

    </main>
  )
}

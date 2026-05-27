import { Link } from 'react-router-dom'
import { ArrowRight, ArrowDown } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { products as allProducts } from '../data/products'
import hero from '../assets/hero.webp'

const products = allProducts.slice(0, 3)

const marqueeItems = [
  'New Drop SS25', 'Built Different', 'Limited Stock', 'Free Shipping ₦50K+', 'Cokerflux',
]

export default function HomePage() {
  const { formatPrice } = useCurrency()
  return (
    <main className="bg-background text-primary">

      {/* ── Hero ── */}
      <section className="relative min-h-[calc(90vh-98px)] flex flex-col justify-center pb-16 px-10">
        <img
          src={hero}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-background/55" />

        <div className="relative z-10 max-w-[680px]">
          <p className="text-[10px] font-bold tracking-[0.35em] text-primary/50 uppercase mb-4">
            Spring / Summer 2025
          </p>
          <h1 className="font-display text-[96px] md:text-[128px] leading-[0.88] tracking-[0.02em] text-primary mb-10">
            BUILT<br />DIFFERENT
          </h1>
          <div className="flex items-center gap-7">
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 bg-primary text-text-dark px-8 py-3.5 text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-primary/85 transition-colors duration-200"
            >
              Shop SS25 <ArrowRight size={12} strokeWidth={2.2} />
            </Link>
            <Link
              to="/about"
              className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary/50 hover:text-primary transition-colors duration-200 border-b border-primary/20 pb-px"
            >
              Our Story
            </Link>
          </div>
        </div>

        <div className="absolute bottom-7 right-10 flex items-center gap-2 text-primary/25 z-10">
          <span className="text-[9px] tracking-[0.2em] uppercase font-bold">Scroll</span>
          <ArrowDown size={11} strokeWidth={1.5} />
        </div>
      </section>

      {/* ── Marquee band ── */}
      <div className="border-y border-primary/10 bg-surface overflow-hidden py-[14px]">
        <div className="flex gap-16 whitespace-nowrap animate-ticker">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((t, i) => (
            <span key={i} className="text-[10px] font-bold tracking-[0.28em] uppercase text-muted">
              {t} <span className="opacity-25 mx-2">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── The Drop ── */}
      <section className="px-10 py-20 border-b border-primary/10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-2">SS25 Collection</p>
            <h2 className="font-display text-[52px] leading-none tracking-[0.04em]">THE DROP</h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-muted hover:text-primary transition-colors duration-200 border-b border-muted/20 pb-px"
          >
            View All <ArrowRight size={11} strokeWidth={2} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-primary/8">
          {products.map((p) => (
            <Link to={`/product/${p.id}`} key={p.id} className="group bg-background hover:bg-surface transition-colors duration-300">
              <div className="aspect-[3/4] bg-surface relative overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-background/10 group-hover:bg-background/0 transition-colors duration-300" />
                {p.tag && (
                  <span className="absolute top-4 left-4 text-[9px] font-bold tracking-[0.25em] uppercase bg-primary text-text-dark px-2 py-[3px]">
                    {p.tag}
                  </span>
                )}
                <p className="absolute bottom-4 left-4 text-[10px] tracking-[0.15em] text-primary uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {p.category}
                </p>
              </div>
              <div className="px-5 py-4 flex items-center justify-between border-t border-primary/8">
                <div>
                  <p className="text-[12px] font-bold tracking-[0.08em] uppercase mb-0.5">{p.name}</p>
                  <p className="text-[12px] text-muted tracking-[0.04em]">{formatPrice(p.price)}</p>
                </div>
                <span className="w-8 h-8 border border-primary/15 flex items-center justify-center text-primary/30 group-hover:text-primary group-hover:border-primary/50 transition-all duration-200">
                  <ArrowRight size={13} strokeWidth={1.5} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Brand statement ── */}
      <section className="px-10 py-24 border-b border-primary/10">
        <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-6">The Ethos</p>
        <h2 className="font-display text-[64px] md:text-[96px] leading-[0.9] tracking-[0.02em] max-w-[860px] mb-10">
          NOT MADE FOR EVERYONE. MADE FOR THE ONES WHO MOVE.
        </h2>
        <p className="text-[14px] text-muted leading-relaxed tracking-[0.03em] max-w-[420px] mb-10">
          Cokerflux isn't a brand — it's a frequency. Worn by those who don't ask for permission, built for the culture that sets the tone.
        </p>
        <Link
          to="/about"
          className="inline-flex items-center gap-3 text-[11px] font-bold tracking-[0.25em] uppercase text-primary border-b border-primary/30 pb-px hover:border-primary transition-colors duration-200"
        >
          Read Our Story <ArrowRight size={11} strokeWidth={2} />
        </Link>
      </section>

    </main>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, SlidersHorizontal } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { products as allProducts } from '../data/products'

const filters = ['All', 'Hoodies', 'Tees', 'Accessories']

export default function Shop() {
  const [active, setActive] = useState('All')
  const { formatPrice } = useCurrency()

  const visible = active === 'All'
    ? allProducts
    : allProducts.filter(p => p.category === active)

  return (
    <main className="bg-background text-primary min-h-screen">

      {/* ── Banner ── */}
      <section className="px-10 py-16 border-b border-primary/10">
        <p className="text-[10px] font-bold tracking-[0.35em] text-muted uppercase mb-3">
          Spring / Summer 2025
        </p>
        <h1 className="font-display text-[80px] md:text-[110px] leading-[0.88] tracking-[0.02em]">
          THE<br />COLLECTION
        </h1>
      </section>

      {/* ── Filter bar ── */}
      <div className="flex items-center justify-between px-10 py-5 border-b border-primary/10 sticky top-[98px] bg-background z-10">
        <div className="flex items-center gap-1">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-5 py-2 text-[10px] font-bold tracking-[0.22em] uppercase transition-all duration-200
                ${active === f
                  ? 'bg-primary text-text-dark'
                  : 'text-muted hover:text-primary border border-transparent hover:border-primary/20'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-muted">
          <SlidersHorizontal size={13} strokeWidth={1.6} />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{visible.length} Items</span>
        </div>
      </div>

      {/* ── Product grid ── */}
      <section className="px-10 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-primary/8">
          {visible.map(p => (
            <Link key={p.id} to={`/product/${p.id}`} className="group bg-background hover:bg-surface transition-colors duration-300">
              <div className="aspect-[3/4] bg-surface relative overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-background/10 group-hover:bg-background/0 transition-colors duration-300" />
                {p.tag && (
                  <span className="absolute top-3 left-3 text-[9px] font-bold tracking-[0.25em] uppercase bg-primary text-text-dark px-2 py-[3px]">
                    {p.tag}
                  </span>
                )}
                <p className="absolute bottom-3 left-3 text-[10px] tracking-[0.15em] text-primary uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {p.category}
                </p>
              </div>
              <div className="px-4 py-4 flex items-center justify-between border-t border-primary/8">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.08em] uppercase mb-0.5">{p.name}</p>
                  <p className="text-[11px] text-muted tracking-[0.04em]">{formatPrice(p.price)}</p>
                </div>
                <span className="w-7 h-7 border border-primary/15 flex items-center justify-center text-primary/30 group-hover:text-primary group-hover:border-primary/50 transition-all duration-200">
                  <ArrowRight size={12} strokeWidth={1.5} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  )
}

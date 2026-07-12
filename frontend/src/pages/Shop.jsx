import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ChevronDown, X, Loader2 } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { useProducts } from '../context/productContextValue'
import ProductImage from '../components/ProductImage'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const SORT_OPTIONS = [
  { value: 'default',    label: 'Curated'             },
  { value: 'price-asc',  label: 'Price: Low to High'  },
  { value: 'price-desc', label: 'Price: High to Low'  },
  { value: 'newest',     label: 'Newest'              },
]

/* Editorial product tile — variable size, instant second-angle swap on hover */
function ProductTile({ p, big, formatPrice }) {
  const second = p.images?.[1]?.url
  return (
    <Link
      to={`/product/${p.id}`}
      className="group relative block w-full h-full bg-background overflow-hidden"
    >
      <ProductImage
        src={p.image}
        alt={p.name}
        wrapperClassName="w-full h-full"
        className="w-full h-full object-cover"
      />

      {/* Second angle: sits on top, appears instantly (no fade) on hover */}
      {second && (
        <img
          src={second}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-none pointer-events-none"
        />
      )}

      {/* legibility scrim — tall + dark enough to fully contain category, name and price */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none" />

      {p.tag && (
        <span className="absolute top-2.5 left-2.5 md:top-4 md:left-4 z-10 text-[8px] md:text-[9px] font-bold tracking-[0.25em] uppercase bg-primary text-text-dark px-2 py-[3px]">
          {p.tag}
        </span>
      )}

      <span className="absolute top-2.5 right-2.5 md:top-4 md:right-4 z-10 w-8 h-8 border border-primary/20 bg-background/30 backdrop-blur-sm flex items-center justify-center text-primary/60 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
        <ArrowUpRight size={13} strokeWidth={2} />
      </span>

      <div className="absolute inset-x-0 bottom-0 z-10 p-2.5 md:p-4">
        <p className="text-[9px] tracking-[0.2em] uppercase text-primary/50 mb-1 truncate">{p.category}</p>
        <div className="flex items-end justify-between gap-3">
          {/* flex-1 + min-w-0 lets the name take the free space and wrap up to 2 lines
              instead of collapsing to a single clipped character */}
          <p className={`flex-1 min-w-0 font-bold tracking-[0.06em] uppercase leading-tight line-clamp-2 ${big ? 'text-[15px] md:text-[19px]' : 'text-[11px] md:text-[13px]'}`}>
            {p.name}
          </p>
          <p className={`shrink-0 text-muted tracking-[0.03em] leading-tight ${big ? 'text-[14px] md:text-[16px]' : 'text-[11px] md:text-[12px]'}`}>
            {formatPrice(p.price, p.price_ghs)}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default function Shop() {
  const { formatPrice } = useCurrency()
  const { products, categories, loading, error } = useProducts()

  const [active, setActive]           = useState('All')
  const [selectedSizes, setSelectedSizes] = useState([])
  const [minPrice, setMinPrice]       = useState('')
  const [maxPrice, setMaxPrice]       = useState('')
  const [sortBy, setSortBy]           = useState('default')
  const [showFilters, setShowFilters] = useState(false)
  const [sortOpen, setSortOpen]       = useState(false)

  const activeFilterCount = useMemo(() => {
    let n = 0
    if (selectedSizes.length) n += 1
    if (minPrice !== '' || maxPrice !== '') n += 1
    return n
  }, [selectedSizes, minPrice, maxPrice])

  const visible = useMemo(() => {
    let list = active === 'All' ? products : products.filter(p => p.category === active)

    if (selectedSizes.length > 0) {
      list = list.filter(p => p.sizes && p.sizes.some(s => selectedSizes.includes(s)))
    }
    if (minPrice !== '') list = list.filter(p => p.price >= Number(minPrice))
    if (maxPrice !== '') list = list.filter(p => p.price <= Number(maxPrice))

    if (sortBy === 'price-asc')  return [...list].sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') return [...list].sort((a, b) => b.price - a.price)
    if (sortBy === 'newest')     return [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    return list
  }, [products, active, selectedSizes, minPrice, maxPrice, sortBy])

  function toggleSize(s) {
    setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  function clearAllFilters() {
    setActive('All')
    setSelectedSizes([])
    setMinPrice('')
    setMaxPrice('')
    setSortBy('default')
  }

  const hasAnyFilter = active !== 'All' || selectedSizes.length || minPrice !== '' || maxPrice !== '' || sortBy !== 'default'

  // Editorial rhythm: first tile large, then every 7th — keeps a magazine feel at any count.
  const isBig = (i) => i % 7 === 0

  return (
    <main className="bg-background text-primary min-h-screen">

      {/* ══ Banner ══ */}
      <section className="px-5 md:px-16 pt-14 md:pt-20 pb-8 md:pb-12">
        <p className="text-[10px] font-bold tracking-[0.4em] text-muted uppercase mb-4">
          SS25 — Limited runs
        </p>
        <h1 className="font-display text-[56px] sm:text-[92px] md:text-[132px] leading-[0.8] tracking-[0.01em]">
          THE<br />COLLECTION
        </h1>
      </section>

      {/* ══ Filter bar — underline actions, sharp edges, no boxed pills ══ */}
      <div className="sticky top-[98px] bg-background/95 backdrop-blur-sm z-20 border-y border-primary/10">

        {/* Row 1: categories + controls */}
        <div className="flex items-center justify-between px-4 md:px-16 gap-4">
          <div className="flex items-center gap-5 md:gap-7 overflow-x-auto no-scrollbar py-4 -mx-1 px-1">
            {categories.map(f => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`relative text-[11px] font-bold tracking-[0.22em] uppercase whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors duration-200
                  ${active === f
                    ? 'text-primary border-primary'
                    : 'text-muted border-transparent hover:text-primary'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-5 md:gap-7 shrink-0">
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`hidden sm:flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase pb-1 border-b-2 transition-colors duration-200
                ${showFilters || activeFilterCount > 0 ? 'text-primary border-primary' : 'text-muted border-transparent hover:text-primary'}`}
            >
              Filter
              {activeFilterCount > 0 && <span className="text-primary/60">[{activeFilterCount}]</span>}
            </button>

            {/* Sort — custom, sharp, no native select */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(v => !v)}
                className={`flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase pb-1 border-b-2 transition-colors duration-200
                  ${sortOpen || sortBy !== 'default' ? 'text-primary border-primary' : 'text-muted border-transparent hover:text-primary'}`}
              >
                <span className="hidden sm:inline">Sort —</span>
                {SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? 'Sort'}
                <ChevronDown size={11} strokeWidth={2.4} className={`transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-surface border border-primary/15 z-30">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setSortOpen(false) }}
                      className={`w-full text-left px-4 py-3 text-[10px] font-bold tracking-[0.18em] uppercase transition-colors duration-150 border-l-2
                        ${sortBy === opt.value ? 'text-primary border-primary bg-primary/5' : 'text-muted border-transparent hover:text-primary hover:border-primary/40'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowFilters(v => !v)}
              className="sm:hidden text-[11px] font-bold tracking-[0.2em] uppercase text-muted"
            >
              Filter{activeFilterCount > 0 ? ` [${activeFilterCount}]` : ''}
            </button>
          </div>
        </div>

        {/* Row 2: expanded filter panel */}
        {showFilters && (
          <div className="px-4 md:px-16 pb-6 border-t border-primary/10 pt-5 flex flex-wrap items-start gap-x-12 gap-y-6">
            {/* Size */}
            <div>
              <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-muted mb-3">Size</p>
              <div className="flex flex-wrap gap-4">
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`text-[11px] font-bold tracking-[0.12em] uppercase pb-1 border-b-2 transition-colors duration-150
                      ${selectedSizes.includes(s)
                        ? 'text-primary border-primary'
                        : 'text-muted border-transparent hover:text-primary'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-muted mb-3">Price Range</p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  className="w-24 px-0 py-1 text-[12px] font-bold tracking-[0.08em] bg-transparent border-b-2 border-primary/20 text-primary placeholder:text-muted/50 focus:border-primary outline-none transition-colors duration-150"
                />
                <span className="text-muted text-[11px]">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  className="w-24 px-0 py-1 text-[12px] font-bold tracking-[0.08em] bg-transparent border-b-2 border-primary/20 text-primary placeholder:text-muted/50 focus:border-primary outline-none transition-colors duration-150"
                />
              </div>
            </div>

            {/* Clear */}
            {hasAnyFilter && (
              <div className="flex items-end self-stretch">
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-muted hover:text-primary transition-colors duration-150"
                >
                  <X size={11} strokeWidth={2} />
                  Clear all
                </button>
              </div>
            )}
          </div>
        )}

        {sortOpen && <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />}
      </div>

      {/* ══ Product grid — editorial, varied sizes ══ */}
      <section className="px-4 md:px-16 py-8 md:py-12">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={24} className="animate-spin text-muted" />
          </div>
        ) : error ? (
          <div className="border border-primary/10 py-24 md:py-32 px-6 text-center">
            <p className="font-display text-[40px] md:text-[64px] leading-[0.85] tracking-[0.02em] text-primary/80 mb-4">
              SOMETHING BROKE
            </p>
            <p className="text-[13px] text-muted tracking-[0.02em] mb-8 max-w-[380px] mx-auto">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary border-b border-primary/40 hover:border-primary pb-1 transition-colors duration-200"
            >
              Try again
            </button>
          </div>
        ) : visible.length === 0 ? (
          /* Intentional empty state — not a bare "No products found" */
          <div className="border border-primary/10 py-24 md:py-36 px-6 flex flex-col items-center text-center">
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-muted mb-6">
              {(active !== 'All' ? active : 'The rack') + ' — 0 pieces'}
            </p>
            <h2 className="font-display text-[46px] sm:text-[72px] md:text-[104px] leading-[0.82] tracking-[0.02em] text-primary mb-5 max-w-[14ch]">
              NOTHING IN THIS LANE
            </h2>
            <p className="text-[14px] text-muted leading-relaxed tracking-[0.02em] max-w-[400px] mb-9">
              Nothing matches that combination right now. Loosen the filters, or step back
              and see the whole drop.
            </p>
            <div className="flex items-center gap-7">
              {hasAnyFilter && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary border-b border-primary/40 hover:border-primary pb-1 transition-colors duration-200"
                >
                  Clear filters
                </button>
              )}
              <button
                onClick={() => setActive('All')}
                className="text-[11px] font-bold tracking-[0.25em] uppercase text-muted hover:text-primary transition-colors duration-200"
              >
                View everything
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[62vw] sm:auto-rows-[44vw] md:auto-rows-[22vw] gap-px bg-primary/10 grid-flow-row-dense">
            {visible.map((p, i) => {
              const big = isBig(i)
              return (
                <div
                  key={p.id}
                  className={big ? 'col-span-2 row-span-1 md:row-span-2' : 'col-span-1'}
                >
                  <ProductTile p={p} big={big} formatPrice={formatPrice} />
                </div>
              )
            })}
          </div>
        )}
      </section>

    </main>
  )
}

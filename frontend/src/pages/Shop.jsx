import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, SlidersHorizontal, ChevronDown, X, Loader2 } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { useProducts } from '../context/productContextValue'
import ProductImage from '../components/ProductImage'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const SORT_OPTIONS = [
  { value: 'default',    label: 'Default'             },
  { value: 'price-asc',  label: 'Price: Low to High'  },
  { value: 'price-desc', label: 'Price: High to Low'  },
  { value: 'newest',     label: 'Newest'               },
]

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

  return (
    <main className="bg-background text-primary min-h-screen">

      {/* ── Banner ── */}
      <section className="px-5 md:px-10 py-10 md:py-16 border-b border-primary/10">
        <p className="text-[10px] font-bold tracking-[0.35em] text-muted uppercase mb-3">
          Spring / Summer 2025
        </p>
        <h1 className="font-display text-[48px] sm:text-[70px] md:text-[110px] leading-[0.88] tracking-[0.02em]">
          THE<br />COLLECTION
        </h1>
      </section>

      {/* ── Filter bar ── */}
      <div className="sticky top-[98px] bg-background z-10 border-b border-primary/10">

        {/* Row 1: categories + controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 md:px-10 py-4 md:py-5 gap-3 sm:gap-0">
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 -mx-1 px-1">
            {categories.map(f => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-3 md:px-5 py-2 text-[10px] font-bold tracking-[0.22em] uppercase transition-all duration-200 whitespace-nowrap shrink-0
                  ${active === f
                    ? 'bg-primary text-text-dark'
                    : 'text-muted hover:text-primary border border-transparent hover:border-primary/20'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-200 px-3 py-2 border
                ${showFilters ? 'bg-primary text-text-dark border-primary' : 'text-muted border-primary/20 hover:text-primary hover:border-primary/40'}`}
            >
              <SlidersHorizontal size={12} strokeWidth={1.8} />
              Filters
              {activeFilterCount > 0 && (
                <span className={`inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold rounded-full
                  ${showFilters ? 'bg-text-dark text-primary' : 'bg-primary text-text-dark'}`}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(v => !v)}
                className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-muted hover:text-primary transition-colors duration-200 px-3 py-2 border border-primary/20 hover:border-primary/40"
              >
                {SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? 'Sort'}
                <ChevronDown size={11} strokeWidth={2} className={`transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-background border border-primary/15 shadow-lg z-20">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setSortOpen(false) }}
                      className={`w-full text-left px-4 py-2.5 text-[10px] font-bold tracking-[0.15em] uppercase transition-colors duration-150
                        ${sortBy === opt.value ? 'bg-primary text-text-dark' : 'text-muted hover:text-primary hover:bg-primary/5'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted">{visible.length} Items</span>
          </div>
        </div>

        {/* Row 2: expanded filter panel */}
        {showFilters && (
          <div className="px-4 md:px-10 pb-5 border-t border-primary/8 pt-4 flex flex-wrap gap-6 md:gap-10">

            {/* Size */}
            <div>
              <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-muted mb-2">Size</p>
              <div className="flex flex-wrap gap-1.5">
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`w-9 h-9 text-[10px] font-bold tracking-[0.1em] uppercase border transition-all duration-150
                      ${selectedSizes.includes(s)
                        ? 'bg-primary text-text-dark border-primary'
                        : 'text-muted border-primary/20 hover:text-primary hover:border-primary/40'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-muted mb-2">Price Range</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  className="w-20 px-2 py-2 text-[10px] font-bold tracking-[0.1em] bg-transparent border border-primary/20 text-primary placeholder:text-muted/50 focus:border-primary/50 outline-none transition-colors duration-150"
                />
                <span className="text-muted text-[10px]">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  className="w-20 px-2 py-2 text-[10px] font-bold tracking-[0.1em] bg-transparent border border-primary/20 text-primary placeholder:text-muted/50 focus:border-primary/50 outline-none transition-colors duration-150"
                />
              </div>
            </div>

            {/* Clear */}
            {hasAnyFilter && (
              <div className="flex items-end">
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-muted hover:text-primary transition-colors duration-150"
                >
                  <X size={11} strokeWidth={2} />
                  Clear All
                </button>
              </div>
            )}
          </div>
        )}

        {/* Dismiss sort dropdown on outside click */}
        {sortOpen && (
          <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
        )}
      </div>

      {/* ── Product grid ── */}
      <section className="px-4 md:px-10 py-6 md:py-10">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={24} className="animate-spin text-muted" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <p className="text-[12px] font-bold tracking-[0.15em] uppercase text-muted">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary border border-primary/30 px-5 py-2 hover:bg-primary hover:text-text-dark transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <p className="text-[12px] font-bold tracking-[0.15em] uppercase text-muted">No products found</p>
            {hasAnyFilter && (
              <button
                onClick={clearAllFilters}
                className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary border border-primary/30 px-5 py-2 hover:bg-primary hover:text-text-dark transition-colors duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-primary/8">
            {visible.map(p => (
              <Link key={p.id} to={`/product/${p.id}`} className="group bg-background hover:bg-surface transition-colors duration-300">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <ProductImage
                    src={p.image}
                    alt={p.name}
                    wrapperClassName="w-full h-full"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-background/10 group-hover:bg-background/0 transition-colors duration-300" />
                  {p.tag && (
                    <span className="absolute top-2 left-2 md:top-3 md:left-3 text-[8px] md:text-[9px] font-bold tracking-[0.25em] uppercase bg-primary text-text-dark px-1.5 md:px-2 py-[2px] md:py-[3px]">
                      {p.tag}
                    </span>
                  )}
                  <p className="absolute bottom-3 left-3 text-[10px] tracking-[0.15em] text-primary uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                    {p.category}
                  </p>
                </div>
                <div className="px-2 md:px-4 py-3 md:py-4 flex items-center justify-between border-t border-primary/8">
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-[11px] font-bold tracking-[0.08em] uppercase mb-0.5 truncate">{p.name}</p>
                    <p className="text-[10px] md:text-[11px] text-muted tracking-[0.04em]">{formatPrice(p.price)}</p>
                  </div>
                  <span className="w-6 h-6 md:w-7 md:h-7 border border-primary/15 flex items-center justify-center text-primary/30 group-hover:text-primary group-hover:border-primary/50 transition-all duration-200 shrink-0 ml-1">
                    <ArrowRight size={10} strokeWidth={1.5} className="md:w-[12px] md:h-[12px]" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

    </main>
  )
}

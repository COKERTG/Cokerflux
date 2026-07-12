import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { X, Search } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { useProducts } from '../context/productContextValue'
import ProductImage from './ProductImage'

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const { formatPrice } = useCurrency()
  const { products, loading } = useProducts()

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    } else {
      setQuery('')
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const trimmed = query.trim()
  const results = trimmed.length > 0
    ? products.filter(p =>
        p.name.toLowerCase().includes(trimmed.toLowerCase()) ||
        p.category.toLowerCase().includes(trimmed.toLowerCase())
      )
    : []

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] bg-background/97 backdrop-blur-sm flex flex-col">

      {/* Input bar */}
      <div className="flex items-center px-6 md:px-10 h-[68px] border-b border-primary/15">
        <Search size={15} strokeWidth={1.5} className="text-muted mr-4 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search products..."
          className="flex-1 bg-transparent text-[13px] font-bold tracking-[0.15em] uppercase placeholder:text-muted/35 text-primary outline-none"
        />
        <button
          onClick={onClose}
          aria-label="Close search"
          className="text-muted hover:text-primary transition-colors duration-200 ml-4"
        >
          <X size={17} strokeWidth={1.5} />
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-6 md:px-10 py-10">
        {trimmed.length === 0 ? (
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted/35 text-center mt-20">
            Start typing to search
          </p>
        ) : loading ? (
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted/35 text-center mt-20">
            Loading…
          </p>
        ) : results.length === 0 ? (
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted/35 text-center mt-20">
            No results for &ldquo;{trimmed}&rdquo;
          </p>
        ) : (
          <div className="max-w-xl mx-auto divide-y divide-primary/10">
            <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-muted/40 pb-4">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            {results.map(p => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                onClick={onClose}
                className="flex items-center gap-5 py-4 -mx-2 px-2 group hover:bg-surface/40 transition-colors duration-150"
              >
                <div className="w-14 h-14 shrink-0 overflow-hidden">
                  <ProductImage
                    src={p.image}
                    alt={p.name}
                    wrapperClassName="w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-primary truncate">{p.name}</p>
                  <p className="text-[10px] text-muted tracking-[0.08em] mt-0.5 uppercase">{p.category}</p>
                </div>
                <p className="text-[11px] font-bold tracking-[0.06em] text-primary shrink-0">{formatPrice(p.price, p.price_ghs)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

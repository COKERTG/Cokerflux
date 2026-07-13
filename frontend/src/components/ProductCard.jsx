import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import ProductImage from './ProductImage'

/* Shared editorial product card — the single source of truth for how a product tile
   looks. Used by both the homepage drop grid and the shop grid so the two never drift
   apart again. The grid item wrapper (col-span / Reveal / animation) stays with each
   page; this component only owns the card itself.

   `big` bumps the name + price type for the oversized hero tile in each grid. */
export default function ProductCard({ p, big = false }) {
  const { formatPrice } = useCurrency()
  const second = p.images?.[1]?.url

  return (
    <Link
      to={`/product/${p.id}`}
      className="group relative block w-full h-full bg-background overflow-hidden"
    >
      {/* object-contain + padding + bg fill: every photo gets the same breathing room
          regardless of how tightly the source shot was cropped, instead of cover
          filling edge-to-edge and making tight crops look cramped. */}
      <ProductImage
        src={p.image}
        alt={p.name}
        wrapperClassName="w-full h-full product-backdrop"
        className="w-full h-full object-contain p-3 md:p-4"
      />

      {/* Second angle: sits on top, appears instantly (no fade) on hover.
          bg-background hides the base image behind the contain letterboxing. */}
      {second && (
        <img
          src={second}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain p-3 md:p-4 product-backdrop opacity-0 group-hover:opacity-100 transition-none pointer-events-none"
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

import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Minus, Plus, Loader2 } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/productContextValue'
import { api } from '../lib/api'
import ProductImage from '../components/ProductImage'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { formatPrice } = useCurrency()
  const { addItem } = useCart()
  const { products } = useProducts()

  const [product, setProduct]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [qty, setQty]               = useState(1)
  const [added, setAdded]           = useState(false)
  const [sizeError, setSizeError]   = useState(false)
  const [activeImg, setActiveImg]   = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      setSelectedSize(null)
      setQty(1)
      setAdded(false)
      setSizeError(false)
      try {
        const res = await api.getProduct(id)
        if (!res.ok) throw new Error('Product not found')
        const data = await res.json()
        setProduct(data.product)
        setActiveImg(0)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const related = useMemo(() => {
    if (!product) return []
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 3)
  }, [product, products])

  if (loading) {
    return (
      <main className="bg-background text-primary min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-muted" />
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="bg-background text-primary min-h-screen flex flex-col items-center justify-center gap-4 px-5">
        <p className="font-display text-[28px] md:text-[40px] tracking-[0.04em] text-center">PRODUCT NOT FOUND</p>
        <Link to="/shop" className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted hover:text-primary transition-colors">
          ← Back to Shop
        </Link>
      </main>
    )
  }

  function handleAddToCart() {
    if (product.sizes.length > 1 && !selectedSize) {
      setSizeError(true)
      return
    }
    // Build the cart item with a unique id per size variant
    const cartProduct = {
      ...product,
      id: selectedSize ? `${product.id}-${selectedSize}` : product.id,
      selectedSize: selectedSize || product.sizes[0] || 'One Size',
    }
    addItem(cartProduct, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main className="bg-background text-primary min-h-screen">

      {/* ── Breadcrumb ── */}
      <div className="px-4 md:px-10 py-4 border-b border-primary/10 flex items-center gap-2 md:gap-3 overflow-x-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-muted hover:text-primary transition-colors duration-200 shrink-0"
        >
          <ArrowLeft size={11} strokeWidth={2} /> Back
        </button>
        <span className="text-primary/15 shrink-0">◆</span>
        <Link to="/shop" className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted hover:text-primary transition-colors duration-200 shrink-0">
          Shop
        </Link>
        <span className="text-primary/15 shrink-0">◆</span>
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/50 truncate">
          {product.name}
        </span>
      </div>

      {/* ── Main layout ── */}
      <section className="grid md:grid-cols-2 border-b border-primary/10">

        {/* Left — gallery */}
        <div className="md:border-r border-primary/10">
          {/* Thumbnail strip (left) + main image — side by side on md+ */}
          <div className="flex flex-col-reverse md:flex-row md:h-full">

            {/* Thumbnail strip */}
            {product.images?.length > 1 && (
              <div className="flex md:flex-col gap-2 p-3 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto md:w-[76px] shrink-0 border-t md:border-t-0 md:border-r border-primary/10">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-14 md:w-full aspect-[3/4] overflow-hidden border-2 transition-all duration-150
                      ${activeImg === i ? 'border-primary' : 'border-transparent opacity-50 hover:opacity-80'}`}
                  >
                    <ProductImage src={img.url} alt="" wrapperClassName="w-full h-full product-backdrop" className="w-full h-full object-contain p-1.5" />
                  </button>
                ))}
              </div>
            )}

            {/* Main image — transparent PNG centered on the solid site bg with fixed padding */}
            <div className="flex-1 aspect-[4/5] relative overflow-hidden">
              <ProductImage
                src={product.images?.[activeImg]?.url || product.image}
                alt={product.name}
                wrapperClassName="w-full h-full product-backdrop"
                className="w-full h-full object-contain p-6 md:p-10"
              />
              {product.tag && (
                <span className="absolute top-4 left-4 md:top-6 md:left-6 text-[9px] font-bold tracking-[0.25em] uppercase bg-primary text-text-dark px-2 md:px-3 py-1">
                  {product.tag}
                </span>
              )}
              {product.tag === 'Limited' && (
                <span className="absolute top-4 right-4 md:top-6 md:right-6 text-[9px] font-bold tracking-[0.2em] uppercase text-muted border border-muted/30 px-2 md:px-3 py-1 bg-background/60 backdrop-blur-sm">
                  Low Stock
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right — info */}
        <div className="px-5 md:px-10 py-8 md:py-12 flex flex-col gap-6 md:gap-8">

          {/* Name + price */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-2 md:mb-3">
              {product.category}
            </p>
            <h1 className="font-display text-[36px] md:text-[52px] leading-[0.9] tracking-[0.03em] mb-3 md:mb-4">
              {product.name.toUpperCase()}
            </h1>
            <p className="text-[20px] md:text-[22px] font-bold tracking-[0.04em]">
              {formatPrice(product.price, product.price_ghs)}
            </p>
          </div>

          {/* Description */}
          <p className="text-[13px] md:text-[14px] text-muted leading-relaxed tracking-[0.03em] border-t border-primary/8 pt-6 md:pt-8">
            {product.description}
          </p>

          {/* Size selector */}
          <div className="border-t border-primary/8 pt-6 md:pt-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase">
                Size {selectedSize && <span className="text-primary/50 ml-2">— {selectedSize}</span>}
              </p>
              {sizeError && (
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-red-400">
                  Select a size
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => { setSelectedSize(size); setSizeError(false) }}
                  className={`min-w-[44px] md:min-w-[48px] h-[40px] md:h-[42px] px-3 text-[11px] font-bold tracking-[0.1em] uppercase border transition-all duration-200
                    ${selectedSize === size
                      ? 'bg-primary text-text-dark border-primary'
                      : 'border-primary/20 text-muted hover:border-primary/50 hover:text-primary'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Qty + Add to cart */}
          <div className="border-t border-primary/8 pt-6 md:pt-8 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted">Qty</p>
              <div className="flex items-center border border-primary/20">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-muted hover:text-primary transition-colors duration-200"
                >
                  <Minus size={13} strokeWidth={1.8} />
                </button>
                <span className="w-10 text-center text-[13px] font-bold tracking-[0.05em]">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-muted hover:text-primary transition-colors duration-200"
                >
                  <Plus size={13} strokeWidth={1.8} />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-4 text-[11px] font-bold tracking-[0.28em] uppercase transition-all duration-300 flex items-center justify-center gap-3
                ${added
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-primary text-text-dark hover:bg-primary/85'
                }`}
            >
              {added ? 'Added to Cart ✓' : <>Add to Cart <ArrowRight size={12} strokeWidth={2.2} /></>}
            </button>
          </div>

          {/* Product details */}
          <div className="border-t border-primary/8 pt-6 md:pt-8">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-4">Product Details</p>
            <ul className="flex flex-col gap-2">
              {product.details.map((d, i) => (
                <li key={i} className="flex items-start gap-3 text-[12px] md:text-[13px] text-muted tracking-[0.03em]">
                  <span className="text-primary/20 mt-[3px] text-[8px]">◆</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* ── Related products ── */}
      {related.length > 0 && (
        <section className="px-4 md:px-10 py-10 md:py-16">
          <div className="flex items-end justify-between mb-6 md:mb-8">
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-2">More</p>
              <h2 className="font-display text-[28px] md:text-[40px] leading-none tracking-[0.04em]">YOU MAY ALSO LIKE</h2>
            </div>
            <Link
              to="/shop"
              className="hidden md:inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-muted hover:text-primary transition-colors duration-200 border-b border-muted/20 pb-px"
            >
              View All <ArrowRight size={11} strokeWidth={2} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-primary/8">
            {related.map(p => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="group bg-background hover:bg-surface transition-colors duration-300"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <ProductImage
                    src={p.image}
                    alt={p.name}
                    wrapperClassName="w-full h-full product-backdrop"
                    className="w-full h-full object-contain p-3 md:p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                  {p.tag && (
                    <span className="absolute top-3 left-3 md:top-4 md:left-4 text-[8px] md:text-[9px] font-bold tracking-[0.25em] uppercase bg-primary text-text-dark px-1.5 md:px-2 py-[2px] md:py-[3px]">
                      {p.tag}
                    </span>
                  )}
                </div>
                <div className="px-3 md:px-5 py-3 md:py-4 flex items-center justify-between border-t border-primary/8">
                  <div className="min-w-0">
                    <p className="text-[11px] md:text-[12px] font-bold tracking-[0.08em] uppercase mb-0.5 truncate">{p.name}</p>
                    <p className="text-[11px] md:text-[12px] text-muted tracking-[0.04em]">{formatPrice(p.price, p.price_ghs)}</p>
                  </div>
                  <span className="w-7 h-7 md:w-8 md:h-8 border border-primary/15 flex items-center justify-center text-primary/30 group-hover:text-primary group-hover:border-primary/50 transition-all duration-200 shrink-0 ml-1">
                    <ArrowRight size={12} strokeWidth={1.5} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </main>
  )
}

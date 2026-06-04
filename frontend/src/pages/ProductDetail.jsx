import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Minus, Plus, Loader2 } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { useCart } from '../context/CartContext'
import { api } from '../lib/api'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { formatPrice } = useCurrency()
  const { addItem } = useCart()

  const [product, setProduct]       = useState(null)
  const [related, setRelated]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [qty, setQty]               = useState(1)
  const [added, setAdded]           = useState(false)
  const [sizeError, setSizeError]   = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    setSelectedSize(null)
    setQty(1)
    setAdded(false)
    setSizeError(false)

    api.getProduct(id)
      .then(res => {
        if (!res.ok) throw new Error('Product not found')
        return res.json()
      })
      .then(data => {
        setProduct(data.product)
        // Fetch all products to find related ones in the same category
        return api.getProducts()
      })
      .then(res => res.json())
      .then(data => {
        const all = data.products || []
        setRelated(all.filter(p => p.category === product?.category && p.id !== Number(id)).slice(0, 3))
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  // Update related products when the main product loads
  useEffect(() => {
    if (!product) return
    api.getProducts()
      .then(res => res.json())
      .then(data => {
        const all = data.products || []
        setRelated(all.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3))
      })
      .catch(() => {})
  }, [product])

  if (loading) {
    return (
      <main className="bg-background text-primary min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-muted" />
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="bg-background text-primary min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-display text-[40px] tracking-[0.04em]">PRODUCT NOT FOUND</p>
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
      <div className="px-10 py-4 border-b border-primary/10 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-muted hover:text-primary transition-colors duration-200"
        >
          <ArrowLeft size={11} strokeWidth={2} /> Back
        </button>
        <span className="text-primary/15">◆</span>
        <Link to="/shop" className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted hover:text-primary transition-colors duration-200">
          Shop
        </Link>
        <span className="text-primary/15">◆</span>
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/50">
          {product.name}
        </span>
      </div>

      {/* ── Main layout ── */}
      <section className="grid md:grid-cols-2 border-b border-primary/10">

        {/* Left — image */}
        <div className="border-r border-primary/10">
          <div className="aspect-[4/5] bg-surface relative overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.tag && (
              <span className="absolute top-6 left-6 text-[9px] font-bold tracking-[0.25em] uppercase bg-primary text-text-dark px-3 py-1">
                {product.tag}
              </span>
            )}
            {product.tag === 'Limited' && (
              <span className="absolute top-6 right-6 text-[9px] font-bold tracking-[0.2em] uppercase text-muted border border-muted/30 px-3 py-1 bg-background/60 backdrop-blur-sm">
                Low Stock
              </span>
            )}
          </div>
        </div>

        {/* Right — info */}
        <div className="px-10 py-12 flex flex-col gap-8">

          {/* Name + price */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-3">
              {product.category}
            </p>
            <h1 className="font-display text-[52px] leading-[0.9] tracking-[0.03em] mb-4">
              {product.name.toUpperCase()}
            </h1>
            <p className="text-[22px] font-bold tracking-[0.04em]">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Description */}
          <p className="text-[14px] text-muted leading-relaxed tracking-[0.03em] border-t border-primary/8 pt-8">
            {product.description}
          </p>

          {/* Size selector */}
          <div className="border-t border-primary/8 pt-8">
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
                  className={`min-w-[48px] h-[42px] px-3 text-[11px] font-bold tracking-[0.1em] uppercase border transition-all duration-200
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
          <div className="border-t border-primary/8 pt-8 flex flex-col gap-4">
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
          <div className="border-t border-primary/8 pt-8">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-4">Product Details</p>
            <ul className="flex flex-col gap-2">
              {product.details.map((d, i) => (
                <li key={i} className="flex items-start gap-3 text-[13px] text-muted tracking-[0.03em]">
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
        <section className="px-10 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-2">More</p>
              <h2 className="font-display text-[40px] leading-none tracking-[0.04em]">YOU MAY ALSO LIKE</h2>
            </div>
            <Link
              to="/shop"
              className="hidden md:inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-muted hover:text-primary transition-colors duration-200 border-b border-muted/20 pb-px"
            >
              View All <ArrowRight size={11} strokeWidth={2} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-primary/8">
            {related.map(p => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="group bg-background hover:bg-surface transition-colors duration-300"
              >
                <div className="aspect-[3/4] bg-surface relative overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {p.tag && (
                    <span className="absolute top-4 left-4 text-[9px] font-bold tracking-[0.25em] uppercase bg-primary text-text-dark px-2 py-[3px]">
                      {p.tag}
                    </span>
                  )}
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
      )}

    </main>
  )
}

import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Pencil, Crown, CheckCircle2, XCircle, Tag, Layers, Info, Image as ImageIcon, Loader2 } from 'lucide-react'
import { api } from '../../lib/api'

const TAG_COLORS = {
  New:     'bg-primary/15 text-primary',
  SS25:    'bg-primary/8 text-primary/70',
  Limited: 'bg-red-500/15 text-red-400',
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="border border-primary/10 bg-surface/40">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-primary/10 bg-surface">
        <Icon size={13} strokeWidth={1.8} className="text-muted" />
        <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-muted">{title}</p>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Field({ label, value, children }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[9px] font-bold tracking-[0.28em] uppercase text-muted/60">{label}</p>
      {children ?? <p className="text-[13px] tracking-[0.03em] text-primary">{value ?? '—'}</p>}
    </div>
  )
}

export default function AdminProductView() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res  = await api.getProduct(id)
        const data = await res.json()
        setProduct(data.product)
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={24} className="animate-spin text-muted" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <p className="font-display text-[28px] tracking-[0.04em] text-muted">PRODUCT NOT FOUND</p>
        <button onClick={() => navigate('/admin/products')} className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted hover:text-primary transition-colors">
          ← Back to Products
        </button>
      </div>
    )
  }

  const images = product.images?.length > 0 ? product.images : (product.image ? [{ id: 'main', url: product.image, is_primary: true }] : [])

  return (
    <div className="max-w-[960px]">

      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="text-muted hover:text-primary transition-colors duration-200"
          >
            <ArrowLeft size={16} strokeWidth={1.6} />
          </button>
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-1">Product #{product.id}</p>
            <h1 className="font-display text-[32px] md:text-[40px] leading-none tracking-[0.03em]">
              {product.name.toUpperCase()}
            </h1>
          </div>
        </div>

        <Link
          to={`/admin/products/${id}/edit`}
          className="inline-flex items-center gap-2 bg-primary text-text-dark px-4 py-2.5 text-[10px] font-bold tracking-[0.22em] uppercase hover:bg-primary/85 transition-colors duration-200 shrink-0"
        >
          <Pencil size={11} strokeWidth={2.2} /> Edit
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-5">

        {/* ── Left column ── */}
        <div className="flex flex-col gap-5">

          {/* Images */}
          <Section icon={ImageIcon} title={`Images (${images.length})`}>
            {images.length === 0 ? (
              <p className="text-[11px] text-muted/50 tracking-[0.1em]">No images uploaded</p>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Main image */}
                <div className="aspect-[3/4] w-full bg-background overflow-hidden border border-primary/8">
                  <img
                    src={images[activeImg]?.url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnail strip */}
                {images.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {images.map((img, i) => (
                      <button
                        key={img.id}
                        onClick={() => setActiveImg(i)}
                        className={`aspect-[3/4] overflow-hidden border-2 transition-all duration-150 relative
                          ${activeImg === i ? 'border-primary' : 'border-transparent opacity-50 hover:opacity-75'}`}
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                        {img.is_primary && (
                          <span className="absolute top-0.5 left-0.5 bg-primary p-0.5">
                            <Crown size={7} strokeWidth={2} className="text-text-dark" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Section>

          {/* Sizes */}
          <Section icon={Layers} title="Available Sizes">
            {product.sizes?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <span key={s} className="px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase border border-primary/20 text-muted">
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-muted/50 tracking-[0.1em]">No sizes specified</p>
            )}
          </Section>

        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col gap-5">

          {/* Core details */}
          <Section icon={Tag} title="Product Details">
            <div className="grid grid-cols-2 gap-5">

              <Field label="Price">
                <p className="text-[18px] font-bold tracking-[0.02em] text-primary">
                  ₦{Number(product.price).toLocaleString()}
                </p>
              </Field>

              <Field label="Category">
                <p className="text-[13px] tracking-[0.05em] uppercase font-bold text-primary">
                  {product.category || '—'}
                </p>
              </Field>

              <Field label="Tag">
                {product.tag
                  ? <span className={`inline-block text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-1 ${TAG_COLORS[product.tag] || 'bg-primary/8 text-muted'}`}>{product.tag}</span>
                  : <span className="text-muted/40 text-[12px]">— None —</span>
                }
              </Field>

              <Field label="Status">
                {product.is_active
                  ? <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.1em] uppercase text-green-400">
                      <CheckCircle2 size={12} strokeWidth={2} /> Active
                    </span>
                  : <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.1em] uppercase text-muted">
                      <XCircle size={12} strokeWidth={2} /> Inactive
                    </span>
                }
              </Field>

              <Field label="Product ID">
                <p className="text-[11px] font-mono text-muted">{product.id}</p>
              </Field>

              {product.created_at && (
                <Field label="Created">
                  <p className="text-[11px] text-muted">
                    {new Date(product.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </Field>
              )}
            </div>

            {/* Description */}
            <div className="mt-5 pt-5 border-t border-primary/8">
              <p className="text-[9px] font-bold tracking-[0.28em] uppercase text-muted/60 mb-2">Description</p>
              <p className="text-[13px] text-muted leading-relaxed tracking-[0.03em]">
                {product.description || '—'}
              </p>
            </div>
          </Section>

          {/* Bullet details */}
          <Section icon={Info} title="Product Bullet Points">
            {product.details?.length > 0 ? (
              <ul className="flex flex-col gap-2.5">
                {product.details.map((d, i) => (
                  <li key={i} className="flex items-start gap-3 text-[12px] text-muted tracking-[0.03em]">
                    <span className="text-primary/30 mt-[3px] text-[8px] shrink-0">◆</span>
                    {d}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[11px] text-muted/50 tracking-[0.1em]">No bullet points added</p>
            )}
          </Section>

        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center gap-4 mt-8 pt-6 border-t border-primary/10">
        <Link
          to={`/admin/products/${id}/edit`}
          className="inline-flex items-center gap-2 bg-primary text-text-dark px-6 py-3 text-[10px] font-bold tracking-[0.22em] uppercase hover:bg-primary/85 transition-colors duration-200"
        >
          <Pencil size={11} strokeWidth={2.2} /> Edit Product
        </Link>
        <button
          onClick={() => navigate('/admin/products')}
          className="px-6 py-3 border border-primary/20 text-[10px] font-bold tracking-[0.2em] uppercase text-muted hover:text-primary hover:border-primary/40 transition-colors duration-200"
        >
          ← Back to Products
        </button>
      </div>

    </div>
  )
}

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Crown, Tag as TagIcon, Layers, Info, Image as ImageIcon, Loader2 } from 'lucide-react'
import { api } from '../../lib/api'
import { Panel, ProductTag, StatusTag, PrimaryButton, GhostButton, IconButton } from '../../admin/ui'

// Read-only spec field (label over value). This is a *display* primitive — distinct
// from ui.jsx's form Field (label over an input), so it stays local by design.
function Spec({ label, value, children }) {
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
        <GhostButton onClick={() => navigate('/admin/products')}>← Back to Products</GhostButton>
      </div>
    )
  }

  const images = product.images?.length > 0 ? product.images : (product.image ? [{ id: 'main', url: product.image, is_primary: true }] : [])

  return (
    <div className="max-w-[960px]">

      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <IconButton icon={ArrowLeft} size={16} onClick={() => navigate('/admin/products')} title="Back to products" />
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-1">Product #{product.id}</p>
            <h1 className="font-display text-[32px] md:text-[40px] leading-none tracking-[0.03em]">
              {product.name.toUpperCase()}
            </h1>
          </div>
        </div>

        <PrimaryButton to={`/admin/products/${id}/edit`} icon={Pencil} className="py-2.5 px-4 shrink-0">Edit</PrimaryButton>
      </div>

      <div className="grid md:grid-cols-2 gap-5">

        {/* ── Left column ── */}
        <div className="flex flex-col gap-5">

          {/* Images */}
          <Panel icon={ImageIcon} title={`Images (${images.length})`}>
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
          </Panel>

          {/* Sizes */}
          <Panel icon={Layers} title="Available Sizes">
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
          </Panel>

        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col gap-5">

          {/* Core details */}
          <Panel icon={TagIcon} title="Product Details">
            <div className="grid grid-cols-2 gap-5">

              <Spec label="Price">
                <p className="text-[18px] font-bold tracking-[0.02em] text-primary">
                  ₦{Number(product.price).toLocaleString()}
                </p>
              </Spec>

              <Spec label="Category">
                <p className="text-[13px] tracking-[0.05em] uppercase font-bold text-primary">
                  {product.category || '—'}
                </p>
              </Spec>

              <Spec label="Tag">
                <ProductTag>{product.tag}</ProductTag>
              </Spec>

              <Spec label="Status">
                <StatusTag active={product.is_active} />
              </Spec>

              <Spec label="Product ID">
                <p className="text-[11px] font-mono text-muted">{product.id}</p>
              </Spec>

              {product.created_at && (
                <Spec label="Created">
                  <p className="text-[11px] text-muted">
                    {new Date(product.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </Spec>
              )}
            </div>

            {/* Description */}
            <div className="mt-5 pt-5 border-t border-primary/8">
              <p className="text-[9px] font-bold tracking-[0.28em] uppercase text-muted/60 mb-2">Description</p>
              <p className="text-[13px] text-muted leading-relaxed tracking-[0.03em]">
                {product.description || '—'}
              </p>
            </div>
          </Panel>

          {/* Bullet details */}
          <Panel icon={Info} title="Product Bullet Points">
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
          </Panel>

        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center gap-4 mt-8 pt-6 border-t border-primary/10">
        <PrimaryButton to={`/admin/products/${id}/edit`} icon={Pencil}>Edit Product</PrimaryButton>
        <GhostButton onClick={() => navigate('/admin/products')}>← Back to Products</GhostButton>
      </div>

    </div>
  )
}

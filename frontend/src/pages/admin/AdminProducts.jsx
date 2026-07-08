import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, AlertTriangle, Eye, X } from 'lucide-react'
import { api } from '../../lib/api'
import ProductImage from '../../components/ProductImage'
import { useAuth } from '../../context/AuthContext'

const TAG_COLORS = {
  New:     'bg-primary/15 text-primary',
  SS25:    'bg-primary/8 text-primary/70',
  Limited: 'bg-red-500/15 text-red-400',
}

export default function AdminProducts() {
  const { canManage } = useAuth()
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [confirm,  setConfirm]  = useState(null)

  const [viewProduct, setViewProduct] = useState(null)
  const [activeImg,   setActiveImg]   = useState(0)

  useEffect(() => { fetchProducts() }, [])

  useEffect(() => {
    if (!viewProduct) return
    function onKey(e) { if (e.key === 'Escape') closeView() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewProduct])

  async function fetchProducts() {
    setLoading(true)
    try {
      const res  = await api.getProducts()
      const data = await res.json()
      setProducts(data.products || [])
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    setDeleting(id)
    try {
      await api.deleteProduct(id)
      setProducts(ps => ps.filter(p => p.id !== id))
    } finally {
      setDeleting(null)
      setConfirm(null)
    }
  }

  function openView(p) { setViewProduct(p); setActiveImg(0) }
  function closeView()  { setViewProduct(null) }

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-2">Manage</p>
          <h1 className="font-display text-[44px] leading-none tracking-[0.03em]">PRODUCTS</h1>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 bg-primary text-text-dark px-5 py-2.5 text-[10px] font-bold tracking-[0.22em] uppercase hover:bg-primary/85 transition-colors duration-200"
        >
          <Plus size={13} strokeWidth={2.2} /> Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-[11px] font-bold tracking-[0.2em] text-muted uppercase">Loading...</p>
      ) : products.length === 0 ? (
        <div className="border border-primary/10 p-12 text-center">
          <p className="text-[11px] font-bold tracking-[0.2em] text-muted uppercase mb-3">No products yet</p>
          <Link to="/admin/products/new" className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary underline">
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="border border-primary/10 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[768px]">
              <div className="grid grid-cols-[60px_1fr_120px_80px_100px_100px_80px] gap-4 px-5 py-3 border-b border-primary/10 bg-surface">
                {['Image','Name','Category','Tag','Price','Status','Actions'].map(h => (
                  <p key={h} className="text-[9px] font-bold tracking-[0.22em] uppercase text-muted">{h}</p>
                ))}
              </div>

              {products.map(p => (
                <div
                  key={p.id}
                  className="grid grid-cols-[60px_1fr_120px_80px_100px_100px_80px] gap-4 items-center px-5 py-4 border-b border-primary/8 hover:bg-surface/50 transition-colors duration-150"
                >
                  <div className="w-[48px] h-[60px] overflow-hidden shrink-0">
                    {p.image
                      ? <ProductImage src={p.image} alt={p.name} wrapperClassName="w-full h-full" className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-primary/5" />
                    }
                  </div>

                  <div>
                    <p className="text-[12px] font-bold tracking-[0.06em] uppercase truncate">{p.name}</p>
                    <p className="text-[10px] text-muted tracking-[0.04em] mt-0.5">ID: {p.id}</p>
                  </div>

                  <p className="text-[11px] text-muted tracking-[0.04em]">{p.category}</p>

                  <div>
                    {p.tag
                      ? <span className={`text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-1 ${TAG_COLORS[p.tag] || 'bg-primary/8 text-muted'}`}>{p.tag}</span>
                      : <span className="text-muted/30 text-[10px]">—</span>
                    }
                  </div>

                  <p className="text-[12px] font-bold tracking-[0.04em]">₦{p.price?.toLocaleString()}</p>

                  <div>
                    <span className={`text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-1 ${p.is_active ? 'bg-green-500/15 text-green-400' : 'bg-primary/8 text-muted'}`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button onClick={() => openView(p)} title="View" className="text-muted hover:text-primary transition-colors duration-200">
                      <Eye size={13} strokeWidth={1.6} />
                    </button>
                    <Link to={`/admin/products/${p.id}/edit`} title="Edit" className="text-muted hover:text-primary transition-colors duration-200">
                      <Pencil size={13} strokeWidth={1.6} />
                    </Link>
                    {canManage && (
                      <button onClick={() => setConfirm(p.id)} title="Delete" className="text-muted hover:text-red-400 transition-colors duration-200">
                        <Trash2 size={13} strokeWidth={1.6} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirmation ── */}
      {confirm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-surface border border-primary/15 p-8 max-w-[360px] w-full mx-4">
            <div className="flex items-center gap-3 mb-5">
              <AlertTriangle size={16} className="text-red-400" strokeWidth={1.6} />
              <p className="text-[12px] font-bold tracking-[0.12em] uppercase">Delete Product?</p>
            </div>
            <p className="text-[13px] text-muted tracking-[0.03em] mb-8">
              This will permanently delete the product. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(confirm)}
                disabled={!!deleting}
                className="flex-1 py-3 bg-red-500/90 text-white text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-red-500 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 py-3 border border-primary/20 text-[10px] font-bold tracking-[0.2em] uppercase text-muted hover:text-primary hover:border-primary/40 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Product view modal ── */}
      {viewProduct && (
        <div
          className="fixed inset-0 bg-background/85 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeView}
        >
          <div
            className="bg-surface border border-primary/15 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-primary/10 shrink-0">
              <div>
                <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-muted mb-1">Product Preview</p>
                <h2 className="font-display text-[28px] md:text-[34px] leading-none tracking-[0.03em]">
                  {viewProduct.name.toUpperCase()}
                </h2>
              </div>
              <button onClick={closeView} className="text-muted hover:text-primary transition-colors mt-1 shrink-0">
                <X size={18} strokeWidth={1.6} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid md:grid-cols-2">

                {/* Left: gallery */}
                <div className="md:border-r border-primary/10 border-b md:border-b-0">
                  <div className="flex">
                    {/* Thumbnail strip */}
                    {viewProduct.images?.length > 1 && (
                      <div className="flex flex-col gap-2 p-3 w-[68px] shrink-0 border-r border-primary/10 overflow-y-auto">
                        {viewProduct.images.map((img, i) => (
                          <button
                            key={img.id}
                            onClick={() => setActiveImg(i)}
                            className={`w-full aspect-[3/4] overflow-hidden border-2 transition-all duration-150
                              ${activeImg === i ? 'border-primary' : 'border-transparent opacity-50 hover:opacity-80'}`}
                          >
                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                    {/* Main image */}
                    <div className="flex-1 aspect-[4/5]">
                      <ProductImage
                        src={viewProduct.images?.[activeImg]?.url || viewProduct.image}
                        alt={viewProduct.name}
                        wrapperClassName="w-full h-full"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: info */}
                <div className="p-6 flex flex-col gap-5 overflow-y-auto">

                  {/* Price */}
                  <div>
                    <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-muted mb-1">Price</p>
                    <p className="text-[22px] font-bold tracking-[0.04em]">₦{viewProduct.price?.toLocaleString()}</p>
                  </div>

                  {/* Category + Tag + Status */}
                  <div className="flex flex-wrap gap-5">
                    <div>
                      <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-muted mb-1.5">Category</p>
                      <p className="text-[12px] font-bold tracking-[0.06em] uppercase">{viewProduct.category}</p>
                    </div>
                    {viewProduct.tag && (
                      <div>
                        <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-muted mb-1.5">Tag</p>
                        <span className={`text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-1 ${TAG_COLORS[viewProduct.tag] || 'bg-primary/8 text-muted'}`}>
                          {viewProduct.tag}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-muted mb-1.5">Status</p>
                      <span className={`text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-1 ${viewProduct.is_active ? 'bg-green-500/15 text-green-400' : 'bg-primary/8 text-muted'}`}>
                        {viewProduct.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Sizes */}
                  {viewProduct.sizes?.length > 0 && (
                    <div>
                      <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-muted mb-2">Sizes</p>
                      <div className="flex flex-wrap gap-1.5">
                        {viewProduct.sizes.map(s => (
                          <span key={s} className="px-2.5 py-1 border border-primary/20 text-[10px] font-bold tracking-[0.1em] uppercase text-muted">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {viewProduct.description && (
                    <div>
                      <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-muted mb-2">Description</p>
                      <p className="text-[13px] text-muted leading-relaxed tracking-[0.03em]">{viewProduct.description}</p>
                    </div>
                  )}

                  {/* Details */}
                  {viewProduct.details?.length > 0 && (
                    <div>
                      <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-muted mb-2">Product Details</p>
                      <ul className="flex flex-col gap-1.5">
                        {viewProduct.details.map((d, i) => (
                          <li key={i} className="flex items-start gap-2 text-[12px] text-muted tracking-[0.03em]">
                            <span className="text-primary/30 text-[8px] mt-[3px]">◆</span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-primary/10 shrink-0">
              <p className="text-[9px] text-muted/50 tracking-[0.1em] uppercase">ID: {viewProduct.id}</p>
              <div className="flex gap-3">
                <button
                  onClick={closeView}
                  className="px-5 py-2.5 border border-primary/20 text-[10px] font-bold tracking-[0.2em] uppercase text-muted hover:text-primary hover:border-primary/40 transition-colors"
                >
                  Close
                </button>
                <Link
                  to={`/admin/products/${viewProduct.id}/edit`}
                  className="px-5 py-2.5 bg-primary text-text-dark text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-primary/85 transition-colors"
                >
                  Edit Product
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

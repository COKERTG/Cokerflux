import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import { api } from '../../lib/api'
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

  useEffect(() => { fetchProducts() }, [])

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
          {/* Table header */}
          <div className="grid grid-cols-[60px_1fr_120px_80px_100px_100px_80px] gap-4 px-5 py-3 border-b border-primary/10 bg-surface">
            {['Image','Name','Category','Tag','Price','Status','Actions'].map(h => (
              <p key={h} className="text-[9px] font-bold tracking-[0.22em] uppercase text-muted">{h}</p>
            ))}
          </div>

          {/* Rows */}
          {products.map(p => (
            <div
              key={p.id}
              className="grid grid-cols-[60px_1fr_120px_80px_100px_100px_80px] gap-4 items-center px-5 py-4 border-b border-primary/8 hover:bg-surface/50 transition-colors duration-150"
            >
              <div className="w-[48px] h-[60px] bg-surface overflow-hidden shrink-0">
                {p.image
                  ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
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
                <Link to={`/admin/products/${p.id}/edit`} className="text-muted hover:text-primary transition-colors duration-200">
                  <Pencil size={13} strokeWidth={1.6} />
                </Link>
                {canManage && (
                  <button
                    onClick={() => setConfirm(p.id)}
                    className="text-muted hover:text-red-400 transition-colors duration-200"
                  >
                    <Trash2 size={13} strokeWidth={1.6} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
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
    </div>
  )
}

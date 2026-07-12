import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import { api } from '../../lib/api'
import ProductImage from '../../components/ProductImage'
import { useAuth } from '../../context/AuthContext'
import {
  PageHeader, PrimaryButton, GhostButton, Table, THead, Th, Tbody, Tr, Td,
  ProductTag, StatusTag, IconButton, Modal, ConfirmDialog,
} from '../../admin/ui'

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
      <PageHeader
        kicker="Manage"
        title="PRODUCTS"
        actions={<PrimaryButton to="/admin/products/new" icon={Plus} className="py-2.5 px-5">Add Product</PrimaryButton>}
      />

      {loading ? (
        <p className="text-[11px] font-bold tracking-[0.2em] text-muted uppercase">Loading…</p>
      ) : products.length === 0 ? (
        <div className="border border-primary/10 p-12 text-center">
          <p className="text-[11px] font-bold tracking-[0.2em] text-muted uppercase mb-3">No products yet</p>
          <Link to="/admin/products/new" className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary underline underline-offset-2">
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="border border-primary/10">
          <Table className="min-w-[768px]">
            <THead>
              <Th className="w-[72px]">Image</Th>
              <Th>Name</Th>
              <Th>Category</Th>
              <Th>Tag</Th>
              <Th>Price</Th>
              <Th>Status</Th>
              <Th className="text-right w-[110px]">Actions</Th>
            </THead>
            <Tbody>
              {products.map(p => (
                <Tr key={p.id}>
                  <Td>
                    <div className="w-[44px] h-[56px] overflow-hidden shrink-0 border border-primary/10">
                      {p.image
                        ? <ProductImage src={p.image} alt={p.name} wrapperClassName="w-full h-full" className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-primary/5" />
                      }
                    </div>
                  </Td>
                  <Td>
                    <p className="text-[12px] font-bold tracking-[0.06em] uppercase truncate max-w-[220px]">{p.name}</p>
                    <p className="text-[10px] text-muted tracking-[0.04em] mt-0.5">ID: {p.id}</p>
                  </Td>
                  <Td className="text-muted">{p.category}</Td>
                  <Td><ProductTag>{p.tag}</ProductTag></Td>
                  <Td className="font-bold">₦{p.price?.toLocaleString()}</Td>
                  <Td><StatusTag active={p.is_active} /></Td>
                  <Td>
                    <div className="flex items-center justify-end gap-1">
                      <IconButton icon={Eye} onClick={() => openView(p)} title="View" />
                      <Link to={`/admin/products/${p.id}/edit`} title="Edit" className="p-1.5 text-muted hover:text-primary transition-colors">
                        <Pencil size={13} strokeWidth={1.8} />
                      </Link>
                      {canManage && (
                        <IconButton icon={Trash2} tone="danger" onClick={() => setConfirm(p.id)} title="Delete" />
                      )}
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      )}

      {/* ── Delete confirmation ── */}
      {confirm && (
        <ConfirmDialog
          title="Delete Product?"
          message="This will permanently delete the product. This action cannot be undone."
          confirmLabel="Delete"
          loading={!!deleting}
          onConfirm={() => handleDelete(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* ── Product view modal ── */}
      {viewProduct && (
        <Modal onClose={closeView} maxWidth="max-w-3xl">
          {/* Header */}
          <div className="px-6 py-5 border-b border-primary/10 shrink-0 pr-14">
            <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-muted mb-1">Product Preview</p>
            <h2 className="font-display text-[28px] md:text-[34px] leading-none tracking-[0.03em]">
              {viewProduct.name.toUpperCase()}
            </h2>
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
                      <ProductTag>{viewProduct.tag}</ProductTag>
                    </div>
                  )}
                  <div>
                    <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-muted mb-1.5">Status</p>
                    <StatusTag active={viewProduct.is_active} />
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
              <GhostButton onClick={closeView} className="py-2.5 px-5">Close</GhostButton>
              <PrimaryButton to={`/admin/products/${viewProduct.id}/edit`} className="py-2.5 px-5">Edit Product</PrimaryButton>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

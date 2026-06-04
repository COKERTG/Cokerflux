import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, X, Upload } from 'lucide-react'
import { api } from '../../lib/api'

const SIZES_ALL  = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']
const CATEGORIES = ['Hoodies', 'Tees', 'Accessories']
const TAGS       = ['', 'New', 'SS25', 'Limited']

const empty = { name: '', price: '', category: 'Hoodies', tag: '', description: '', sizes: [], details: [], is_active: true }

export default function AdminProductForm() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const isEdit     = !!id

  const [form,      setForm]      = useState(empty)
  const [image,     setImage]     = useState(null)   // File
  const [preview,   setPreview]   = useState(null)   // URL string
  const [detail,    setDetail]    = useState('')
  const [loading,   setLoading]   = useState(false)
  const [fetching,  setFetching]  = useState(isEdit)
  const [errors,    setErrors]    = useState({})

  useEffect(() => {
    if (!isEdit) return
    api.getProduct(id)
      .then(r => r.json())
      .then(d => {
        const p = d.product
        if (p) {
          setForm({ name: p.name, price: p.price, category: p.category, tag: p.tag || '', description: p.description, sizes: p.sizes || [], details: p.details || [], is_active: p.is_active })
          if (p.image) setPreview(p.image)
        }
      })
      .finally(() => setFetching(false))
  }, [id, isEdit])

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  function toggleSize(s) {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s],
    }))
  }

  function addDetail() {
    if (!detail.trim()) return
    setForm(f => ({ ...f, details: [...f.details, detail.trim()] }))
    setDetail('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    const fd = new FormData()
    fd.append('name',        form.name)
    fd.append('price',       form.price)
    fd.append('category',    form.category)
    fd.append('tag',         form.tag)
    fd.append('description', form.description)
    fd.append('is_active',   form.is_active)
    fd.append('sizes',       JSON.stringify(form.sizes))
    fd.append('details',     JSON.stringify(form.details))
    if (image) fd.append('image', image)

    try {
      const res  = isEdit ? await api.updateProduct(id, fd) : await api.createProduct(fd)
      const data = await res.json()
      if (!res.ok) { setErrors(data.errors || {}); return }
      navigate('/admin/products')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <p className="text-[11px] font-bold tracking-[0.2em] text-muted uppercase">Loading...</p>

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin/products')} className="text-muted hover:text-primary transition-colors">
          <ArrowLeft size={16} strokeWidth={1.6} />
        </button>
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-1">{isEdit ? 'Edit' : 'New'}</p>
          <h1 className="font-display text-[36px] leading-none tracking-[0.03em]">{isEdit ? 'EDIT PRODUCT' : 'ADD PRODUCT'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">

        {/* Left column */}
        <div className="flex flex-col gap-6">

          {/* Image upload */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted mb-3">Product Image</p>
            <label className="block cursor-pointer group">
              <div className={`aspect-[3/4] border border-dashed border-primary/20 group-hover:border-primary/40 transition-colors flex items-center justify-center overflow-hidden relative ${preview ? '' : 'bg-surface'}`}>
                {preview
                  ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  : <div className="flex flex-col items-center gap-2 text-muted">
                      <Upload size={20} strokeWidth={1.4} />
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase">Upload Image</p>
                    </div>
                }
                {preview && (
                  <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase">Change Image</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          {/* Sizes */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted mb-3">Sizes</p>
            <div className="flex flex-wrap gap-2">
              {SIZES_ALL.map(s => (
                <button
                  key={s} type="button" onClick={() => toggleSize(s)}
                  className={`px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase border transition-all duration-200
                    ${form.sizes.includes(s) ? 'bg-primary text-text-dark border-primary' : 'border-primary/20 text-muted hover:border-primary/40 hover:text-primary'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted mb-3">Product Details</p>
            <div className="flex gap-2 mb-3">
              <input
                value={detail}
                onChange={e => setDetail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addDetail())}
                placeholder="Add a detail and press Enter"
                className="flex-1 bg-transparent border-b border-primary/20 pb-2 text-[13px] tracking-[0.03em] text-primary placeholder-muted/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button type="button" onClick={addDetail} className="text-muted hover:text-primary transition-colors">
                <Plus size={16} strokeWidth={1.6} />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {form.details.map((d, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-primary/8">
                  <p className="text-[12px] text-muted tracking-[0.03em]">{d}</p>
                  <button type="button" onClick={() => setForm(f => ({ ...f, details: f.details.filter((_, j) => j !== i) }))} className="text-muted/40 hover:text-red-400 transition-colors">
                    <X size={12} strokeWidth={1.6} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">

          {[
            { name: 'name',        label: 'Product Name',  type: 'text'   },
            { name: 'price',       label: 'Price (NGN)',   type: 'number' },
            { name: 'description', label: 'Description',   type: 'textarea' },
          ].map(f => (
            <div key={f.name} className="flex flex-col gap-2">
              <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted">{f.label}</label>
              {f.type === 'textarea'
                ? <textarea rows={4} value={form[f.name]} required
                    onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                    className="bg-transparent border-b border-primary/20 pb-2 text-[14px] tracking-[0.03em] text-primary placeholder-muted/30 focus:outline-none focus:border-primary/50 transition-colors resize-none" />
                : <input type={f.type} value={form[f.name]} required
                    onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                    className="bg-transparent border-b border-primary/20 pb-2 text-[14px] tracking-[0.03em] text-primary placeholder-muted/30 focus:outline-none focus:border-primary/50 transition-colors" />
              }
              {errors[f.name] && <p className="text-[10px] text-red-400">{errors[f.name]}</p>}
            </div>
          ))}

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="bg-surface border border-primary/20 px-3 py-2 text-[12px] tracking-[0.04em] text-primary focus:outline-none focus:border-primary/50 transition-colors">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted">Tag</label>
              <select value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
                className="bg-surface border border-primary/20 px-3 py-2 text-[12px] tracking-[0.04em] text-primary focus:outline-none focus:border-primary/50 transition-colors">
                {TAGS.map(t => <option key={t} value={t}>{t || '— None —'}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
              className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${form.is_active ? 'bg-primary' : 'bg-surface border border-primary/20'}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-background transition-transform duration-200 ${form.is_active ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <label className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted">
              {form.is_active ? 'Active — visible in shop' : 'Inactive — hidden from shop'}
            </label>
          </div>

          {errors.non_field_errors && (
            <p className="text-[11px] text-red-400">{errors.non_field_errors}</p>
          )}

          <div className="flex gap-3 pt-4 border-t border-primary/8">
            <button type="submit" disabled={loading}
              className="flex-1 py-3.5 bg-primary text-text-dark text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-primary/85 transition-colors disabled:opacity-50">
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
            </button>
            <button type="button" onClick={() => navigate('/admin/products')}
              className="px-6 border border-primary/20 text-[11px] font-bold tracking-[0.2em] uppercase text-muted hover:text-primary hover:border-primary/40 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

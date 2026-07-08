import { useEffect, useState } from 'react'
import { Check, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react'
import { api } from '../../lib/api'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [adding, setAdding]         = useState(false)
  const [newName, setNewName]       = useState('')
  const [editingId, setEditingId]   = useState(null)
  const [editName, setEditName]     = useState('')
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState(null)

  useEffect(() => { fetchCategories() }, [])

  async function fetchCategories() {
    setLoading(true)
    try {
      const res  = await api.getCategories()
      const data = await res.json()
      setCategories(data.categories || [])
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate() {
    if (!newName.trim()) return
    setSaving(true)
    setError(null)
    try {
      const res  = await api.createCategory({ name: newName.trim() })
      const data = await res.json()
      if (!res.ok) { setError(data.errors?.name?.[0] || 'Failed to create category'); return }
      setCategories(prev => [...prev, data.category].sort((a, b) => a.name.localeCompare(b.name)))
      setNewName('')
      setAdding(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdate(id) {
    if (!editName.trim()) return
    setSaving(true)
    try {
      const res  = await api.updateCategory(id, { name: editName.trim() })
      const data = await res.json()
      if (!res.ok) return
      setCategories(prev => prev.map(c => c.id === id ? data.category : c).sort((a, b) => a.name.localeCompare(b.name)))
      setEditingId(null)
    } finally {
      setSaving(false)
    }
  }

  async function handleToggle(cat) {
    const res  = await api.updateCategory(cat.id, { is_active: !cat.is_active })
    const data = await res.json()
    if (res.ok) setCategories(prev => prev.map(c => c.id === cat.id ? data.category : c))
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this category? Products using it will keep their current category name.')) return
    const res = await api.deleteCategory(id)
    if (res.ok) setCategories(prev => prev.filter(c => c.id !== id))
  }

  function startEdit(cat) {
    setEditingId(cat.id)
    setEditName(cat.name)
  }

  function cancelEdit() { setEditingId(null) }
  function cancelAdd()  { setAdding(false); setNewName(''); setError(null) }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-1">Admin</p>
          <h1 className="font-display text-[36px] leading-none tracking-[0.03em]">CATEGORIES</h1>
        </div>
        <button
          onClick={() => { setAdding(true); setError(null) }}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-text-dark text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-primary/85 transition-colors"
        >
          <Plus size={13} strokeWidth={2} /> Add Category
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="flex items-center gap-3 mb-6 p-4 border border-primary/15 bg-surface">
          <input
            autoFocus
            value={newName}
            onChange={e => { setNewName(e.target.value); setError(null) }}
            onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') cancelAdd() }}
            placeholder="Category name (e.g. Jackets)"
            className="flex-1 bg-transparent border-b border-primary/20 pb-1.5 text-[13px] tracking-[0.03em] text-primary placeholder-muted/40 focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button
            onClick={handleCreate}
            disabled={saving || !newName.trim()}
            className="text-primary hover:text-primary/70 transition-colors disabled:opacity-40"
          >
            <Check size={16} strokeWidth={2} />
          </button>
          <button onClick={cancelAdd} className="text-muted hover:text-primary transition-colors">
            <X size={16} strokeWidth={2} />
          </button>
          {error && <p className="text-[10px] text-red-400 shrink-0">{error}</p>}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={20} className="animate-spin text-muted" />
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 border border-primary/8">
          <p className="text-[12px] font-bold tracking-[0.15em] uppercase text-muted">No categories yet</p>
          <p className="text-[11px] text-muted/60">Click "Add Category" to create your first one.</p>
        </div>
      ) : (
        <div className="border border-primary/10">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_80px_110px_72px] px-5 py-3 border-b border-primary/10 bg-surface">
            {['Name', 'Products', 'Status', ''].map(h => (
              <p key={h} className="text-[9px] font-bold tracking-[0.3em] uppercase text-muted">{h}</p>
            ))}
          </div>

          {categories.map(cat => (
            <div
              key={cat.id}
              className="grid grid-cols-[1fr_80px_110px_72px] px-5 py-4 border-b border-primary/8 last:border-0 items-center hover:bg-surface/50 transition-colors"
            >
              {/* Name / edit inline */}
              <div>
                {editingId === cat.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleUpdate(cat.id); if (e.key === 'Escape') cancelEdit() }}
                      className="bg-transparent border-b border-primary/40 pb-1 text-[13px] tracking-[0.03em] text-primary focus:outline-none focus:border-primary/70 w-40 transition-colors"
                    />
                    <button
                      onClick={() => handleUpdate(cat.id)}
                      disabled={saving}
                      className="text-primary hover:text-primary/70 transition-colors disabled:opacity-40"
                    >
                      <Check size={13} strokeWidth={2} />
                    </button>
                    <button onClick={cancelEdit} className="text-muted hover:text-primary transition-colors">
                      <X size={13} strokeWidth={2} />
                    </button>
                  </div>
                ) : (
                  <p className="text-[13px] font-bold tracking-[0.04em]">{cat.name}</p>
                )}
              </div>

              {/* Product count */}
              <p className="text-[12px] text-muted">{cat.product_count ?? 0}</p>

              {/* Status toggle */}
              <div>
                <button
                  onClick={() => handleToggle(cat)}
                  className={`text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 border transition-colors duration-150
                    ${cat.is_active
                      ? 'border-primary/20 text-primary hover:bg-primary/5'
                      : 'border-muted/20 text-muted hover:border-primary/20 hover:text-primary'}`}
                >
                  {cat.is_active ? 'Active' : 'Inactive'}
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => startEdit(cat)}
                  className="text-muted hover:text-primary transition-colors"
                  title="Rename"
                >
                  <Pencil size={13} strokeWidth={1.6} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-muted hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={13} strokeWidth={1.6} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

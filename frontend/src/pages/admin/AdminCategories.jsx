import { useEffect, useState } from 'react'
import { Check, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react'
import { api } from '../../lib/api'
import {
  PageHeader, PrimaryButton, Table, THead, Th, Tbody, Tr, Td,
  Tag, TextInput, IconButton,
} from '../../admin/ui'

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
      <PageHeader
        kicker="Admin"
        title="CATEGORIES"
        actions={
          <PrimaryButton onClick={() => { setAdding(true); setError(null) }} icon={Plus} className="py-2.5 px-5">
            Add Category
          </PrimaryButton>
        }
      />

      {/* Add form */}
      {adding && (
        <div className="flex items-center gap-3 mb-6 p-4 border border-primary/15 bg-surface">
          <TextInput
            autoFocus
            value={newName}
            onChange={e => { setNewName(e.target.value); setError(null) }}
            onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') cancelAdd() }}
            placeholder="Category name (e.g. Jackets)"
          />
          <IconButton icon={Check} size={16} onClick={handleCreate} disabled={saving || !newName.trim()} title="Save" />
          <IconButton icon={X} size={16} onClick={cancelAdd} title="Cancel" />
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
          <Table>
            <THead>
              <Th>Name</Th>
              <Th className="w-[90px]">Products</Th>
              <Th className="w-[120px]">Status</Th>
              <Th className="text-right w-[80px]">Actions</Th>
            </THead>
            <Tbody>
              {categories.map(cat => (
                <Tr key={cat.id}>
                  {/* Name / edit inline */}
                  <Td>
                    {editingId === cat.id ? (
                      <div className="flex items-center gap-2">
                        <TextInput
                          autoFocus
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') handleUpdate(cat.id); if (e.key === 'Escape') cancelEdit() }}
                          className="w-40"
                        />
                        <IconButton icon={Check} onClick={() => handleUpdate(cat.id)} disabled={saving} title="Save" />
                        <IconButton icon={X} onClick={cancelEdit} title="Cancel" />
                      </div>
                    ) : (
                      <p className="text-[13px] font-bold tracking-[0.04em]">{cat.name}</p>
                    )}
                  </Td>

                  {/* Product count */}
                  <Td className="text-muted">{cat.product_count ?? 0}</Td>

                  {/* Status toggle — interactive: click flips is_active */}
                  <Td>
                    <button onClick={() => handleToggle(cat)} title={cat.is_active ? 'Deactivate' : 'Activate'} className="group/tag">
                      <Tag tone={cat.is_active ? 'solid' : 'outline'} className="group-hover/tag:opacity-80 transition-opacity">
                        {cat.is_active ? 'Active' : 'Inactive'}
                      </Tag>
                    </button>
                  </Td>

                  {/* Actions */}
                  <Td>
                    <div className="flex items-center justify-end gap-1">
                      <IconButton icon={Pencil} onClick={() => startEdit(cat)} title="Rename" />
                      <IconButton icon={Trash2} tone="danger" onClick={() => handleDelete(cat.id)} title="Delete" />
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      )}
    </div>
  )
}

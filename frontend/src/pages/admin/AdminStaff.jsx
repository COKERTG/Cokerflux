import { useEffect, useState } from 'react'
import { Send, Clock, CheckCircle, XCircle, Trash2, PowerOff, Power, ShieldCheck, ShieldMinus } from 'lucide-react'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import {
  PageHeader, Tag, Banner, Field, TextInput, SelectField, PrimaryButton, IconButton,
} from '../../admin/ui'

// Owner reads as the strongest chip, admin a step down, staff a quiet outline —
// mapped onto the shared Tag tones instead of a bespoke colour table.
const ROLE_TONE = {
  owner: 'solid',
  admin: 'subtle',
  staff: 'outline',
}

function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })
}

function fmtLastLogin(iso) {
  if (!iso) return 'Never'
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now - d
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1)  return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHrs = Math.floor(diffMins / 60)
  if (diffHrs < 24)  return `${diffHrs}h ago`
  const diffDays = Math.floor(diffHrs / 24)
  if (diffDays < 7)  return `${diffDays}d ago`
  return fmtDate(iso)
}

export default function AdminStaff() {
  const { user: me } = useAuth()
  const [staff,        setStaff]        = useState([])
  const [invites,      setInvites]      = useState([])
  const [form,         setForm]         = useState({ email: '', role: 'staff' })
  const [sending,      setSending]      = useState(false)
  const [success,      setSuccess]      = useState('')
  const [error,        setError]        = useState('')
  const [loading,      setLoading]      = useState(true)
  const [actionLoad,     setActionLoad]     = useState({})   // { [id]: true }
  const [confirmId,      setConfirmId]      = useState(null) // staff id pending delete confirm
  const [confirmPromote, setConfirmPromote] = useState(null) // staff id pending promote confirm

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    try {
      const [sr, ir] = await Promise.all([api.getStaff(), api.getInvites()])
      const [sd, id] = await Promise.all([sr.json(), ir.json()])
      setStaff(sd.staff    || [])
      setInvites(id.invites || [])
    } finally {
      setLoading(false)
    }
  }

  async function handleInvite(e) {
    e.preventDefault()
    setError(''); setSuccess('')
    setSending(true)
    try {
      const res  = await api.sendInvite(form.email, form.role)
      const data = await res.json()
      if (!res.ok) {
        setError(data.errors?.email?.[0] || data.errors?.role?.[0] || data.errors?.non_field_errors?.[0] || 'Failed to send invite')
        return
      }
      setSuccess(`Invite sent to ${form.email}`)
      setForm({ email: '', role: 'staff' })
      fetchAll()
    } finally {
      setSending(false)
    }
  }

  async function handleToggleActive(s) {
    setActionLoad(l => ({ ...l, [`active_${s.id}`]: true }))
    try {
      const res = await api.updateStaff(s.id, { is_active: !s.is_active })
      if (res.ok) {
        const data = await res.json()
        setStaff(prev => prev.map(u => u.id === s.id ? data.user : u))
      }
    } finally {
      setActionLoad(l => ({ ...l, [`active_${s.id}`]: false }))
    }
  }

  async function handleChangeRole(s, newRole) {
    setActionLoad(l => ({ ...l, [`role_${s.id}`]: true }))
    try {
      const res = await api.updateStaff(s.id, { role: newRole })
      if (res.ok) {
        const data = await res.json()
        setStaff(prev => prev.map(u => u.id === s.id ? data.user : u))
      }
    } finally {
      setActionLoad(l => ({ ...l, [`role_${s.id}`]: false }))
    }
  }

  async function handleDelete(id) {
    setActionLoad(l => ({ ...l, [`del_${id}`]: true }))
    try {
      const res = await api.deleteStaff(id)
      if (res.ok) {
        setStaff(prev => prev.filter(u => u.id !== id))
        setConfirmId(null)
      }
    } finally {
      setActionLoad(l => ({ ...l, [`del_${id}`]: false }))
    }
  }

  async function handleRevokeInvite(id) {
    setActionLoad(l => ({ ...l, [`inv_${id}`]: true }))
    try {
      const res = await api.revokeInvite(id)
      if (res.ok) setInvites(prev => prev.filter(i => i.id !== id))
    } finally {
      setActionLoad(l => ({ ...l, [`inv_${id}`]: false }))
    }
  }

  // What actions can me take on target?
  function canManage(target) {
    if (target.id === me?.id)    return false
    if (target.role === 'owner') return false
    if (me?.role === 'admin' && target.role !== 'staff') return false
    return true
  }

  const canInviteAdmin = me?.role === 'owner'

  return (
    <div>
      <PageHeader kicker="Manage" title="STAFF" />

      <div className="grid md:grid-cols-3 gap-8">

        {/* ── Left: staff list + invites ── */}
        <div className="md:col-span-2 flex flex-col gap-8">

          {/* Team members */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted mb-4">
              Team Members ({staff.length})
            </p>

            {loading ? (
              <p className="text-[11px] text-muted tracking-[0.2em] uppercase">Loading...</p>
            ) : staff.length === 0 ? (
              <p className="text-[11px] text-muted">No team members yet.</p>
            ) : (
              <div className="border border-primary/10 overflow-hidden">
                {staff.map((s, i) => (
                  <div key={s.id}
                    className={`flex items-center gap-4 px-5 py-4 ${i < staff.length - 1 ? 'border-b border-primary/8' : ''} ${!s.is_active ? 'opacity-50' : ''} hover:bg-surface/50 transition-colors`}>

                    {/* Avatar */}
                    <div className="w-9 h-9 bg-surface border border-primary/15 flex items-center justify-center shrink-0">
                      <span className="font-display text-[14px] tracking-[0.05em]">
                        {s.username?.[0]?.toUpperCase()}
                      </span>
                    </div>

                    {/* Name / email */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold tracking-[0.06em] uppercase truncate">
                        {s.username}
                        {s.id === me?.id && <span className="ml-2 text-[9px] text-muted normal-case tracking-normal">(you)</span>}
                        {!s.is_active && <span className="ml-2 text-[9px] text-red-400/70 normal-case tracking-normal">disabled</span>}
                      </p>
                      <p className="text-[11px] text-muted tracking-[0.03em] truncate">{s.email}</p>
                    </div>

                    {/* Role */}
                    <div className="shrink-0">
                      <Tag tone={ROLE_TONE[s.role] || 'outline'}>{s.role}</Tag>
                    </div>

                    {/* Last login */}
                    <div className="hidden lg:block shrink-0 text-right">
                      <p className="text-[9px] text-muted/40 uppercase tracking-[0.12em]">Last login</p>
                      <p className="text-[10px] text-muted/70">{fmtLastLogin(s.last_login)}</p>
                    </div>

                    {/* Joined */}
                    <p className="text-[10px] text-muted/50 shrink-0 hidden md:block">{fmtDate(s.date_joined)}</p>

                    {/* Actions */}
                    {canManage(s) && (
                      <div className="flex items-center gap-1 shrink-0">

                        {/* Toggle active */}
                        <button
                          onClick={() => handleToggleActive(s)}
                          disabled={actionLoad[`active_${s.id}`]}
                          title={s.is_active ? 'Disable account' : 'Enable account'}
                          className={`p-1.5 transition-colors disabled:opacity-40 ${s.is_active ? 'text-muted hover:text-red-400' : 'text-muted hover:text-green-400'}`}
                        >
                          {s.is_active
                            ? <PowerOff size={13} strokeWidth={1.8} />
                            : <Power    size={13} strokeWidth={1.8} />
                          }
                        </button>

                        {/* Change role (owner only) */}
                        {me?.role === 'owner' && (
                          s.role === 'staff' ? (
                            confirmPromote === s.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => { handleChangeRole(s, 'admin'); setConfirmPromote(null) }}
                                  disabled={actionLoad[`role_${s.id}`]}
                                  className="text-[9px] font-bold tracking-[0.15em] uppercase text-primary hover:text-primary/70 transition-colors disabled:opacity-40"
                                >
                                  {actionLoad[`role_${s.id}`] ? '...' : 'Confirm'}
                                </button>
                                <button
                                  onClick={() => setConfirmPromote(null)}
                                  className="text-[9px] font-bold tracking-[0.15em] uppercase text-muted hover:text-primary transition-colors ml-1"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmPromote(s.id)}
                                title="Promote to admin"
                                className="p-1.5 text-muted hover:text-primary transition-colors disabled:opacity-40"
                              >
                                <ShieldCheck size={13} strokeWidth={1.8} />
                              </button>
                            )
                          ) : (
                            <button
                              onClick={() => handleChangeRole(s, 'staff')}
                              disabled={actionLoad[`role_${s.id}`]}
                              title="Demote to staff"
                              className="p-1.5 text-muted hover:text-primary transition-colors disabled:opacity-40"
                            >
                              <ShieldMinus size={13} strokeWidth={1.8} />
                            </button>
                          )
                        )}

                        {/* Delete */}
                        {confirmId === s.id ? (
                          <div className="flex items-center gap-1 ml-1">
                            <button
                              onClick={() => handleDelete(s.id)}
                              disabled={actionLoad[`del_${s.id}`]}
                              className="text-[9px] font-bold tracking-[0.15em] uppercase text-red-400 hover:text-red-300 transition-colors disabled:opacity-40"
                            >
                              {actionLoad[`del_${s.id}`] ? '...' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="text-[9px] font-bold tracking-[0.15em] uppercase text-muted hover:text-primary transition-colors ml-1"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <IconButton icon={Trash2} tone="danger" onClick={() => setConfirmId(s.id)} title="Remove staff member" />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sent invites */}
          {invites.length > 0 && (
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted mb-4">
                Sent Invites ({invites.length})
              </p>
              <div className="border border-primary/10 overflow-hidden">
                {invites.map((inv, i) => (
                  <div key={inv.id}
                    className={`flex items-center gap-4 px-5 py-3.5 ${i < invites.length - 1 ? 'border-b border-primary/8' : ''}`}>

                    <div className="shrink-0">
                      {inv.is_used
                        ? <CheckCircle size={13} strokeWidth={1.6} className="text-green-400" />
                        : inv.is_expired
                          ? <XCircle size={13} strokeWidth={1.6} className="text-red-400/60" />
                          : <Clock size={13} strokeWidth={1.6} className="text-muted" />
                      }
                    </div>

                    <p className="flex-1 text-[12px] text-muted tracking-[0.03em] truncate">{inv.email}</p>
                    <Tag tone="outline">{inv.role}</Tag>

                    <span className={`text-[9px] font-bold tracking-[0.15em] uppercase shrink-0 ${inv.is_used ? 'text-green-400' : inv.is_expired ? 'text-red-400/60' : 'text-muted'}`}>
                      {inv.is_used ? 'Accepted' : inv.is_expired ? 'Expired' : 'Pending'}
                    </span>

                    {/* Revoke — only for pending */}
                    {!inv.is_used && !inv.is_expired && (
                      <IconButton
                        icon={XCircle}
                        tone="danger"
                        onClick={() => handleRevokeInvite(inv.id)}
                        disabled={actionLoad[`inv_${inv.id}`]}
                        title="Revoke invite"
                        className="shrink-0"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: invite form ── */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted mb-4">Send Invite</p>
          <div className="border border-primary/10 p-6">
            {success && <div className="mb-5"><Banner tone="success">{success}</Banner></div>}
            {error   && <div className="mb-5"><Banner tone="error">{error}</Banner></div>}

            <form onSubmit={handleInvite} className="flex flex-col gap-6">
              <Field label="Email">
                <TextInput
                  required type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="staff@example.com"
                />
              </Field>

              <Field label="Role">
                <SelectField value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  {canInviteAdmin && <option value="admin">Admin</option>}
                  <option value="staff">Staff</option>
                </SelectField>
              </Field>

              <PrimaryButton type="submit" disabled={sending} icon={Send} className="w-full py-3">
                {sending ? 'Sending…' : 'Send Invite'}
              </PrimaryButton>
            </form>

            <div className="mt-6 pt-5 border-t border-primary/8">
              <p className="text-[10px] text-muted/60 leading-relaxed tracking-[0.03em]">
                Invitees receive an email with a link to set up their account. Links expire after 7 days.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

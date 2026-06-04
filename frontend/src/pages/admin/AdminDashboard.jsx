import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Users, TrendingUp, ArrowRight, EyeOff } from 'lucide-react'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'

function StatCard({ icon: Icon, label, value, sub, to }) {
  const inner = (
    <div className="bg-surface border border-primary/10 p-6 hover:border-primary/25 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-6">
        <Icon size={16} strokeWidth={1.6} className="text-muted group-hover:text-primary transition-colors" />
        {to && <ArrowRight size={12} strokeWidth={1.6} className="text-primary/20 group-hover:text-primary transition-colors" />}
      </div>
      <p className="font-display text-[42px] leading-none tracking-[0.02em] mb-1">{value ?? '—'}</p>
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted">{label}</p>
      {sub && <p className="text-[11px] text-muted/60 mt-1 tracking-[0.03em]">{sub}</p>}
    </div>
  )
  return to ? <Link to={to}>{inner}</Link> : inner
}

export default function AdminDashboard() {
  const { canManage } = useAuth()
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getDashboard()
      .then(r => r.json())
      .then(d => setData(d))
      .finally(() => setLoading(false))
  }, [])

  const p = data?.products
  const s = data?.staff

  const quickActions = [
    { label: 'Add New Product',   to: '/admin/products/new' },
    { label: 'View All Products', to: '/admin/products'     },
    ...(canManage ? [
      { label: 'Invite Staff', to: '/admin/staff' },
      { label: 'View Staff',   to: '/admin/staff' },
    ] : []),
  ]

  return (
    <div>
      <div className="mb-10">
        <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-2">Overview</p>
        <h1 className="font-display text-[44px] leading-none tracking-[0.03em]">DASHBOARD</h1>
      </div>

      {/* ── Stat cards ── */}
      <div className={`grid grid-cols-2 ${canManage ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-px bg-primary/8 mb-10`}>
        <StatCard icon={Package}    label="Total Products"    value={p?.total}    to="/admin/products" />
        <StatCard icon={TrendingUp} label="Active Products"   value={p?.active}   sub={p ? `${p.inactive} inactive` : undefined} />
        <StatCard icon={EyeOff}     label="Inactive Products" value={p?.inactive} />
        {canManage && (
          <StatCard icon={Users} label="Staff Members" value={s?.total}
            sub={s?.pending_invites ? `${s.pending_invites} invite${s.pending_invites !== 1 ? 's' : ''} pending` : undefined}
            to="/admin/staff" />
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-px bg-primary/8 mb-px">

        {/* ── By category ── */}
        <div className="bg-surface p-6">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-5">Products by Category</p>
          {loading ? (
            <p className="text-[11px] text-muted">Loading...</p>
          ) : (
            <div className="flex flex-col gap-3">
              {p && Object.entries(p.by_category).map(([cat, count]) => {
                const pct = p.total > 0 ? Math.round((count / p.total) * 100) : 0
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold tracking-[0.1em] uppercase">{cat}</span>
                      <span className="text-[11px] text-muted">{count} <span className="text-muted/50">({pct}%)</span></span>
                    </div>
                    <div className="h-px bg-primary/10 w-full relative">
                      <div className="absolute inset-y-0 left-0 bg-primary/40 h-[2px] -top-[0.5px] transition-all duration-500"
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
              {!p && <p className="text-[11px] text-muted/60">No data</p>}
            </div>
          )}
        </div>

        {/* ── Quick actions ── */}
        <div className="bg-surface p-6">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-5">Quick Actions</p>
          <div className="flex flex-col gap-2">
            {quickActions.map(({ label, to }) => (
              <Link key={label + to} to={to}
                className="flex items-center justify-between py-3 border-b border-primary/8 text-[11px] font-bold tracking-[0.15em] uppercase text-muted hover:text-primary transition-colors duration-200 group">
                {label}
                <ArrowRight size={11} strokeWidth={1.6} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent products ── */}
      <div className="bg-surface border-t-0 p-6 border border-primary/10">
        <div className="flex items-center justify-between mb-5">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase">Recently Added</p>
          <Link to="/admin/products" className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted hover:text-primary transition-colors">
            View all
          </Link>
        </div>

        {loading ? (
          <p className="text-[11px] text-muted">Loading...</p>
        ) : p?.recent?.length > 0 ? (
          <div className="flex flex-col">
            {p.recent.map((prod, i) => (
              <Link key={prod.id} to={`/admin/products/${prod.id}/edit`}
                className={`flex items-center gap-4 py-3 ${i < p.recent.length - 1 ? 'border-b border-primary/8' : ''} hover:bg-primary/3 -mx-2 px-2 transition-colors group`}>
                <div className="w-8 h-10 bg-surface border border-primary/15 overflow-hidden shrink-0">
                  {prod.image
                    ? <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-primary/5" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold tracking-[0.06em] uppercase truncate group-hover:text-primary transition-colors">{prod.name}</p>
                  <p className="text-[10px] text-muted">{prod.category}</p>
                </div>
                <p className="text-[12px] font-bold shrink-0">₦{prod.price?.toLocaleString()}</p>
                <span className={`text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-1 shrink-0 ${prod.is_active ? 'bg-green-500/15 text-green-400' : 'bg-primary/8 text-muted'}`}>
                  {prod.is_active ? 'Active' : 'Inactive'}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-muted/60">No products yet. <Link to="/admin/products/new" className="text-primary underline">Add one.</Link></p>
        )}
      </div>
    </div>
  )
}

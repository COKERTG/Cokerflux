import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { api } from '../../lib/api'
import ProductImage from '../../components/ProductImage'
import { useAuth } from '../../context/AuthContext'
import {
  PageHeader, Panel, StatCard, CategoryBar, StatusTag,
} from '../../admin/ui'

export default function AdminDashboard() {
  const { canManage } = useAuth()
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const r = await api.getDashboard()
        const d = await r.json()
        setData(d)
      } catch {
        // silently fail — dashboard shows empty state
      } finally {
        setLoading(false)
      }
    }
    load()
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

  const categories = p ? Object.entries(p.by_category) : []

  return (
    <div>
      <PageHeader kicker="Overview" title="DASHBOARD" />

      {/* ── Stat cards ── (label-over-metric hierarchy, no generic icon+label combo) */}
      <div className={`grid grid-cols-2 ${canManage ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 md:gap-5 mb-5`}>
        <StatCard
          label="Total Products"
          value={p?.total}
          sub={p ? `${p.active} active · ${p.inactive} inactive` : undefined}
          to="/admin/products"
        />
        <StatCard
          label="Active Products"
          value={p?.active}
          sub={p ? 'Visible in shop' : undefined}
        />
        <StatCard
          label="Inactive Products"
          value={p?.inactive}
          sub={p ? 'Hidden from shop' : undefined}
        />
        {canManage && (
          <StatCard
            label="Staff Members"
            value={s?.total}
            sub={s?.pending_invites
              ? `${s.pending_invites} invite${s.pending_invites !== 1 ? 's' : ''} pending`
              : 'No pending invites'}
            to="/admin/staff"
          />
        )}
      </div>

      {/* ── Breakdown + quick actions ── */}
      <div className="grid lg:grid-cols-2 gap-4 md:gap-5 mb-5">

        {/* By category */}
        <Panel title="Products by Category">
          {loading ? (
            <p className="text-[11px] text-muted tracking-[0.1em]">Loading…</p>
          ) : categories.length > 0 ? (
            <div className="flex flex-col gap-4">
              {categories.map(([cat, count]) => (
                <CategoryBar key={cat} label={cat} count={count} total={p.total} />
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-muted/60 tracking-[0.03em]">No category data yet.</p>
          )}
        </Panel>

        {/* Quick actions */}
        <Panel title="Quick Actions" bodyClassName="px-5 md:px-6 py-1">
          <div className="flex flex-col">
            {quickActions.map(({ label, to }, i) => (
              <Link
                key={label + to}
                to={to}
                className={`flex items-center justify-between py-4 text-[11px] font-bold tracking-[0.15em] uppercase text-muted hover:text-primary transition-colors duration-200 group ${i < quickActions.length - 1 ? 'border-b border-primary/8' : ''}`}
              >
                {label}
                <ArrowRight size={12} strokeWidth={1.8} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      {/* ── Recently added ── */}
      <Panel
        title="Recently Added"
        action={
          <Link to="/admin/products" className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted hover:text-primary transition-colors">
            View all
          </Link>
        }
        bodyClassName="px-5 md:px-6 py-1"
      >
        {loading ? (
          <p className="text-[11px] text-muted tracking-[0.1em] py-4">Loading…</p>
        ) : p?.recent?.length > 0 ? (
          <div className="flex flex-col">
            {p.recent.map((prod, i) => (
              <Link
                key={prod.id}
                to={`/admin/products/${prod.id}/edit`}
                className={`flex items-center gap-4 py-3.5 ${i < p.recent.length - 1 ? 'border-b border-primary/8' : ''} hover:bg-primary/[0.04] -mx-3 px-3 transition-colors group`}
              >
                <div className="w-9 h-11 bg-surface border border-primary/15 overflow-hidden shrink-0">
                  {prod.image
                    ? <ProductImage src={prod.image} alt={prod.name} wrapperClassName="w-full h-full" className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-primary/5" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold tracking-[0.06em] uppercase truncate group-hover:text-primary transition-colors">{prod.name}</p>
                  <p className="text-[10px] text-muted tracking-[0.04em] mt-0.5">{prod.category}</p>
                </div>
                <p className="text-[12px] font-bold tracking-[0.04em] shrink-0">₦{prod.price?.toLocaleString()}</p>
                <div className="shrink-0 w-[72px] flex justify-end">
                  <StatusTag active={prod.is_active} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-muted/60 py-4">
            No products yet. <Link to="/admin/products/new" className="text-primary underline underline-offset-2">Add one.</Link>
          </p>
        )}
      </Panel>
    </div>
  )
}

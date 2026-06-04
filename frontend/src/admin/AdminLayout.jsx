import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, Users, LogOut, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AdminLayout() {
  const { user, logout, canManage } = useAuth()

  const nav = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/products',  icon: Package,          label: 'Products'  },
    ...(canManage ? [{ to: '/admin/staff', icon: Users, label: 'Staff' }] : []),
  ]
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex h-screen bg-background text-primary overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-[220px] shrink-0 flex flex-col border-r border-primary/10 bg-surface">
        <div className="px-6 py-6 border-b border-primary/10">
          {/* <p className="font-display text-[22px] tracking-[0.18em] leading-none">COKERFLUX</p> */}
          <img src='/cokerflux.webp' alt="Cokerflux" className="w-10 h-10 object-cover" />
          <p className="text-[9px] font-bold tracking-[0.3em] text-muted uppercase mt-2">Admin Panel</p>
        </div>

        <nav className="flex-1 py-4">

          
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-[11px] font-bold tracking-[0.18em] uppercase transition-all duration-200 group
                ${isActive
                  ? 'text-primary bg-background/50 border-r-2 border-primary'
                  : 'text-muted hover:text-primary hover:bg-background/30'}`
              }
            >
              <Icon size={14} strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-5 border-t border-primary/10">
          <div className="mb-3">
            <p className="text-[11px] font-bold tracking-[0.08em] truncate">{user?.username}</p>
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-muted">{user?.role}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] uppercase text-muted hover:text-primary transition-colors duration-200"
          >
            <LogOut size={12} strokeWidth={1.8} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[56px] shrink-0 flex items-center justify-between px-8 border-b border-primary/10 bg-background">
          <div className="flex items-center gap-2 text-[10px] text-muted">
            <span className="font-bold tracking-[0.2em] uppercase">Admin</span>
            <ChevronRight size={10} />
          </div>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted/50">
            {new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

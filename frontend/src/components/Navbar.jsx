import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, ShoppingBag, Menu, X } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'

const ticker = [
  'New Drop SS25',
  'Free Shipping Over ₦50,000',
  'Limited Stock — Shop Now',
  'Cokerflux — Built Different',
  'Members Get Early Access',
]

const leftLinks  = [['/', 'Home'], ['/shop', 'Shop']]
const rightLinks = [['/about', 'About'], ['/contact', 'Contact']]

export default function Navbar() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { currency, setCurrency } = useCurrency()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const NavLink = ({ path, label }) => (
    <Link
      to={path}
      className={`relative text-[11px] font-bold tracking-[0.22em] uppercase transition-colors duration-200 group
        ${pathname === path ? 'text-primary' : 'text-muted hover:text-primary'}`}
    >
      {label}
      <span className={`absolute -bottom-[3px] left-0 h-[1px] bg-primary transition-all duration-300
        ${pathname === path ? 'w-full' : 'w-0 group-hover:w-full'}`}
      />
    </Link>
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      {/* ── Ticker ── */}
      <div className="bg-primary text-text-dark overflow-hidden py-[10px]">
        <div className="flex gap-16 whitespace-nowrap animate-ticker">
          {[...ticker, ...ticker, ...ticker].map((t, i) => (
            <span key={i} className="text-[10px] font-bold tracking-[0.28em] uppercase">
              {t} <span className="opacity-25 mx-2">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Main nav ── */}
      <nav className={`relative flex items-center justify-between px-10 border-b border-primary/15 transition-all duration-300
        ${scrolled
          ? 'bg-background/90 backdrop-blur-md h-[58px]'
          : 'bg-background h-[68px]'
        }`}
      >
        {/* Left links — desktop */}
        <div className="hidden md:flex items-center gap-10 w-[220px]">
          {leftLinks.map(([path, label]) => (
            <NavLink key={path} path={path} label={label} />
          ))}
        </div>

        {/* Logo — left on mobile, centered on desktop */}
        <Link
          to="/"
          className="md:absolute md:left-1/2 md:-translate-x-1/2 hover:opacity-75 transition-opacity duration-200"
        >
          <img src="/logo.webp" alt="Cokerflux" className="h-[32px] w-auto" />
        </Link>

        {/* Right links + icons — desktop */}
        <div className="hidden md:flex items-center justify-end gap-10 w-[220px]">
          {rightLinks.map(([path, label]) => (
            <NavLink key={path} path={path} label={label} />
          ))}

          <div className="flex items-center gap-5 pl-6 border-l border-primary/15">
            <button
              onClick={() => setCurrency(c => c === 'NGN' ? 'GHS' : 'NGN')}
              className="text-[9px] font-bold tracking-[0.18em] uppercase border border-primary/25 px-2 py-1 text-muted hover:text-primary hover:border-primary/50 transition-all duration-200"
            >
              {currency === 'NGN' ? '₦ NGN' : 'GH₵ GHS'}
            </button>

            <button
              aria-label="Search"
              className="text-muted hover:text-primary transition-colors duration-200"
            >
              <Search size={15} strokeWidth={1.6} />
            </button>

            <button
              aria-label="Cart"
              className="relative text-muted hover:text-primary transition-colors duration-200"
            >
              <ShoppingBag size={15} strokeWidth={1.6} />
              <span className="absolute -top-[6px] -right-[6px] w-[14px] h-[14px] bg-primary text-text-dark text-[8px] font-bold rounded-full flex items-center justify-center leading-none">
                0
              </span>
            </button>
          </div>
        </div>

        {/* Mobile — cart + hamburger */}
        <div className="flex md:hidden items-center gap-5 ml-auto">
          <button
            aria-label="Cart"
            className="relative text-muted hover:text-primary transition-colors duration-200"
          >
            <ShoppingBag size={17} strokeWidth={1.6} />
            <span className="absolute -top-[6px] -right-[6px] w-[14px] h-[14px] bg-primary text-text-dark text-[8px] font-bold rounded-full flex items-center justify-center leading-none">
              0
            </span>
          </button>

          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(o => !o)}
            className="text-primary transition-colors duration-200"
          >
            {menuOpen
              ? <X size={19} strokeWidth={1.6} />
              : <Menu size={19} strokeWidth={1.6} />
            }
          </button>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-background border-b border-primary/15
        ${menuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {[...leftLinks, ...rightLinks].map(([path, label]) => (
          <Link
            key={path}
            to={path}
            onClick={() => setMenuOpen(false)}
            className={`flex items-center justify-between px-10 py-4 text-[11px] font-bold tracking-[0.22em] uppercase border-b border-surface/50 transition-colors duration-200
              ${pathname === path ? 'text-primary' : 'text-muted'}`}
          >
            {label}
            <span className="text-primary/30 text-[16px] font-light">→</span>
          </Link>
        ))}

        <div className="px-10 py-5 flex items-center gap-5">
          <button className="text-muted hover:text-primary transition-colors duration-200">
            <Search size={17} strokeWidth={1.6} />
          </button>
          <button
            onClick={() => setCurrency(c => c === 'NGN' ? 'GHS' : 'NGN')}
            className="text-[9px] font-bold tracking-[0.18em] uppercase border border-primary/25 px-2 py-1 text-muted hover:text-primary hover:border-primary/50 transition-all duration-200"
          >
            {currency === 'NGN' ? '₦ NGN' : 'GH₵ GHS'}
          </button>
        </div>
      </div>

    </header>
  )
}

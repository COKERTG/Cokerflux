/**
 * Shared admin design system.
 *
 * Small, presentational primitives so every /admin/* page shares one look:
 * sharp edges, thin low-opacity dividers, Bebas display numerals, and the
 * bottom-border input style used across the storefront. No functionality or
 * data flow lives here — these are styling wrappers only.
 */
import { Link } from 'react-router-dom'
import { ArrowUpRight, TrendingUp, TrendingDown, X } from 'lucide-react'

/* ── Page scaffolding ──────────────────────────────────────────── */

export function PageHeader({ kicker, title, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 md:mb-10">
      <div>
        {kicker && <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-2">{kicker}</p>}
        <h1 className="font-display text-[40px] md:text-[52px] leading-[0.85] tracking-[0.03em]">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  )
}

// `icon` is an optional lucide component rendered left of the title (utility panels
// like the product-view sections use one). Header renders whenever a title, icon, or
// action is present.
export function Panel({ title, icon: Icon, action, children, className = '', bodyClassName = 'p-5 md:p-6' }) {
  return (
    <div className={`bg-surface border border-primary/10 ${className}`}>
      {(title || action || Icon) && (
        <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-primary/10">
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && <Icon size={13} strokeWidth={1.8} className="text-muted shrink-0" />}
            {title && <p className="text-[10px] font-bold tracking-[0.25em] uppercase truncate">{title}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  )
}

/* ── Metrics ───────────────────────────────────────────────────── */

// Label on top (small), metric dominant (big Bebas) — clear hierarchy, no generic icon+label combo.
// `trend` is optional: { dir: 'up'|'down', value: '+12%' }. Only pass it when real historical data exists.
export function StatCard({ label, value, sub, to, trend }) {
  const inner = (
    <div className="relative h-full bg-surface border border-primary/10 p-6 md:p-7 hover:border-primary/25 transition-colors duration-200 group">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted">{label}</p>
        {to && <ArrowUpRight size={14} strokeWidth={1.8} className="text-primary/25 group-hover:text-primary transition-colors" />}
      </div>
      <p className="font-display text-[56px] md:text-[64px] leading-[0.82] tracking-[0.02em] mt-4">{value ?? '—'}</p>
      {(sub || trend) && (
        <div className="mt-3 flex items-center gap-2">
          {trend && (
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.08em] ${trend.dir === 'down' ? 'text-red-400' : 'text-primary'}`}>
              {trend.dir === 'down' ? <TrendingDown size={11} strokeWidth={2} /> : <TrendingUp size={11} strokeWidth={2} />}
              {trend.value}
            </span>
          )}
          {sub && <p className="text-[11px] text-muted/70 tracking-[0.03em]">{sub}</p>}
        </div>
      )}
    </div>
  )
  return to ? <Link to={to} className="block h-full">{inner}</Link> : inner
}

// Horizontal category bar for the dashboard breakdown. Uses only the site tokens
// (surface track / primary fill) instead of a chart library's default palette, so
// it sits inside the dark theme rather than fighting it.
export function CategoryBar({ label, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[11px] font-bold tracking-[0.12em] uppercase">{label}</span>
        <span className="text-[11px] text-muted tracking-[0.04em]">
          {count} <span className="text-muted/40">· {pct}%</span>
        </span>
      </div>
      <div className="h-[3px] w-full bg-primary/8">
        <div
          className="h-full bg-primary/70 transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

/* ── Tags / status ─────────────────────────────────────────────── */

// Consistent with the storefront product-card tag: solid primary chip for "on"
// states, thin outline for "off". No off-token colours.
const TAG_TONES = {
  solid:    'bg-primary text-text-dark',
  outline:  'border border-primary/20 text-muted',
  subtle:   'bg-primary/10 text-primary',
}

export function Tag({ children, tone = 'subtle', className = '' }) {
  return (
    <span className={`inline-flex items-center text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-1 ${TAG_TONES[tone] || TAG_TONES.subtle} ${className}`}>
      {children}
    </span>
  )
}

export function StatusTag({ active }) {
  return <Tag tone={active ? 'solid' : 'outline'}>{active ? 'Active' : 'Inactive'}</Tag>
}

// Product marketing tag (New / SS25 / Limited …). Storefront product cards render
// every tag as a solid primary chip (see Shop.jsx) — mirror that exactly instead of
// the old per-tag colour map so the admin reads as the same brand, no off-token hues.
export function ProductTag({ children }) {
  if (!children) return <span className="text-muted/30 text-[10px]">—</span>
  return <Tag tone="solid">{children}</Tag>
}

/* ── Table ─────────────────────────────────────────────────────── */

export function Table({ children, className = '' }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full border-collapse ${className}`}>{children}</table>
    </div>
  )
}

export function THead({ children }) {
  return (
    <thead>
      <tr className="border-b border-primary/15 text-left">{children}</tr>
    </thead>
  )
}

export function Th({ children, className = '' }) {
  return <th className={`py-3 px-3 text-[9px] font-bold tracking-[0.2em] uppercase text-muted whitespace-nowrap ${className}`}>{children}</th>
}

export function Tbody({ children }) {
  return <tbody className="divide-y divide-primary/8">{children}</tbody>
}

export function Tr({ children, className = '', ...props }) {
  return (
    <tr className={`transition-colors ${props.onClick ? 'cursor-pointer hover:bg-primary/[0.04]' : ''} ${className}`} {...props}>
      {children}
    </tr>
  )
}

export function Td({ children, className = '' }) {
  return <td className={`py-3 px-3 text-[12px] tracking-[0.03em] align-middle ${className}`}>{children}</td>
}

/* ── Form controls (bottom-border style, matches the storefront) ── */

const INPUT_BASE =
  'w-full bg-transparent border-b border-primary/20 pb-2 text-[14px] tracking-[0.03em] text-primary placeholder-muted/30 focus:outline-none focus:border-primary/50 transition-colors'

export function Field({ label, htmlFor, error, hint, children }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label htmlFor={htmlFor} className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted">{label}</label>}
      {children}
      {hint && !error && <p className="text-[10px] text-muted/50 tracking-[0.02em]">{hint}</p>}
      {error && <p className="text-[10px] text-red-400">{error}</p>}
    </div>
  )
}

export function TextInput({ className = '', ...props }) {
  return <input className={`${INPUT_BASE} ${className}`} {...props} />
}

export function TextArea({ className = '', rows = 4, ...props }) {
  return <textarea rows={rows} className={`${INPUT_BASE} resize-none ${className}`} {...props} />
}

export function SelectField({ className = '', children, ...props }) {
  return (
    <select
      className={`w-full bg-surface border border-primary/20 px-3 py-2 text-[12px] tracking-[0.04em] text-primary focus:outline-none focus:border-primary/50 transition-colors ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

// Inline-editable cell (price, price_ghs…): reads as text until hovered/focused,
// then reveals the bottom-border affordance. Keeps table rows from looking like a
// wall of default input boxes.
export function InlineNumber({ prefix, className = '', ...props }) {
  return (
    <span className="inline-flex items-center gap-1">
      {prefix && <span className="text-muted/60 text-[12px]">{prefix}</span>}
      <input
        type="number"
        className={`w-20 bg-transparent border-b border-transparent hover:border-primary/20 focus:border-primary/60 pb-0.5 text-[12px] tracking-[0.03em] text-primary focus:outline-none transition-colors ${className}`}
        {...props}
      />
    </span>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onChange}
        aria-pressed={checked}
        className={`w-10 h-5 rounded-full transition-colors duration-200 relative shrink-0 ${checked ? 'bg-primary' : 'bg-surface border border-primary/20'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-background transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
      {label && <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted">{label}</span>}
    </div>
  )
}

export function FormSection({ title, description, children }) {
  return (
    <section className="border-t border-primary/10 pt-8 first:border-t-0 first:pt-0">
      <div className="mb-5">
        <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary">{title}</h2>
        {description && <p className="text-[11px] text-muted/60 mt-1 tracking-[0.02em]">{description}</p>}
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  )
}

/* ── Buttons ───────────────────────────────────────────────────── */

// Both button variants accept an optional `to` (renders a router Link with the same
// styling) and an optional `icon` (lucide component, sized to match the label). This
// lets the header "Add" links and the form submit buttons share one definition.
const PRIMARY_CLS = 'inline-flex items-center justify-center gap-2 py-3 px-6 bg-primary text-text-dark text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-primary/85 transition-colors disabled:opacity-50'
const GHOST_CLS   = 'inline-flex items-center justify-center gap-2 py-3 px-6 border border-primary/20 text-[11px] font-bold tracking-[0.2em] uppercase text-muted hover:text-primary hover:border-primary/40 transition-colors'

function buttonInner(Icon, children) {
  return <>{Icon && <Icon size={13} strokeWidth={2.2} />}{children}</>
}

export function PrimaryButton({ className = '', to, icon: Icon, children, ...props }) {
  const cls = `${PRIMARY_CLS} ${className}`
  const inner = buttonInner(Icon, children)
  return to
    ? <Link to={to} className={cls}>{inner}</Link>
    : <button className={cls} {...props}>{inner}</button>
}

export function GhostButton({ className = '', to, icon: Icon, children, ...props }) {
  const cls = `${GHOST_CLS} ${className}`
  const inner = buttonInner(Icon, children)
  return to
    ? <Link to={to} className={cls}>{inner}</Link>
    : <button className={cls} {...props}>{inner}</button>
}

// Small square icon-only action (table row edit/delete, modal close). `tone="danger"`
// switches the hover to the destructive red used elsewhere.
export function IconButton({ icon: Icon, tone = 'default', className = '', size = 13, ...props }) {
  const hover = tone === 'danger' ? 'hover:text-red-400' : 'hover:text-primary'
  return (
    <button
      type="button"
      className={`p-1.5 text-muted ${hover} transition-colors disabled:opacity-40 ${className}`}
      {...props}
    >
      <Icon size={size} strokeWidth={1.8} />
    </button>
  )
}

/* ── Feedback ──────────────────────────────────────────────────── */

// Inline success / error banner (staff invite result, form-level errors). Same thin
// low-opacity border language as the rest of the panel work; only the accent hue changes.
const BANNER_TONES = {
  success: 'border-green-500/20 bg-green-500/5 text-green-400',
  error:   'border-red-500/20 bg-red-500/5 text-red-400',
  info:    'border-primary/15 bg-primary/[0.04] text-muted',
}

export function Banner({ tone = 'info', children, className = '' }) {
  if (!children) return null
  return (
    <div className={`px-4 py-3 border text-[11px] tracking-[0.04em] ${BANNER_TONES[tone] || BANNER_TONES.info} ${className}`}>
      {children}
    </div>
  )
}

/* ── Modal ─────────────────────────────────────────────────────── */

// Centered overlay dialog. Backdrop click and the corner X both call onClose; inner
// clicks are stopped. Callers own their own body/footer so this stays presentational.
export function Modal({ onClose, children, className = '', maxWidth = 'max-w-lg' }) {
  return (
    <div
      className="fixed inset-0 bg-background/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`relative bg-surface border border-primary/15 w-full ${maxWidth} max-h-[90vh] flex flex-col overflow-hidden ${className}`}
        onClick={e => e.stopPropagation()}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-muted hover:text-primary transition-colors"
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.6} />
          </button>
        )}
        {children}
      </div>
    </div>
  )
}

// Destructive confirmation built on Modal. Danger primary + ghost cancel, matching the
// existing delete dialog. `loading` disables the confirm and swaps its label.
export function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel, loading }) {
  return (
    <Modal onClose={onCancel} maxWidth="max-w-[380px]">
      <div className="p-8">
        <p className="text-[12px] font-bold tracking-[0.12em] uppercase mb-4">{title}</p>
        {message && <p className="text-[13px] text-muted tracking-[0.03em] leading-relaxed mb-8">{message}</p>}
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 bg-red-500/90 text-white text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-red-500 transition-colors disabled:opacity-50"
          >
            {loading ? 'Working…' : confirmLabel}
          </button>
          <GhostButton onClick={onCancel} className="flex-1 py-3 px-4">Cancel</GhostButton>
        </div>
      </div>
    </Modal>
  )
}

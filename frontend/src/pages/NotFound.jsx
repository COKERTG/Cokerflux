import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="relative bg-background text-primary min-h-[calc(100vh-88px)] md:min-h-[calc(100vh-98px)] flex flex-col items-center justify-center px-6 md:px-10 text-center overflow-hidden">

      {/* Oversized ghost numeral behind the message */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 flex items-center justify-center font-display text-primary/[0.05] leading-none tracking-[0.02em] text-[44vw] md:text-[34vw]"
      >
        404
      </span>

      <div className="relative z-10 flex flex-col items-center">
        <p className="text-[10px] font-bold tracking-[0.4em] text-primary/55 uppercase mb-5">
          404 — Dead link
        </p>

        <h1 className="font-display text-[64px] sm:text-[96px] md:text-[132px] leading-[0.82] tracking-[0.02em] mb-6">
          SOLD OUT.
        </h1>

        <p className="text-[14px] md:text-[15px] text-muted tracking-[0.03em] leading-relaxed max-w-[380px] mb-10">
          This page dropped and it's gone — or it never existed. Either way, the rack's still full.
        </p>

        <div className="flex items-center gap-6">
          <Link
            to="/shop"
            className="group inline-flex items-center gap-3 bg-primary text-text-dark px-8 py-4 text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-primary/85 transition-colors duration-200"
          >
            Shop The Drop
            <ArrowUpRight size={13} strokeWidth={2.4} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            to="/"
            className="text-[11px] font-bold tracking-[0.25em] uppercase text-muted hover:text-primary transition-colors duration-200 border-b border-muted/20 hover:border-primary/50 pb-px"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  )
}

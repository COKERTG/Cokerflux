import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="bg-background text-primary min-h-[calc(100vh-98px)] flex flex-col items-center justify-center px-10 text-center">
      <p className="text-[10px] font-bold tracking-[0.35em] text-muted uppercase mb-4">Error</p>
      <h1 className="font-display text-[120px] md:text-[180px] leading-none tracking-[0.02em] text-primary/10 mb-0">
        404
      </h1>
      <h2 className="font-display text-[32px] md:text-[48px] leading-none tracking-[0.04em] -mt-4 mb-6">
        PAGE NOT FOUND
      </h2>
      <p className="text-[14px] text-muted tracking-[0.03em] leading-relaxed max-w-[360px] mb-10">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="inline-flex items-center gap-3 bg-primary text-text-dark px-8 py-3.5 text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-primary/85 transition-colors duration-200"
        >
          Back Home <ArrowRight size={12} strokeWidth={2.2} />
        </Link>
        <Link
          to="/shop"
          className="text-[11px] font-bold tracking-[0.25em] uppercase text-muted hover:text-primary transition-colors duration-200 border-b border-muted/20 pb-px"
        >
          Shop
        </Link>
      </div>
    </main>
  )
}

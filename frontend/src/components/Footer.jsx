import { Link } from 'react-router-dom'

const cols = [
  {
    title: 'Shop',
    links: [['New Arrivals', '/shop'], ['Hoodies', '/shop'], ['Tees', '/shop'], ['Accessories', '/shop']],
  },
  {
    title: 'Info',
    links: [['About Us', '/about'], ['Sizing Guide', '/sizing-guide'], ['FAQ', '/faq'], ['Contact', '/contact']],
  },
  {
    title: 'Legal',
    links: [['Privacy Policy', '/privacy-policy'], ['Terms', '/terms'], ['Returns', '/returns']],
  },
]

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/Coker_flux_original' },
  { label: 'Twitter', href: 'https://x.com/Cokerfluxorigil' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@Cokerfluxoriginal' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#1a1a1a]">
      <div className="grid grid-cols-2 md:grid-cols-4 border-t-2 border-b-2 border-primary">
        {/* Brand col — full width on mobile */}
        <div className="col-span-2 md:col-span-1 p-6 md:p-8 border-b-2 md:border-b-0 md:border-r-2 border-primary">
          <img src="/logo.webp" alt="Cokerflux" className="h-8 w-auto mb-4" />
          <p className="text-[12px] text-muted leading-relaxed tracking-[0.04em] max-w-[200px]">
            Premium streetwear for those who move different. Built for the culture.
          </p>
        </div>

        {/* Link cols */}
        {cols.map((col) => (
          <div key={col.title} className="p-6 md:p-8 border-t border-surface md:border-t-0 md:border-r md:last:border-r-0">
            <h4 className="font-display text-[15px] tracking-[0.2em] mb-5">{col.title}</h4>
            <ul className="flex flex-col gap-3">
              {col.links.map(([label, path]) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="text-[12px] text-muted uppercase tracking-[0.08em] hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between items-center px-6 py-5">
        <p className="text-[11px] text-[#444] tracking-[0.1em] uppercase">
          © {year} Cokerflux. All rights reserved.
        </p>
        <div className="flex gap-6">
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="text-[11px] text-[#444] uppercase tracking-[0.12em] hover:text-primary transition-colors">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

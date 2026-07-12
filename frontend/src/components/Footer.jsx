import { Link } from 'react-router-dom'

const cols = [
  {
    title: 'Shop',
    links: [['New Arrivals', '/shop'], ['Hoodies', '/shop'], ['Tees', '/shop'], ['Caps', '/shop']],
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
    <footer className="bg-[#1a1a1a] text-primary">
      {/* Asymmetric grid — brand column wider than the link columns.
          Sections are separated by spacing + one thin low-opacity rule, not stark white borders. */}
      <div className="grid grid-cols-2 md:grid-cols-[1.7fr_1fr_1fr_1fr] gap-x-6 gap-y-10 px-5 md:px-10 pt-12 md:pt-16 pb-10 md:pb-14 border-t border-primary/10">

        {/* Brand col — full width on mobile, widest on desktop */}
        <div className="col-span-2 md:col-span-1 md:pr-10">
          <img src="/logo.webp" alt="Cokerflux" className="hidden md:block h-8 w-auto mb-4" />
          <img src="/cokerflux.webp" alt="Cokerflux" className="block md:hidden h-8 w-auto object-contain mb-3" />
          <p className="text-[11px] md:text-[12px] text-muted leading-relaxed tracking-[0.04em] max-w-[220px]">
            Premium streetwear for those who move different. Built for the culture.
          </p>
        </div>

        {/* Link cols — separated by gap, no dividers */}
        {cols.map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-[14px] md:text-[15px] tracking-[0.2em] mb-4 md:mb-5">{col.title}</h4>
            <ul className="flex flex-col gap-2 md:gap-3">
              {col.links.map(([label, path]) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="text-[11px] md:text-[12px] text-muted uppercase tracking-[0.08em] hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

     

      {/* Bottom bar — thin low-opacity divider above it */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between items-center px-5 md:px-10 py-5 md:py-6 border-t border-primary/10">
        <p className="text-[10px] md:text-[11px] text-muted/60 tracking-[0.1em] uppercase">
          © {year} Cokerflux. All rights reserved.
        </p>
        <div className="flex gap-4 md:gap-6">
          
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="text-[10px] md:text-[11px] text-muted/60 uppercase tracking-[0.12em] hover:text-primary transition-colors">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

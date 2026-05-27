import { Link } from 'react-router-dom'

const cols = [
  {
    title: 'Shop',
    links: [['New Arrivals', '/shop'], ['Hoodies', '/shop'], ['Tees', '/shop'], ['Accessories', '/shop']],
  },
  {
    title: 'Info',
    links: [['About Us', '/about'], ['Sizing Guide', '/'], ['FAQ', '/'], ['Contact', '/contact']],
  },
  {
    title: 'Legal',
    links: [['Privacy Policy', '/'], ['Terms', '/'], ['Returns', '/']],
  },
]

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a]">
      <div className="grid grid-cols-4 border-t-2 border-b-2 border-primary">
        {/* Brand col */}
        <div className="p-8 border-r-2 border-primary">
          <p className="font-display text-[30px] tracking-[0.15em] mb-4">COKERFLUX</p>
          <p className="text-[12px] text-muted leading-relaxed tracking-[0.04em] max-w-[200px]">
            Premium streetwear for those who move different. Built for the culture.
          </p>
        </div>

        {/* Link cols */}
        {cols.map((col) => (
          <div key={col.title} className="p-8 border-r border-surface last:border-r-0">
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
      <div className="flex justify-between items-center px-6 py-5">
        <p className="text-[11px] text-[#444] tracking-[0.1em] uppercase">
          © 2025 Cokerflux. All rights reserved.
        </p>
        <div className="flex gap-6">
          {['Instagram', 'Twitter', 'TikTok'].map((s) => (
            <a key={s} href="#" className="text-[11px] text-[#444] uppercase tracking-[0.12em] hover:text-primary transition-colors">
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
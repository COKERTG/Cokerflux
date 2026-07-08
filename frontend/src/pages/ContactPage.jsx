import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { api } from '../lib/api'

const socials = [
  { label: 'Instagram', handle: 'Coker_flux_original', href: 'https://www.instagram.com/Coker_flux_original' },
  { label: 'Twitter', handle: '@Cokerfluxorigil', href: 'https://x.com/Cokerfluxorigil' },
  { label: 'TikTok', handle: 'Cokerfluxoriginal', href: 'https://www.tiktok.com/@Cokerfluxoriginal' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.sendContactMessage(form)
      const data = await res.json()
      if (!res.ok) {
        const errors = data?.errors || {}
        const msg =
          errors.name?.[0] ||
          errors.email?.[0] ||
          errors.message?.[0] ||
          data?.error ||
          'Could not send your message.'
        setError(msg)
        return
      }
      setSent(true)
      setForm({ name: '', email: '', message: '' })
    } catch {
      setError('Could not reach the server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-background text-primary min-h-screen">

      {/* ── Banner ── */}
      <section className="px-5 md:px-10 py-10 md:py-16 border-b border-primary/10">
        <p className="text-[10px] font-bold tracking-[0.35em] text-muted uppercase mb-3">
          Get In Touch
        </p>
        <h1 className="font-display text-[48px] sm:text-[70px] md:text-[110px] leading-[0.88] tracking-[0.02em]">
          REACH OUT
        </h1>
      </section>

      {/* ── Two columns ── */}
      <section className="grid md:grid-cols-2 border-b border-primary/10">

        {/* Left — info */}
        <div className="px-5 md:px-10 py-10 md:py-16 md:border-r border-primary/10 flex flex-col gap-8 md:gap-12">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-4">Email</p>
            <a
              href="mailto:cokerflux.ng@gmail.com"
              className="text-[14px] md:text-[15px] tracking-[0.04em] text-primary/80 hover:text-primary transition-colors duration-200 border-b border-primary/15 pb-px break-all"
            >
              cokerflux.ng@gmail.com
            </a>
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-4">Based In</p>
            <p className="text-[14px] md:text-[15px] tracking-[0.04em] text-primary/80">Lagos, Nigeria</p>
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-5">Follow</p>
            <div className="flex flex-col gap-3">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between group max-w-[280px] py-2 border-b border-primary/8 hover:border-primary/25 transition-colors duration-200"
                >
                  <span className="text-[10px] md:text-[11px] font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase text-muted group-hover:text-primary transition-colors duration-200 truncate mr-2">
                    {s.label} / {s.handle}
                  </span>
                  <ArrowRight size={11} strokeWidth={1.8} className="text-primary/20 group-hover:text-primary transition-colors duration-200 shrink-0" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-3">Response Time</p>
            <p className="text-[12px] md:text-[13px] text-muted leading-relaxed tracking-[0.03em]">
              We reply within 24–48 hours. For order issues, include your order number.
            </p>
          </div>
        </div>

        {/* Right — form */}
        <div className="px-5 md:px-10 py-10 md:py-16 border-t md:border-t-0 border-primary/10">
          {sent ? (
            <div className="flex flex-col justify-center h-full">
              <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-4">Message Sent</p>
              <h2 className="font-display text-[36px] md:text-[48px] leading-none tracking-[0.04em] mb-4">WE GOT YOU.</h2>
              <p className="text-[13px] text-muted tracking-[0.03em]">We'll be in touch within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8">
              <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase">Send a Message</p>

              {error && (
                <div className="px-4 py-3 border border-red-500/30 bg-red-500/5 text-[12px] text-red-400 tracking-[0.04em]">
                  {error}
                </div>
              )}

              {[
                { name: 'name',  label: 'Your Name',     type: 'text'  },
                { name: 'email', label: 'Email Address',  type: 'email' },
              ].map(field => (
                <div key={field.name} className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted">
                    {field.label}
                  </label>
                  <input
                    required
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className="bg-transparent border-b border-primary/20 pb-3 text-[14px] tracking-[0.03em] text-primary placeholder-muted/40 focus:outline-none focus:border-primary/60 transition-colors duration-200"
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                  />
                </div>
              ))}

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted">
                  Message
                </label>
                <textarea
                  required
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  className="bg-transparent border-b border-primary/20 pb-3 text-[14px] tracking-[0.03em] text-primary placeholder-muted/40 focus:outline-none focus:border-primary/60 transition-colors duration-200 resize-none"
                  placeholder="What's on your mind?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="self-start inline-flex items-center gap-3 bg-primary text-text-dark px-6 md:px-8 py-3 md:py-3.5 text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-primary/85 transition-colors duration-200 mt-2 disabled:opacity-50"
              >
                {loading ? 'Sending...' : <>Send Message <ArrowRight size={12} strokeWidth={2.2} /></>}
              </button>
            </form>
          )}
        </div>
      </section>

    </main>
  )
}

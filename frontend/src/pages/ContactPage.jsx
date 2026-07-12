import { useState } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { api } from '../lib/api'
import { useSettings } from '../context/SettingsContext'
import { useCurrency } from '../context/CurrencyContext'
import Reveal from '../components/Reveal'

const socials = [
  { label: 'Instagram', handle: 'Coker_flux_original', href: 'https://www.instagram.com/Coker_flux_original' },
  { label: 'Twitter', handle: '@Cokerfluxorigil', href: 'https://x.com/Cokerfluxorigil' },
  { label: 'TikTok', handle: 'Cokerfluxoriginal', href: 'https://www.tiktok.com/@Cokerfluxoriginal' },
]

const WA_PREFILL = "Hey Cokerflux — I've got a question."

export default function ContactPage() {
  const { currency } = useCurrency()
  const { whatsappNumberFor } = useSettings()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const waNumber  = whatsappNumberFor(currency)
  const waDisplay = waNumber                                 // shown as stored (international format)
  const waUrl     = `https://wa.me/${waNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(WA_PREFILL)}`

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
    <main className="bg-background text-primary overflow-x-clip">

      {/* ══ Hero ══ */}
      <section className="px-5 md:px-16 pt-14 md:pt-24 pb-10 md:pb-16 border-b border-primary/10">
        <p className="text-[10px] font-bold tracking-[0.4em] text-primary/55 uppercase mb-5">
          Talk to us
        </p>
        <h1 className="font-display leading-[0.8] tracking-[0.01em] -ml-[2px]">
          <span className="block text-[56px] sm:text-[96px] md:text-[140px] lg:text-[168px]">SAY LESS.</span>
          <span className="block text-[56px] sm:text-[96px] md:text-[140px] lg:text-[168px] text-primary/30">WE'RE HERE.</span>
        </h1>
      </section>

      {/* ══ 01 — WhatsApp, the primary channel ══ */}
      <section className="px-5 md:px-16 py-14 md:py-24 border-b border-primary/10">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-2 flex md:flex-col items-baseline gap-4 md:gap-2">
            <p className="font-display text-[44px] md:text-[72px] leading-none text-primary/15">01</p>
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted">Fastest reply</p>
          </div>

          <div className="md:col-span-10">
            <Reveal>
              <h2 className="font-display text-[38px] sm:text-[60px] md:text-[88px] leading-[0.84] tracking-[0.01em] max-w-[14ch] mb-6 md:mb-8">
                MESSAGE US ON WHATSAPP
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-[14px] md:text-[16px] text-primary/75 leading-relaxed tracking-[0.02em] max-w-[440px] mb-8 md:mb-10">
                It's how we run — orders, sizing, restock questions, all of it. Tap through and
                you're talking to a real person, not a ticket queue.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-3 bg-primary text-text-dark px-8 md:px-10 py-4 md:py-5 text-[12px] font-bold tracking-[0.28em] uppercase hover:bg-primary/85 transition-colors duration-200"
                >
                  Open WhatsApp
                  <ArrowUpRight size={15} strokeWidth={2.4} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                {waDisplay && (
                  <span className="text-[13px] md:text-[14px] tracking-[0.14em] text-muted">{waDisplay}</span>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ 02 — Email form (secondary) + info ══ */}
      <section className="grid md:grid-cols-12 border-b border-primary/10">

        {/* Left — the note form */}
        <div className="md:col-span-7 px-5 md:px-16 py-14 md:py-24 md:border-r border-primary/10">
          <div className="flex items-baseline gap-4 mb-8 md:mb-12">
            <p className="font-display text-[44px] md:text-[64px] leading-none text-primary/15">02</p>
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted">Prefer to write?</p>
          </div>

          {sent ? (
            <Reveal>
              <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-4">Message sent</p>
              <h3 className="font-display text-[40px] md:text-[60px] leading-none tracking-[0.03em] mb-4">WE GOT YOU.</h3>
              <p className="text-[13px] md:text-[14px] text-muted tracking-[0.03em]">We'll be in touch within 48 hours.</p>
            </Reveal>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-7 md:gap-8 max-w-[520px]">
              {error && (
                <div className="px-4 py-3 border border-red-500/30 bg-red-500/5 text-[12px] text-red-400 tracking-[0.04em]">
                  {error}
                </div>
              )}

              {[
                { name: 'name',  label: 'Your Name',    type: 'text'  },
                { name: 'email', label: 'Email Address', type: 'email' },
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
                    className="bg-transparent border-b border-primary/20 pb-3 text-[15px] tracking-[0.03em] text-primary placeholder-muted/40 focus:outline-none focus:border-primary/60 transition-colors duration-200"
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                  />
                </div>
              ))}

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted">Message</label>
                <textarea
                  required
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  className="bg-transparent border-b border-primary/20 pb-3 text-[15px] tracking-[0.03em] text-primary placeholder-muted/40 focus:outline-none focus:border-primary/60 transition-colors duration-200 resize-none"
                  placeholder="What's on your mind?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="self-start inline-flex items-center gap-3 bg-primary text-text-dark px-7 md:px-8 py-3.5 text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-primary/85 transition-colors duration-200 mt-1 disabled:opacity-50"
              >
                {loading ? 'Sending…' : <>Send Message <ArrowRight size={12} strokeWidth={2.2} /></>}
              </button>
            </form>
          )}
        </div>

        {/* Right — info rail */}
        <div className="md:col-span-5 px-5 md:px-16 py-14 md:py-24 flex flex-col gap-10 md:gap-12 border-t md:border-t-0 border-primary/10">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-4">Email</p>
            <a
              href="mailto:cokerflux.ng@gmail.com"
              className="text-[14px] md:text-[15px] tracking-[0.04em] text-primary/80 hover:text-primary transition-colors duration-200 border-b border-primary/15 hover:border-primary/50 pb-px break-all"
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
                  className="flex items-center justify-between group max-w-[300px] py-2 border-b border-primary/8 hover:border-primary/25 transition-colors duration-200"
                >
                  <span className="text-[10px] md:text-[11px] font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase text-muted group-hover:text-primary transition-colors duration-200 truncate mr-2">
                    {s.label} / {s.handle}
                  </span>
                  <ArrowUpRight size={12} strokeWidth={1.8} className="text-primary/20 group-hover:text-primary transition-colors duration-200 shrink-0" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-3">Response Time</p>
            <p className="text-[12px] md:text-[13px] text-muted leading-relaxed tracking-[0.03em] max-w-[280px]">
              WhatsApp is same-day. Email and form messages, we reply within 24–48 hours — include your
              order number for anything order-related.
            </p>
          </div>
        </div>
      </section>

    </main>
  )
}

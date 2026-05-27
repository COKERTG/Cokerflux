import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

const socials = [
  { label: 'Instagram', href: '#' },
  { label: 'Twitter',   href: '#' },
  { label: 'TikTok',    href: '#' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <main className="bg-background text-primary min-h-screen">

      {/* ── Banner ── */}
      <section className="px-10 py-16 border-b border-primary/10">
        <p className="text-[10px] font-bold tracking-[0.35em] text-muted uppercase mb-3">
          Get In Touch
        </p>
        <h1 className="font-display text-[80px] md:text-[110px] leading-[0.88] tracking-[0.02em]">
          REACH OUT
        </h1>
      </section>

      {/* ── Two columns ── */}
      <section className="grid md:grid-cols-2 border-b border-primary/10">

        {/* Left — info */}
        <div className="px-10 py-16 border-r border-primary/10 flex flex-col gap-12">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-4">Email</p>
            <a
              href="mailto:hello@cokerflux.com"
              className="text-[15px] tracking-[0.04em] text-primary/80 hover:text-primary transition-colors duration-200 border-b border-primary/15 pb-px"
            >
              hello@cokerflux.com
            </a>
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-4">Based In</p>
            <p className="text-[15px] tracking-[0.04em] text-primary/80">Lagos, Nigeria</p>
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-5">Follow</p>
            <div className="flex flex-col gap-3">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  className="flex items-center justify-between group max-w-[220px] py-2 border-b border-primary/8 hover:border-primary/25 transition-colors duration-200"
                >
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted group-hover:text-primary transition-colors duration-200">
                    {s.label}
                  </span>
                  <ArrowRight size={11} strokeWidth={1.8} className="text-primary/20 group-hover:text-primary transition-colors duration-200" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-3">Response Time</p>
            <p className="text-[13px] text-muted leading-relaxed tracking-[0.03em]">
              We reply within 24–48 hours. For order issues, include your order number.
            </p>
          </div>
        </div>

        {/* Right — form */}
        <div className="px-10 py-16">
          {sent ? (
            <div className="flex flex-col justify-center h-full">
              <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-4">Message Sent</p>
              <h2 className="font-display text-[48px] leading-none tracking-[0.04em] mb-4">WE GOT YOU.</h2>
              <p className="text-[13px] text-muted tracking-[0.03em]">We'll be in touch within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase">Send a Message</p>

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
                className="self-start inline-flex items-center gap-3 bg-primary text-text-dark px-8 py-3.5 text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-primary/85 transition-colors duration-200 mt-2"
              >
                Send Message <ArrowRight size={12} strokeWidth={2.2} />
              </button>
            </form>
          )}
        </div>
      </section>

    </main>
  )
}

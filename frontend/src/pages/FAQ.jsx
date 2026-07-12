import { useState } from 'react';

const faqs = [
  {
    q: 'How do I place an order?',
    a: 'Find what you want in the shop, add it to your cart, and hit checkout. That opens a WhatsApp chat with your order already filled in — confirm the details with us there and we\'ll take it from there. No accounts, no long forms.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'You settle up over WhatsApp once your order\'s confirmed. We\'ll send the payment details right there in the chat — message us at checkout if you want to know what works for your location.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Worldwide — wherever you are, we\'ll get it to you. Rates depend on where it\'s headed, so message us at checkout and we\'ll sort your shipping before you pay.',
  },
  {
    q: 'How can I track my order?',
    a: 'Everything runs through the same WhatsApp chat you ordered in. We\'ll keep you posted as your order is packed and sent out — no tracking portals, no chasing emails.',
  },
  {
    q: 'What is your return policy?',
    a: 'You\'ve got 3 days from delivery to start a return. Pieces need to come back unworn with tags still on — message us on WhatsApp within that window and we\'ll arrange it.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <main className="bg-background text-primary min-h-screen overflow-x-clip">

      {/* ── Banner ── */}
      <section className="px-5 md:px-16 pt-14 md:pt-24 pb-10 md:pb-16 border-b border-primary/10">
        <p className="text-[10px] font-bold tracking-[0.4em] text-primary/55 uppercase mb-5">
          Support
        </p>
        <h1 className="font-display text-[52px] sm:text-[80px] md:text-[128px] leading-[0.82] tracking-[0.01em] -ml-[2px]">
          FAQ
        </h1>
      </section>

      {/* ── Questions ── (editorial dividers, custom +/− mark, grid-rows expand) */}
      <section className="px-5 md:px-16 py-6 md:py-10 max-w-[900px]">
        <div className="flex flex-col border-t border-primary/10">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <div key={i} className="border-b border-primary/10">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-5 md:gap-8 py-6 md:py-7 text-left group"
                >
                  <div className="flex items-baseline gap-4 md:gap-6 min-w-0">
                    <span className="font-display text-[18px] md:text-[24px] leading-none text-primary/20 shrink-0 w-7 md:w-10">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-[13px] md:text-[15px] font-bold tracking-[0.12em] md:tracking-[0.14em] uppercase transition-colors duration-200 ${isOpen ? 'text-primary' : 'text-primary/80 group-hover:text-primary'}`}>
                      {faq.q}
                    </span>
                  </div>

                  {/* + that becomes − on open — no boxed chevron */}
                  <span className={`relative w-3.5 h-3.5 shrink-0 transition-colors duration-200 ${isOpen ? 'text-primary' : 'text-muted group-hover:text-primary'}`}>
                    <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-current" />
                    <span className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-current transition-transform duration-300 ${isOpen ? 'scale-y-0' : 'scale-y-100'}`} />
                  </span>
                </button>

                <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <p className="text-[13px] md:text-[14px] text-muted leading-relaxed tracking-[0.03em] pl-11 md:pl-16 pr-4 pb-6 md:pb-8 max-w-[620px]">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

    </main>
  );
}

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How do I place an order?',
    a: 'Browse our shop, add items to your cart, and proceed to checkout. You\'ll receive a confirmation email with order details.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept major credit cards (Visa, MasterCard, Amex) and PayPal. All transactions are processed securely via Stripe.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes! Shipping rates are calculated at checkout. International customers may be subject to customs fees, which are the responsibility of the recipient.',
  },
  {
    q: 'How can I track my order?',
    a: 'Once your order ships, you\'ll receive a tracking number via email. Use it on the carrier\'s website to monitor delivery status.',
  },
  {
    q: 'What is your return policy?',
    a: 'We accept returns within 30 days of receipt for unused items. Contact support for a return authorization and instructions.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <main className="bg-background text-primary min-h-screen">

      {/* ── Banner ── */}
      <section className="px-5 md:px-10 py-10 md:py-16 border-b border-primary/10">
        <p className="text-[10px] font-bold tracking-[0.35em] text-muted uppercase mb-3">
          Support
        </p>
        <h1 className="font-display text-[48px] sm:text-[70px] md:text-[110px] leading-[0.88] tracking-[0.02em]">
          FAQ
        </h1>
      </section>

      {/* ── Questions ── */}
      <section className="px-4 md:px-10 py-8 md:py-12 max-w-[800px]">
        <div className="flex flex-col">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-primary/10">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-5 md:py-6 gap-4 text-left group"
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <span className="text-[10px] font-bold tracking-[0.15em] text-muted/40 mt-0.5 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[13px] md:text-[14px] font-bold tracking-[0.04em] group-hover:text-primary transition-colors duration-200">
                    {faq.q}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  strokeWidth={1.6}
                  className={`text-muted shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-[200px] pb-5 md:pb-6' : 'max-h-0'}`}>
                <p className="text-[12px] md:text-[13px] text-muted leading-relaxed tracking-[0.03em] pl-7 md:pl-10 pr-4">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}

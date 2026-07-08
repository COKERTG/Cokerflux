export default function Terms() {
  const sections = [
    {
      num: '01',
      title: 'Use of the Site',
      body: 'You may browse and purchase products for personal, non‑commercial use only. Any unauthorized resale or distribution of our products is prohibited.',
    },
    {
      num: '02',
      title: 'Account Responsibility',
      body: 'When you create an account, you are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.',
    },
    {
      num: '03',
      title: 'Pricing & Payments',
      body: 'All prices are listed in Nigerian Naira (₦) unless otherwise noted. We reserve the right to modify prices at any time, but will honor the price at the time of purchase.',
    },
    {
      num: '04',
      title: 'Shipping & Delivery',
      body: 'Shipping times are estimates only. We are not liable for delays caused by carriers or customs.',
    },
    {
      num: '05',
      title: 'Returns & Refunds',
      body: 'Returns are accepted within 30 days of delivery for unused items. Refunds are issued to the original payment method after inspection.',
    },
    {
      num: '06',
      title: 'Limitation of Liability',
      body: 'To the maximum extent permitted by law, Cokerflux shall not be liable for indirect, incidental, or consequential damages arising from your use of the Site.',
    },
    {
      num: '07',
      title: 'Governing Law',
      body: 'These terms are governed by the laws of the Federal Republic of Nigeria, without regard to its conflict‑of‑law principles.',
    },
  ]

  return (
    <main className="bg-background text-primary min-h-screen">

      {/* ── Banner ── */}
      <section className="px-5 md:px-10 py-10 md:py-16 border-b border-primary/10">
        <p className="text-[10px] font-bold tracking-[0.35em] text-muted uppercase mb-3">
          Legal
        </p>
        <h1 className="font-display text-[48px] sm:text-[70px] md:text-[110px] leading-[0.88] tracking-[0.02em]">
          TERMS OF<br />SERVICE
        </h1>
      </section>

      {/* ── Intro ── */}
      <section className="px-5 md:px-10 py-8 md:py-12 border-b border-primary/10 max-w-[700px]">
        <p className="text-[13px] md:text-[14px] text-muted leading-relaxed tracking-[0.03em]">
          By using the Cokerflux website (the "Site") you agree to the following terms. Please read them carefully.
        </p>
      </section>

      {/* ── Sections ── */}
      <section className="px-4 md:px-10 py-8 md:py-12 max-w-[800px]">
        <div className="flex flex-col">
          {sections.map(s => (
            <div key={s.num} className="border-b border-primary/10 py-6 md:py-8">
              <div className="flex items-start gap-3 md:gap-4 mb-3">
                <span className="text-[10px] font-bold tracking-[0.15em] text-muted/40 mt-0.5 shrink-0">{s.num}</span>
                <h2 className="font-display text-[18px] md:text-[22px] tracking-[0.04em]">{s.title}</h2>
              </div>
              <p className="text-[12px] md:text-[13px] text-muted leading-relaxed tracking-[0.03em] pl-7 md:pl-10">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <p className="text-[12px] md:text-[13px] text-muted leading-relaxed tracking-[0.03em] mt-8 md:mt-10">
          If you have any questions about these terms, please contact us at{' '}
          <a href="mailto:support@cokerflux.com" className="text-primary/70 hover:text-primary underline transition-colors duration-200">
            support@cokerflux.com
          </a>.
        </p>
      </section>

    </main>
  );
}

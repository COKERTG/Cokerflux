export default function SizingGuide() {
  const sizes = [
    { size: 'XS', chest: '34–36', waist: '26–28', hip: '34–36' },
    { size: 'S',  chest: '36–38', waist: '28–30', hip: '36–38' },
    { size: 'M',  chest: '38–40', waist: '30–32', hip: '38–40' },
    { size: 'L',  chest: '40–42', waist: '32–34', hip: '40–42' },
    { size: 'XL', chest: '42–44', waist: '34–36', hip: '42–44' },
  ]

  const tips = [
    { label: 'Chest / Bust', desc: 'Measure around the fullest part.' },
    { label: 'Waist', desc: 'Measure at the natural waistline.' },
    { label: 'Hip', desc: 'Measure around the fullest part of the hips.' },
    { label: 'Inseam', desc: 'Measure from the crotch to the hem.' },
  ]

  return (
    <main className="bg-background text-primary min-h-screen">

      {/* ── Banner ── */}
      <section className="px-5 md:px-10 py-10 md:py-16 border-b border-primary/10">
        <p className="text-[10px] font-bold tracking-[0.35em] text-muted uppercase mb-3">
          Fit Guide
        </p>
        <h1 className="font-display text-[48px] sm:text-[70px] md:text-[110px] leading-[0.88] tracking-[0.02em]">
          SIZING<br />GUIDE
        </h1>
      </section>

      {/* ── Intro ── */}
      <section className="px-5 md:px-10 py-8 md:py-12 border-b border-primary/10 max-w-[700px]">
        <p className="text-[13px] md:text-[14px] text-muted leading-relaxed tracking-[0.03em]">
          Find the perfect fit for every Cokerflux piece. Our clothing follows a standard unisex sizing chart, but you may want to size up or down depending on your preference.
        </p>
      </section>

      {/* ── How to measure ── */}
      <section className="px-4 md:px-10 py-8 md:py-12 border-b border-primary/10">
        <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-6 md:mb-8 px-1">Measurement Basics</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-primary/8 max-w-[700px]">
          {tips.map(tip => (
            <div key={tip.label} className="bg-background p-5 md:p-6">
              <p className="text-[12px] md:text-[13px] font-bold tracking-[0.08em] uppercase mb-1.5">{tip.label}</p>
              <p className="text-[11px] md:text-[12px] text-muted tracking-[0.03em]">{tip.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Size chart ── */}
      <section className="px-4 md:px-10 py-8 md:py-12">
        <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-6 md:mb-8 px-1">Size Chart (Inches)</p>
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <table className="w-full max-w-[600px] min-w-[320px]">
            <thead>
              <tr className="border-b-2 border-primary">
                {['Size', 'Chest', 'Waist', 'Hip'].map(h => (
                  <th key={h} className="py-3 px-3 md:px-4 text-left text-[10px] font-bold tracking-[0.2em] uppercase text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizes.map(row => (
                <tr key={row.size} className="border-b border-primary/10 hover:bg-surface/40 transition-colors duration-150">
                  <td className="py-3 px-3 md:px-4 text-[12px] md:text-[13px] font-bold tracking-[0.08em]">{row.size}</td>
                  <td className="py-3 px-3 md:px-4 text-[12px] md:text-[13px] text-muted tracking-[0.04em]">{row.chest}</td>
                  <td className="py-3 px-3 md:px-4 text-[12px] md:text-[13px] text-muted tracking-[0.04em]">{row.waist}</td>
                  <td className="py-3 px-3 md:px-4 text-[12px] md:text-[13px] text-muted tracking-[0.04em]">{row.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[12px] md:text-[13px] text-muted leading-relaxed tracking-[0.03em] mt-8 md:mt-10 max-w-[500px]">
          If you're between sizes, we generally recommend sizing up for a more relaxed fit. For a tighter, street‑wear look, size down.
        </p>
      </section>

    </main>
  );
}

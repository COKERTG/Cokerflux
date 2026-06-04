import React from 'react';

export default function SizingGuide() {
  return (
    <section className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Sizing Guide</h1>

      <p className="mb-4">
        Find the perfect fit for every Cokerflux piece. Our clothing follows a
        standard unisex sizing chart, but you may want to size up or down
        depending on your preference.
      </p>

      <h2 className="text-2xl font-semibold mb-3">Measurement Basics</h2>
      <ul className="list-disc list-inside mb-4 space-y-2">
        <li><strong>Chest / Bust:</strong> Measure around the fullest part.</li>
        <li><strong>Waist:</strong> Measure at the natural waistline.</li>
        <li><strong>Hip:</strong> Measure around the fullest part of the hips.</li>
        <li><strong>Inseam:</strong> Measure from the crotch to the hem.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-3">Size Chart (US / EU)</h2>
      <table className="w-full max-w-xl border border-primary rounded-md overflow-hidden">
        <thead className="bg-primary text-text-dark">
          <tr>
            <th className="p-2 text-left">Size</th>
            <th className="p-2 text-left">Chest (inches)</th>
            <th className="p-2 text-left">Waist (inches)</th>
            <th className="p-2 text-left">Hip (inches)</th>
          </tr>
        </thead>
        <tbody className="bg-background">
          <tr className="border-t border-primary/25">
            <td className="p-2">XS</td>
            <td className="p-2">34‑36</td>
            <td className="p-2">26‑28</td>
            <td className="p-2">34‑36</td>
          </tr>
          <tr className="border-t border-primary/25">
            <td className="p-2">S</td>
            <td className="p-2">36‑38</td>
            <td className="p-2">28‑30</td>
            <td className="p-2">36‑38</td>
          </tr>
          <tr className="border-t border-primary/25">
            <td className="p-2">M</td>
            <td className="p-2">38‑40</td>
            <td className="p-2">30‑32</td>
            <td className="p-2">38‑40</td>
          </tr>
          <tr className="border-t border-primary/25">
            <td className="p-2">L</td>
            <td className="p-2">40‑42</td>
            <td className="p-2">32‑34</td>
            <td className="p-2">40‑42</td>
          </tr>
          <tr className="border-t border-primary/25">
            <td className="p-2">XL</td>
            <td className="p-2">42‑44</td>
            <td className="p-2">34‑36</td>
            <td className="p-2">42‑44</td>
          </tr>
        </tbody>
      </table>

      <p className="mt-6">
        If you’re between sizes, we generally recommend sizing up for a
        more relaxed fit. For a tighter, street‑wear look, size down.
      </p>
    </section>
  );
}

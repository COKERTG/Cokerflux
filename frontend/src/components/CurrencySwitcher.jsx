import { useCurrency } from '../context/CurrencyContext';

export default function CurrencySwitcher() {
  const { currency, setCurrency, loading } = useCurrency();

  if (loading) return null; // don't render until rate fetched

  const toggle = () => {
    setCurrency(prev => (prev === 'NGN' ? 'GHS' : 'NGN'));
  };

  return (
    <button
      onClick={toggle}
      className="px-3 py-1 border border-primary/30 rounded text-sm font-medium hover:bg-primary hover:text-text-dark transition-colors"
    >
      {currency}
    </button>
  );
}

import { createContext, useContext, useState, useEffect } from 'react'

const FALLBACK_RATE = 0.068 // 1 NGN ≈ 0.068 GHS (static fallback if fetch fails)

const CurrencyContext = createContext(null)

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('NGN')
  const [rate, setRate]         = useState(FALLBACK_RATE)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/NGN')
      .then(r => r.json())
      .then(data => {
        if (data?.rates?.GHS) setRate(data.rates.GHS)
      })
      .catch(() => {/* use fallback rate */})
      .finally(() => setLoading(false))
  }, [])

  function formatPrice(ngnAmount) {
    if (currency === 'GHS') {
      const ghs = ngnAmount * rate
      return `GH₵${ghs.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    return `₦${ngnAmount.toLocaleString('en-NG')}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, loading }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}

import { createContext, useContext, useState, useEffect } from 'react'

const FALLBACK_RATE = 0.068 // 1 NGN ≈ 0.068 GHS (static fallback if fetch fails)

const CurrencyContext = createContext(null)
const RATE_CACHE_KEY = 'cf_currency_rate'
const RATE_CACHE_TTL = 24 * 60 * 60 * 1000

function readCachedRate() {
  try {
    const cached = JSON.parse(localStorage.getItem(RATE_CACHE_KEY))
    if (!cached?.rate || !cached?.savedAt) return null
    if (Date.now() - cached.savedAt > RATE_CACHE_TTL) return null
    return cached.rate
  } catch {
    return null
  }
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('NGN')
  const [rate, setRate]         = useState(() => readCachedRate() || FALLBACK_RATE)
  const [loading, setLoading]   = useState(() => !readCachedRate())

  useEffect(() => {
    const cached = readCachedRate()
    if (cached) return

    async function fetchRate() {
      try {
        const r    = await fetch('https://api.exchangerate-api.com/v4/latest/NGN')
        const data = await r.json()
        if (data?.rates?.GHS) {
          setRate(data.rates.GHS)
          localStorage.setItem(RATE_CACHE_KEY, JSON.stringify({
            rate: data.rates.GHS,
            savedAt: Date.now(),
          }))
        }
      } catch {
        // use fallback rate
      } finally {
        setLoading(false)
      }
    }
    fetchRate()
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

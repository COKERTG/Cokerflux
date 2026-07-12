import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api'

const DEFAULT_CURRENCY = 'NGN' // shown to visitors outside NG/GH

const CurrencyContext = createContext(null)

const CURRENCY_CACHE_KEY = 'cf_currency' // detected-currency cache (avoids re-detecting each load)
const CURRENCY_CACHE_TTL = 7 * 24 * 60 * 60 * 1000

function readCachedCurrency() {
  try {
    const cached = JSON.parse(localStorage.getItem(CURRENCY_CACHE_KEY))
    if (!cached?.currency || !cached?.savedAt) return null
    if (Date.now() - cached.savedAt > CURRENCY_CACHE_TTL) return null
    return cached.currency
  } catch {
    return null
  }
}

export function CurrencyProvider({ children }) {
  // Currency is auto-detected from location — start from cache (or default) and
  // confirm via the backend once if we've never detected it.
  const [currency, setCurrency] = useState(() => readCachedCurrency() || DEFAULT_CURRENCY)

  // ── Auto-detect currency from the visitor's country (once, then cached) ──
  useEffect(() => {
    if (readCachedCurrency()) return // already detected — don't re-fetch

    let cancelled = false
    async function detectCurrency() {
      try {
        const res = await api.detectLocation()
        if (!res.ok) return
        const data = await res.json()
        const detected = data?.currency === 'GHS' ? 'GHS' : 'NGN' // guard: only these two
        if (cancelled) return
        setCurrency(detected)
        localStorage.setItem(CURRENCY_CACHE_KEY, JSON.stringify({
          currency: detected,
          country: data?.country_code || null,
          savedAt: Date.now(),
        }))
      } catch {
        // network/geo failure — keep DEFAULT_CURRENCY (not cached, so we retry next load)
      }
    }
    detectCurrency()
    return () => { cancelled = true }
  }, [])

  // Prices are stored per product in both currencies — pick the field, don't convert.
  // Pass both amounts (single product, or pre-summed cart totals).
  function formatPrice(ngnAmount, ghsAmount = 0) {
    if (currency === 'GHS') {
      const ghs = Number(ghsAmount) || 0
      return `GH₵${ghs.toLocaleString('en-GH')}`
    }
    return `₦${(Number(ngnAmount) || 0).toLocaleString('en-NG')}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}

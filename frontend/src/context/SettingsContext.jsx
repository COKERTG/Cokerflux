import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api'

/**
 * Store-wide settings fetched once from /api/settings/ on app load and shared
 * app-wide (no per-component refetch — e.g. the cart reads these from context
 * rather than hitting the API each time it opens).
 *
 * Currently just the WhatsApp checkout numbers per market.
 */

// Last-resort number if the settings request fails before first paint — keeps the
// WhatsApp checkout working. Mirrors the seeded NG number in the backend migration.
const FALLBACK_WHATSAPP_NG = '+2347045036178'

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({ whatsapp_number_ng: '', whatsapp_number_gh: '' })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function loadSettings() {
      try {
        const res = await api.getSettings()
        if (!res.ok) return
        const data = await res.json()
        if (cancelled) return
        setSettings({
          whatsapp_number_ng: data?.whatsapp_number_ng || '',
          whatsapp_number_gh: data?.whatsapp_number_gh || '',
        })
      } catch {
        // network failure — keep defaults; the fallback below still yields a usable number
      } finally {
        if (!cancelled) setLoaded(true)
      }
    }
    loadSettings()
    return () => { cancelled = true }
  }, [])

  // Pick the market number for the active currency. Falls back to the NG number
  // (then the hardcoded default) so checkout always has something to dial.
  function whatsappNumberFor(currency) {
    const ng = settings.whatsapp_number_ng || FALLBACK_WHATSAPP_NG
    if (currency === 'GHS') return settings.whatsapp_number_gh || ng
    return ng
  }

  return (
    <SettingsContext.Provider value={{ settings, loaded, whatsappNumberFor }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}

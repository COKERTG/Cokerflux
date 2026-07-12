import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { api } from '../../lib/api'
import {
  PageHeader, Panel, Field, TextInput, PrimaryButton, GhostButton, Banner,
} from '../../admin/ui'

const EMPTY = { whatsapp_number_ng: '', whatsapp_number_gh: '' }

export default function AdminSettings() {
  const [form,    setForm]    = useState(EMPTY)
  const [initial, setInitial] = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [errors,  setErrors]  = useState({})
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res  = await api.getSettings()
        const data = await res.json()
        if (cancelled) return
        const next = {
          whatsapp_number_ng: data?.whatsapp_number_ng || '',
          whatsapp_number_gh: data?.whatsapp_number_gh || '',
        }
        setForm(next)
        setInitial(next)
      } catch {
        // leave empty — the form still renders and can be saved
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const dirty = form.whatsapp_number_ng !== initial.whatsapp_number_ng
             || form.whatsapp_number_gh !== initial.whatsapp_number_gh

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
    setSuccess('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors({})
    setSuccess('')
    setSaving(true)
    try {
      const res  = await api.updateSettings(form)
      const data = await res.json()
      if (!res.ok) {
        setErrors({
          whatsapp_number_ng: data?.whatsapp_number_ng?.[0],
          whatsapp_number_gh: data?.whatsapp_number_gh?.[0],
          _global: data?.detail,
        })
        return
      }
      const next = {
        whatsapp_number_ng: data.whatsapp_number_ng || '',
        whatsapp_number_gh: data.whatsapp_number_gh || '',
      }
      setForm(next)
      setInitial(next)
      setSuccess('Settings saved.')
    } catch {
      setErrors({ _global: 'Could not save settings. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  function handleReset() {
    setForm(initial)
    setErrors({})
    setSuccess('')
  }

  if (loading) {
    return (
      <div>
        <PageHeader kicker="Configure" title="STORE SETTINGS" />
        <p className="text-[11px] font-bold tracking-[0.2em] text-muted uppercase">Loading…</p>
      </div>
    )
  }

  return (
    <div className="max-w-[640px]">
      <PageHeader kicker="Configure" title="STORE SETTINGS" />

      <Panel icon={MessageCircle} title="WhatsApp Checkout Numbers">
        <p className="text-[11px] text-muted/70 leading-relaxed tracking-[0.02em] mb-6">
          The storefront builds the WhatsApp checkout link from these numbers, choosing one by the
          visitor’s currency — <span className="text-primary/80 font-bold">NGN → Nigeria</span>,{' '}
          <span className="text-primary/80 font-bold">GHS → Ghana</span>. Use international format
          (e.g. +2347045036178). Leave a market blank to fall back to the Nigeria number.
        </p>

        {success && <div className="mb-6"><Banner tone="success">{success}</Banner></div>}
        {errors._global && <div className="mb-6"><Banner tone="error">{errors._global}</Banner></div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Field label="WhatsApp Number — Nigeria (NGN)" error={errors.whatsapp_number_ng} hint="Used for NGN orders.">
            <TextInput
              type="tel"
              inputMode="tel"
              placeholder="+2347045036178"
              value={form.whatsapp_number_ng}
              onChange={e => update('whatsapp_number_ng', e.target.value)}
            />
          </Field>

          <Field label="WhatsApp Number — Ghana (GHS)" error={errors.whatsapp_number_gh} hint="Used for GHS orders.">
            <TextInput
              type="tel"
              inputMode="tel"
              placeholder="+233201234567"
              value={form.whatsapp_number_gh}
              onChange={e => update('whatsapp_number_gh', e.target.value)}
            />
          </Field>

          <div className="flex gap-3 pt-4 border-t border-primary/8">
            <PrimaryButton type="submit" disabled={saving || !dirty} className="px-8">
              {saving ? 'Saving…' : 'Save Changes'}
            </PrimaryButton>
            <GhostButton type="button" onClick={handleReset} disabled={saving || !dirty}>
              Reset
            </GhostButton>
          </div>
        </form>
      </Panel>
    </div>
  )
}

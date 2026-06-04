import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { api } from '../../lib/api'

export default function ResetPassword() {
  const year = new Date().getFullYear()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [showPw,    setShowPw]    = useState(false)
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)

  if (!token) {
    return (
      <div className="min-h-screen bg-background text-primary flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-4">Invalid Link</p>
          <p className="text-[13px] text-muted mb-6">This reset link is missing or invalid.</p>
          <Link to="/admin/forgot-password" className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary hover:opacity-70 transition-opacity">
            Request a new one
          </Link>
        </div>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res  = await api.resetPassword(token, password)
      const data = await res.json()
      if (!res.ok) {
        const msg = data?.errors?.token?.[0] || data?.errors?.password?.[0] || data?.errors?.non_field_errors?.[0] || 'Something went wrong.'
        setError(msg)
      } else {
        navigate('/admin/login?reset=1')
      }
    } catch (err) {
      console.error('[ResetPassword] request failed:', err)
      setError('Could not reach the server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-primary flex">

      {/* Left — brand panel */}
      <div className="hidden md:flex flex-col justify-between w-[420px] shrink-0 border-r border-primary/10 p-12">
        <img src='/cokerflux.webp' alt="Cokerflux" className="w-10 h-10 object-cover" />
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-4">Account Recovery</p>
          <h2 className="font-display text-[52px] leading-[0.9] tracking-[0.02em]">
            SET A NEW PASSWORD.
          </h2>
        </div>
        <p className="text-[11px] text-muted tracking-[0.04em]">
          ©{year} Cokerflux. Internal use only.
        </p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[380px]">
          <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-8">New Password</p>

          {error && (
            <div className="mb-6 px-4 py-3 border border-red-500/30 bg-red-500/5 text-[12px] text-red-400 tracking-[0.04em]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {[
              { id: 'password', label: 'New Password', value: password, onChange: setPassword },
              { id: 'confirm',  label: 'Confirm Password', value: confirm, onChange: setConfirm },
            ].map(field => (
              <div key={field.id} className="flex flex-col gap-2 relative">
                <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted">
                  {field.label}
                </label>
                <input
                  required
                  type={showPw ? 'text' : 'password'}
                  value={field.value}
                  onChange={e => field.onChange(e.target.value)}
                  minLength={8}
                  className="bg-transparent border-b border-primary/20 pb-3 pr-8 text-[14px] tracking-[0.03em] text-primary placeholder-muted/30 focus:outline-none focus:border-primary/60 transition-colors duration-200"
                  placeholder="Min. 8 characters"
                />
                {field.id === 'password' && (
                  <button type="button" onClick={() => setShowPw(s => !s)}
                    className="absolute right-0 bottom-3 text-muted hover:text-primary transition-colors">
                    {showPw ? <EyeOff size={14} strokeWidth={1.6} /> : <Eye size={14} strokeWidth={1.6} />}
                  </button>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="self-start inline-flex items-center gap-3 bg-primary text-text-dark px-8 py-3.5 text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-primary/85 transition-colors duration-200 disabled:opacity-50 mt-2"
            >
              {loading ? 'Saving...' : <> Set Password <ArrowRight size={12} strokeWidth={2.2} /> </>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

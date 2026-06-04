import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function AcceptInvite() {
  const year = new Date().getFullYear()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { loginWithData } = useAuth()

  const [form,    setForm]    = useState({ username: '', password: '', confirm: '' })
  const [showPw,  setShowPw]  = useState(false)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  if (!token) {
    return (
      <div className="min-h-screen bg-background text-primary flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-4">Invalid Link</p>
          <p className="text-[13px] text-muted mb-6">This invite link is missing or invalid.</p>
          <Link to="/admin/login" className="text-[11px] font-bold tracking-[0.25em] uppercase text-primary hover:opacity-70 transition-opacity">
            Go to Sign In
          </Link>
        </div>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res  = await api.acceptInvite(token, form.username, form.password)
      const data = await res.json()
      if (!res.ok) {
        const errs = data?.errors || {}
        const msg  = errs.token?.[0] || errs.username?.[0] || errs.password?.[0] || errs.non_field_errors?.[0] || 'Something went wrong.'
        setError(msg)
      } else {
        loginWithData(data.tokens, data.user)
        navigate('/admin/dashboard')
      }
    } catch (err) {
      console.error('[AcceptInvite] request failed:', err)
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
          <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-4">You've Been Invited</p>
          <h2 className="font-display text-[52px] leading-[0.9] tracking-[0.02em]">
            SET UP YOUR ACCOUNT.
          </h2>
        </div>
        <p className="text-[11px] text-muted tracking-[0.04em]">
          ©{year} Cokerflux. Internal use only.
        </p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[380px]">
          <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-2">Create Account</p>
          <p className="text-[12px] text-muted tracking-[0.03em] mb-8 leading-relaxed">
            Choose a username and password to activate your account.
          </p>

          {error && (
            <div className="mb-6 px-4 py-3 border border-red-500/30 bg-red-500/5 text-[12px] text-red-400 tracking-[0.04em]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Username */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted">Username</label>
              <input
                required
                type="text"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                className="bg-transparent border-b border-primary/20 pb-3 text-[14px] tracking-[0.03em] text-primary placeholder-muted/30 focus:outline-none focus:border-primary/60 transition-colors duration-200"
                placeholder="Choose a username"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2 relative">
              <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted">Password</label>
              <input
                required
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                minLength={8}
                className="bg-transparent border-b border-primary/20 pb-3 pr-8 text-[14px] tracking-[0.03em] text-primary placeholder-muted/30 focus:outline-none focus:border-primary/60 transition-colors duration-200"
                placeholder="Min. 8 characters"
              />
              <button type="button" onClick={() => setShowPw(s => !s)}
                className="absolute right-0 bottom-3 text-muted hover:text-primary transition-colors">
                {showPw ? <EyeOff size={14} strokeWidth={1.6} /> : <Eye size={14} strokeWidth={1.6} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted">Confirm Password</label>
              <input
                required
                type={showPw ? 'text' : 'password'}
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                minLength={8}
                className="bg-transparent border-b border-primary/20 pb-3 text-[14px] tracking-[0.03em] text-primary placeholder-muted/30 focus:outline-none focus:border-primary/60 transition-colors duration-200"
                placeholder="Repeat your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="self-start inline-flex items-center gap-3 bg-primary text-text-dark px-8 py-3.5 text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-primary/85 transition-colors duration-200 disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating account...' : <> Activate Account <ArrowRight size={12} strokeWidth={2.2} /> </>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate, Navigate, Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
// import logo from '../../assets/logo.webp'


export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const year = new Date().getFullYear()

  const [form,    setForm]    = useState({ username: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)

  const justReset = searchParams.get('reset') === '1'

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.username, form.password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-primary flex">

      {/* Left — brand panel */}
      <div className="hidden md:flex flex-col justify-between w-[420px] shrink-0 border-r border-primary/10 p-12">
         <img src='/logo.webp' alt="Cokerflux" className="h-8 w-auto object-contain self-start" />
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-4">Admin Access</p>
          <h2 className="font-display text-[52px] leading-[0.9] tracking-[0.02em]">
            MANAGE THE BRAND.
          </h2>
        </div>
        <p className="text-[11px] text-muted tracking-[0.04em]">
          ©{year} Cokerflux. Internal use only.
        </p>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[380px]">
          {/* Logo on mobile */}
          <div className="md:hidden mb-8">
            <img src="/cokerflux.webp" alt="Cokerflux" className="w-10 h-10 object-contain" />
          </div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-8">Sign In</p>

          {justReset && (
            <div className="mb-6 px-4 py-3 border border-primary/20 bg-primary/5 text-[12px] text-primary tracking-[0.04em]">
              Password reset successfully. Sign in with your new password.
            </div>
          )}

          {error && (
            <div className="mb-6 px-4 py-3 border border-red-500/30 bg-red-500/5 text-[12px] text-red-400 tracking-[0.04em]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {[
              { name: 'username', label: 'Username', type: 'text' },
              { name: 'password', label: 'Password', type: showPw ? 'text' : 'password' },
            ].map(field => (
              <div key={field.name} className="flex flex-col gap-2 relative">
                <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted">
                  {field.label}
                </label>
                <input
                  required
                  type={field.type}
                  value={form[field.name]}
                  onChange={e => setForm(f => ({ ...f, [field.name]: e.target.value }))}
                  className="bg-transparent border-b border-primary/20 pb-3 pr-8 text-[14px] tracking-[0.03em] text-primary placeholder-muted/30 focus:outline-none focus:border-primary/60 transition-colors duration-200"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
                {field.name === 'password' && (
                  <button type="button" onClick={() => setShowPw(s => !s)}
                    className="absolute right-0 bottom-3 text-muted hover:text-primary transition-colors">
                    {showPw ? <EyeOff size={14} strokeWidth={1.6} /> : <Eye size={14} strokeWidth={1.6} />}
                  </button>
                )}
              </div>
            ))}

            <div className="flex items-center justify-between mt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-3 bg-primary text-text-dark px-8 py-3.5 text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-primary/85 transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : <> Sign In <ArrowRight size={12} strokeWidth={2.2} /> </>}
              </button>

              <Link
                to="/admin/forgot-password"
                className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted hover:text-primary transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { api } from '../../lib/api'

export default function ForgotPassword() {
  const year = new Date().getFullYear()

  const [email,   setEmail]   = useState('')
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res  = await api.forgotPassword(email)
      const data = await res.json()
      if (!res.ok) {
        const msg = data?.errors?.email?.[0] || data?.errors?.non_field_errors?.[0] || 'Something went wrong.'
        setError(msg)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      console.error('[ForgotPassword] request failed:', err)
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
            RESET YOUR PASSWORD.
          </h2>
        </div>
        <p className="text-[11px] text-muted tracking-[0.04em]">
          ©{year} Cokerflux. Internal use only.
        </p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[380px]">
          <p className="text-[10px] font-bold tracking-[0.3em] text-muted uppercase mb-8">Forgot Password</p>

          {success ? (
            <div className="flex flex-col gap-6">
              <div className="px-4 py-4 border border-primary/20 bg-primary/5 text-[12px] text-primary tracking-[0.04em] leading-relaxed">
                If that email is registered, you will receive a reset link shortly. Check your inbox.
              </div>
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase text-muted hover:text-primary transition-colors"
              >
                <ArrowLeft size={11} strokeWidth={2.2} /> Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 px-4 py-3 border border-red-500/30 bg-red-500/5 text-[12px] text-red-400 tracking-[0.04em]">
                  {error}
                </div>
              )}

              <p className="text-[12px] text-muted tracking-[0.03em] mb-8 leading-relaxed">
                Enter the email address on your account and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="bg-transparent border-b border-primary/20 pb-3 text-[14px] tracking-[0.03em] text-primary placeholder-muted/30 focus:outline-none focus:border-primary/60 transition-colors duration-200"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="flex items-center justify-between mt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-3 bg-primary text-text-dark px-8 py-3.5 text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-primary/85 transition-colors duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : <> Send Reset Link <ArrowRight size={12} strokeWidth={2.2} /> </>}
                  </button>

                  <Link
                    to="/admin/login"
                    className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted hover:text-primary transition-colors"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

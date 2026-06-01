import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const { login, resetPassword } = useAuth()
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    if (!email || !password) return toast.error('Please fill all fields')
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.code === 'auth/invalid-credential' ? 'Invalid email or password'
        : err.code === 'auth/too-many-requests' ? 'Too many attempts. Try again later'
        : 'Login failed. Please try again'
      toast.error(msg)
    } finally { setLoading(false) }
  }

  async function handleReset(e) {
    e.preventDefault()
    if (!resetEmail) return toast.error('Enter your email')
    try {
      await resetPassword(resetEmail)
      toast.success('Password reset email sent!')
      setShowReset(false)
    } catch { toast.error('Could not send reset email') }
  }

  return (
    <div className="min-h-screen bg-dark-500 flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold-500/4 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-300 flex items-center justify-center font-black text-dark-500 text-2xl shadow-xl shadow-gold-500/30">K</div>
            <div>
              <div className="font-display font-bold text-gold-300 text-lg">Khanana Welfare Society</div>
              <div className="text-white/30 text-xs tracking-widest uppercase">Member Portal</div>
            </div>
          </Link>
        </div>

        {!showReset ? (
          <div className="card p-8">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent rounded-t-2xl" />
            <h2 className="font-display text-2xl font-bold text-white mb-1">Welcome Back</h2>
            <p className="text-white/40 text-sm mb-8">Sign in to your member account</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" className="input-field" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" className="input-field" required />
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3.5 text-sm font-bold mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Signing In...' : 'Sign In →'}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-sm">
              <button onClick={() => setShowReset(true)} className="text-white/30 hover:text-gold-400 transition-colors text-xs">
                Forgot password?
              </button>
              <Link to="/register" className="text-gold-400 hover:text-gold-300 font-semibold text-xs transition-colors">
                Create Account →
              </Link>
            </div>
          </div>
        ) : (
          <div className="card p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-1">Reset Password</h2>
            <p className="text-white/40 text-sm mb-8">We'll send a reset link to your email</p>
            <form onSubmit={handleReset} className="space-y-4">
              <input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)}
                placeholder="your@email.com" className="input-field" />
              <button type="submit" className="btn-primary w-full py-3.5 text-sm font-bold">Send Reset Email</button>
            </form>
            <button onClick={() => setShowReset(false)} className="mt-4 text-white/30 hover:text-white text-xs w-full text-center transition-colors">
              ← Back to Login
            </button>
          </div>
        )}

        <div className="text-center mt-6">
          <Link to="/" className="text-white/20 text-xs hover:text-white/40 transition-colors">← Back to home</Link>
        </div>
      </div>
    </div>
  )
}

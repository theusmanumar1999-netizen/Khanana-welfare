import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const AREAS = ['Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Main Bazar', 'Near Masjid', 'Other']

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', area: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all required fields')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    setLoading(true)
    try {
      await register(form.email, form.password, form.name, form.phone, form.area)
      toast.success('Account created! Welcome to Khanana Welfare Society')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use' ? 'This email is already registered'
        : err.code === 'auth/weak-password' ? 'Password is too weak'
        : 'Registration failed. Please try again'
      toast.error(msg)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-dark-500 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold-500/4 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-300 flex items-center justify-center font-black text-dark-500 text-2xl shadow-xl shadow-gold-500/30">K</div>
            <div>
              <div className="font-display font-bold text-gold-300 text-lg">Khanana Welfare Society</div>
              <div className="text-white/30 text-xs tracking-widest uppercase">New Member Registration</div>
            </div>
          </Link>
        </div>

        <div className="card p-8 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent rounded-t-2xl" />
          <h2 className="font-display text-2xl font-bold text-white mb-1">Create Your Account</h2>
          <p className="text-white/40 text-sm mb-8">Join the society and track your contributions</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Full Name *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="Muhammad Ali" className="input-field" required />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Email Address *</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="your@email.com" className="input-field" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Phone Number</label>
                <input value={form.phone} onChange={e => set('phone', e.target.value)}
                  placeholder="0300-1234567" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Area / Block</label>
                <select value={form.area} onChange={e => set('area', e.target.value)} className="input-field">
                  <option value="">Select area...</option>
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Password *</label>
                <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
                  placeholder="Min 6 characters" className="input-field" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Confirm Password *</label>
                <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)}
                  placeholder="Re-enter password" className="input-field" required />
              </div>
            </div>

            <div className="glass-gold rounded-xl p-4 text-xs text-gold-400/70 leading-relaxed">
              📋 Minimum monthly contribution is <strong className="text-gold-400">Rs. 500</strong>. After registration, you can submit payments via EasyPaisa, JazzCash, Bank Transfer, PayPal, or Wise.
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 text-sm font-bold mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Creating Account...' : 'Create Account & Join Society →'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-white/30 text-xs">Already have an account? </span>
            <Link to="/login" className="text-gold-400 hover:text-gold-300 text-xs font-semibold transition-colors">Sign In →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

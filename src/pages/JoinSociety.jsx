import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const AREAS = ['Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Main Bazar', 'Near Masjid', 'Other']

export default function JoinSociety() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    fullName: '', fatherName: '', phone: '', area: '', address: '',
    email: '', password: '', confirm: '',
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.fullName || !form.fatherName || !form.phone) return toast.error('Please fill all required fields')
    if (!form.email || !form.password) return toast.error('Email and password required')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    setLoading(true)
    try {
      await register(form.email, form.password, form.fullName, form.phone, form.area, form.fatherName, form.address)
      toast.success('Welcome to Khanana Welfare Society! 🎉')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use' ? 'This email is already registered'
        : err.code === 'auth/weak-password' ? 'Password is too weak'
        : 'Registration failed. Please try again'
      toast.error(msg)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-dark-500 font-body">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gold-500/4 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* NAV */}
      <nav className="relative z-10 border-b border-white/5 bg-dark-500/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-500 to-gold-300 flex items-center justify-center font-black text-dark-500 text-lg shadow-lg shadow-gold-500/30">K</div>
            <div>
              <div className="font-display font-bold text-gold-300 text-sm leading-none">Khanana Welfare Society</div>
              <div className="text-white/30 text-[10px] tracking-widest uppercase">Member Registration</div>
            </div>
          </Link>
          <Link to="/login" className="text-white/30 hover:text-white/60 text-xs transition-colors">Already a member? Sign In →</Link>
        </div>
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 glass-gold px-4 py-2 rounded-full text-xs font-bold text-gold-400 tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
            New Member Registration
          </div>
          <h1 className="font-display text-4xl font-black text-white mb-3">
            Join <span className="gold-text">Khanana Welfare</span>
          </h1>
          <p className="text-white/40 text-sm leading-relaxed">
            Become part of our community. Minimum contribution Rs. 500/month.
          </p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-3 mb-8">
          {[
            { n: 1, label: 'Personal Info' },
            { n: 2, label: 'Account Setup' },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-all ${
                step > s.n ? 'bg-emerald-500 text-white' : step === s.n ? 'bg-gold-500 text-dark-500' : 'bg-white/10 text-white/30'
              }`}>{step > s.n ? '✓' : s.n}</div>
              <span className={`text-xs font-semibold hidden sm:block ${step === s.n ? 'text-gold-400' : 'text-white/25'}`}>{s.label}</span>
              {i < 1 && <div className="flex-1 h-px bg-white/10 ml-2" />}
            </div>
          ))}
        </div>

        <div className="card p-8 relative">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent rounded-t-2xl" />

          {/* STEP 1 — Personal Info */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-white mb-6">Personal Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Full Name *</label>
                    <input value={form.fullName} onChange={e => set('fullName', e.target.value)}
                      placeholder="Muhammad Ali" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Father's Name *</label>
                    <input value={form.fatherName} onChange={e => set('fatherName', e.target.value)}
                      placeholder="Muhammad Akbar" className="input-field" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Phone Number *</label>
                    <input value={form.phone} onChange={e => set('phone', e.target.value)}
                      placeholder="0300-1234567" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Area / Block</label>
                    <select value={form.area} onChange={e => set('area', e.target.value)} className="input-field">
                      <option value="">Select area...</option>
                      {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Home Address</label>
                  <input value={form.address} onChange={e => set('address', e.target.value)}
                    placeholder="House No. / Street / Mohalla" className="input-field" />
                </div>

                <div className="glass-gold rounded-xl p-4 text-xs text-gold-400/70 leading-relaxed">
                  🏡 <strong className="text-gold-400">Khanana Village Members Only.</strong> Minimum monthly contribution is Rs. 500. Your information is kept private and secure.
                </div>

                <button onClick={() => {
                  if (!form.fullName || !form.fatherName || !form.phone) return toast.error('Please fill Name, Father Name and Phone')
                  setStep(2)
                }} className="btn-primary w-full py-3.5 text-sm font-bold">
                  Continue to Account Setup →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Account Setup */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-white mb-2">Create Your Account</h2>
              <p className="text-white/40 text-sm mb-6">You'll use this to login and track your payments</p>

              {/* Summary of step 1 */}
              <div className="glass rounded-xl p-4 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-700 to-gold-700 flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                  {form.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-white/80 text-sm font-bold">{form.fullName}</div>
                  <div className="text-white/30 text-xs">S/O {form.fatherName} · {form.phone} {form.area ? `· ${form.area}` : ''}</div>
                </div>
                <button type="button" onClick={() => setStep(1)} className="ml-auto text-xs text-gold-400 hover:text-gold-300">Edit</button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Email Address *</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="your@email.com" className="input-field" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Password *</label>
                    <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
                      placeholder="Min 6 characters" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Confirm Password *</label>
                    <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)}
                      placeholder="Re-enter" className="input-field" required />
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(1)} className="btn-ghost flex-1 py-3 text-sm font-semibold">← Back</button>
                  <button type="submit" disabled={loading} className="btn-primary flex-1 py-3.5 text-sm font-bold disabled:opacity-50">
                    {loading ? 'Creating Account...' : '✓ Join Society'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-white/20 text-xs hover:text-white/40 transition-colors">← Back to home</Link>
        </div>
      </div>

      <footer className="relative z-10 border-t border-white/5 py-6 px-6 text-center">
        <div className="text-white/15 text-xs">
          Khanana Welfare Society · Est. 2024 · Developed with ❤️ from Copenhagen, Denmark by{' '}
          <Link to="/about" className="text-gold-500/40 hover:text-gold-400 transition-colors">Usman Umar</Link>
        </div>
      </footer>
    </div>
  )
}

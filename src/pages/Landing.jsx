import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../firebase/config'

function AnimatedNumber({ target, prefix = '', suffix = '' }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0
    const end = Number(target)
    if (!end) return
    const duration = 2200
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setVal(end); clearInterval(timer) }
      else setVal(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return <>{prefix}{val.toLocaleString()}{suffix}</>
}

export default function Landing() {
  const [totalFund, setTotalFund] = useState(493500)
  const [memberCount, setMemberCount] = useState(200)
  const [paymentCount, setPaymentCount] = useState(347)

  useEffect(() => {
    const q = query(collection(db, 'payments'), where('status', '==', 'verified'))
    const unsub = onSnapshot(q, (snap) => {
      const total = snap.docs.reduce((s, d) => s + (d.data().amount || 0), 0)
      if (total > 0) setTotalFund(total)
      if (snap.size > 0) setPaymentCount(snap.size)
    })
    return unsub
  }, [])

  const methods = [
    { name: 'EasyPaisa', icon: '📱', color: '#00a651', detail: '0300-1234567', tag: 'Pakistan' },
    { name: 'JazzCash', icon: '📱', color: '#c8102e', detail: '0301-1234567', tag: 'Pakistan' },
    { name: 'Bank Transfer', icon: '🏦', color: '#1a4fa0', detail: 'Meezan Bank', tag: 'Pakistan' },
    { name: 'PayPal', icon: '🌐', color: '#003087', detail: 'welfare@khanana.com', tag: 'International' },
    { name: 'Wise', icon: '🌍', color: '#9fe870', detail: 'welfare@khanana.com', tag: 'International' },
  ]

  const features = [
    { icon: '🔐', title: 'Secure Login', desc: 'Every member has their own private account with full payment history.' },
    { icon: '📧', title: 'Auto Receipts', desc: 'Get an email receipt instantly when your payment is verified by admin.' },
    { icon: '🔔', title: 'Monthly Reminders', desc: 'Automatic email reminder on the 1st of every month. Never miss a contribution.' },
    { icon: '📊', title: 'Live Dashboard', desc: 'Real-time fund tracking. See total collected, monthly stats, and your own history.' },
    { icon: '💳', title: '5 Payment Methods', desc: 'EasyPaisa, JazzCash, Bank Transfer, PayPal & Wise — local and international.' },
    { icon: '🛡️', title: 'Admin Verified', desc: 'Every payment is reviewed and approved by society admin for full transparency.' },
  ]

  return (
    <div className="min-h-screen bg-dark-500 font-body">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-dark-500/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-500 to-gold-300 flex items-center justify-center font-black text-dark-500 text-lg shadow-lg shadow-gold-500/30">K</div>
            <div>
              <div className="font-display font-bold text-gold-300 text-sm leading-none">Khanana Welfare</div>
              <div className="text-white/30 text-[10px] tracking-widest uppercase">Society</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/leadership" className="btn-ghost px-4 py-2 text-sm font-semibold">🏛️ Leadership</Link>
            <Link to="/about" className="btn-ghost px-4 py-2 text-sm font-semibold">👤 Developer</Link>
            <Link to="/login" className="btn-ghost px-5 py-2 text-sm font-semibold">Sign In</Link>
            <Link to="/join" className="btn-primary px-5 py-2 text-sm">Join Society</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy-700/20 rounded-full blur-3xl" />
          <div className="absolute top-20 right-10 w-64 h-64 bg-gold-500/4 rounded-full blur-2xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 glass-gold px-4 py-2 rounded-full text-xs font-bold text-gold-400 tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 pulse-gold" />
            Est. 2024 · Khanana Village · Pakistan
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-black leading-tight mb-6">
            <span className="text-white">Khanana</span><br />
            <span className="gold-text">Welfare Society</span>
          </h1>

          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            A transparent, digital platform for managing our village's collective welfare fund.
            Join 200+ members contributing to a stronger community.
          </p>

          {/* LIVE STATS */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
            {[
              { label: 'Total Fund', value: totalFund, prefix: 'Rs. ' },
              { label: 'Active Members', value: memberCount },
              { label: 'Payments Made', value: paymentCount },
            ].map((s, i) => (
              <div key={i} className="glass rounded-2xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
                <div className="text-2xl md:text-3xl font-black font-display text-gold-300 mb-1">
                  <AnimatedNumber target={s.value} prefix={s.prefix || ''} />
                </div>
                <div className="text-white/30 text-xs font-semibold uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/join" className="btn-primary px-8 py-4 text-base font-bold">
              Join Society — It's Free
            </Link>
            <Link to="/login" className="btn-ghost px-8 py-4 text-base font-semibold">
              Already a Member? Sign In →
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="section-label">Platform Features</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Everything Your Society Needs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} className="card p-6 hover:border-gold-500/20 hover:-translate-y-1 group transition-all duration-200">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-white text-lg mb-2 group-hover:text-gold-300 transition-colors">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAYMENT METHODS */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="section-label">Accepted Methods</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Pay From Anywhere</h2>
            <p className="text-white/40 mt-3 text-sm">Pakistan local payments & international transfers supported</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {methods.map((m, i) => (
              <div key={i} className="card p-5 text-center hover:-translate-y-1 transition-all duration-200"
                style={{ borderColor: m.color + '33' }}>
                <div className="text-3xl mb-3">{m.icon}</div>
                <div className="font-bold text-sm mb-1" style={{ color: m.color }}>{m.name}</div>
                <div className="text-white/30 text-xs mb-2">{m.detail}</div>
                <div className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/25 inline-block">{m.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="section-label">How It Works</div>
          <h2 className="font-display text-3xl font-bold text-white mb-12">Simple 4-Step Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', text: 'Create your member account' },
              { step: '02', text: 'Transfer via EasyPaisa / JazzCash / Bank' },
              { step: '03', text: 'Submit payment record in app' },
              { step: '04', text: 'Admin verifies → Email receipt sent' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl glass-gold flex items-center justify-center font-display font-black text-gold-400 text-lg">{s.step}</div>
                <p className="text-white/50 text-sm text-center leading-relaxed">{s.text}</p>
                {i < 3 && <div className="hidden md:block absolute translate-x-20 text-white/10 text-2xl">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center glass rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent pointer-events-none rounded-3xl" />
          <h2 className="font-display text-3xl font-bold text-white mb-4 relative z-10">Ready to Join?</h2>
          <p className="text-white/40 mb-8 relative z-10">Minimum contribution Rs. 500/month. Be part of building a stronger Khanana Village.</p>
          <Link to="/join" className="btn-primary px-10 py-4 text-base font-bold relative z-10 inline-block">
            Register Now — Free
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <div className="text-white/20 text-sm mb-2">Khanana Welfare Society · Est. 2024 · Serving 200+ Village Families</div>
        <div className="text-white/10 text-xs">
          Developed with ❤️ from <span className="text-gold-500/60">Copenhagen, Denmark</span> by{' '}
          <Link to="/about" className="text-gold-500/60 hover:text-gold-400 transition-colors underline underline-offset-2">Usman Umar</Link>
        </div>
      </footer>
    </div>
  )
}

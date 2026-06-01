import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, where, onSnapshot, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import { format } from 'date-fns'

function AnimatedNumber({ target, prefix = '', duration = 1800 }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0; const end = Number(target) || 0
    if (!end) { setVal(0); return }
    const step = end / (duration / 16)
    const t = setInterval(() => {
      start += step
      if (start >= end) { setVal(end); clearInterval(t) } else setVal(Math.floor(start))
    }, 16)
    return () => clearInterval(t)
  }, [target])
  return <>{prefix}{val.toLocaleString()}</>
}

const METHOD_COLORS = { EasyPaisa: '#00a651', JazzCash: '#c8102e', 'Bank Transfer': '#1a4fa0', PayPal: '#003087', Wise: '#9fe870' }

export default function Dashboard() {
  const { currentUser, userProfile, isAdmin } = useAuth()
  const [myPayments, setMyPayments] = useState([])
  const [totalFund, setTotalFund] = useState(0)
  const [monthlyTarget] = useState(100000)
  const [thisMonthTotal, setThisMonthTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const myTotalPaid = myPayments.filter(p => p.status === 'verified').reduce((s, p) => s + p.amount, 0)
  const thisMonth = format(new Date(), 'yyyy-MM')
  const paidThisMonth = myPayments.filter(p => p.status === 'verified' && p.date?.startsWith(thisMonth)).reduce((s, p) => s + p.amount, 0)
  const pendingCount = myPayments.filter(p => p.status === 'pending').length

  useEffect(() => {
    if (!currentUser) return
    const q = query(collection(db, 'payments'), where('uid', '==', currentUser.uid), orderBy('createdAt', 'desc'), limit(20))
    const unsub = onSnapshot(q, snap => {
      setMyPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [currentUser])

  useEffect(() => {
    const q = query(collection(db, 'payments'), where('status', '==', 'verified'))
    const unsub = onSnapshot(q, snap => {
      const total = snap.docs.reduce((s, d) => s + (d.data().amount || 0), 0)
      setTotalFund(total)
      const mo = snap.docs.filter(d => d.data().date?.startsWith(thisMonth)).reduce((s, d) => s + d.data().amount, 0)
      setThisMonthTotal(mo)
    })
    return unsub
  }, [])

  const progress = Math.min((thisMonthTotal / monthlyTarget) * 100, 100)

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="page-title">
            Welcome, {userProfile?.displayName?.split(' ')[0] || 'Member'} 👋
          </h1>
          <p className="page-sub">Here's your contribution overview for {format(new Date(), 'MMMM yyyy')}</p>
        </div>

        {/* Admin banner */}
        {isAdmin && (
          <div className="glass-gold rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛡️</span>
              <div>
                <div className="text-gold-300 font-bold text-sm">Admin Mode Active</div>
                <div className="text-white/40 text-xs">You have full access to manage society data</div>
              </div>
            </div>
            <Link to="/admin/payments" className="btn-primary px-4 py-2 text-xs font-bold">Admin Panel →</Link>
          </div>
        )}

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'My Total Paid', value: myTotalPaid, prefix: 'Rs. ', color: 'text-gold-400', border: 'border-gold-500/15' },
            { label: 'Paid This Month', value: paidThisMonth, prefix: 'Rs. ', color: 'text-emerald-400', border: 'border-emerald-500/15' },
            { label: 'Society Total', value: totalFund, prefix: 'Rs. ', color: 'text-blue-400', border: 'border-blue-500/15' },
            { label: 'Pending', value: pendingCount, prefix: '', suffix: ' payment' + (pendingCount !== 1 ? 's' : ''), color: 'text-amber-400', border: 'border-amber-500/15' },
          ].map((s, i) => (
            <div key={i} className={`stat-card border ${s.border} relative overflow-hidden`}>
              <div className="section-label">{s.label}</div>
              <div className={`font-display text-2xl font-black ${s.color}`}>
                <AnimatedNumber target={s.value} prefix={s.prefix} />
                {s.suffix || ''}
              </div>
            </div>
          ))}
        </div>

        {/* MONTHLY PROGRESS */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="section-label">Monthly Fund Progress</div>
              <div className="text-white font-bold">{format(new Date(), 'MMMM yyyy')} Collection</div>
            </div>
            <div className="text-right">
              <div className="text-gold-400 font-black text-lg font-display">Rs. {thisMonthTotal.toLocaleString()}</div>
              <div className="text-white/30 text-xs">of Rs. {monthlyTarget.toLocaleString()} target</div>
            </div>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-gold-600 to-gold-300 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between mt-2 text-xs text-white/25">
            <span>0</span>
            <span>{Math.round(progress)}% achieved</span>
            <span>Rs. {monthlyTarget.toLocaleString()}</span>
          </div>
        </div>

        {/* CTA + RECENT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pay Now CTA */}
          <div className="card p-6 relative overflow-hidden flex flex-col justify-between border-gold-500/15">
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/8 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="text-3xl mb-4">💳</div>
              <h3 className="font-display font-bold text-white text-lg mb-2">Make a Payment</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">Submit your monthly contribution via EasyPaisa, JazzCash, Bank Transfer, or international methods.</p>
            </div>
            <Link to="/pay" className="btn-primary w-full py-3 text-sm font-bold text-center relative z-10">
              Pay Now →
            </Link>
          </div>

          {/* Recent payments */}
          <div className="card p-6 md:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div className="font-bold text-white">Recent Payments</div>
              <Link to="/history" className="text-gold-400 text-xs hover:text-gold-300 font-semibold transition-colors">View All →</Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-12 bg-white/3 rounded-xl animate-shimmer" />)}
              </div>
            ) : myPayments.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📭</div>
                <div className="text-white/30 text-sm">No payments yet</div>
                <Link to="/pay" className="text-gold-400 text-xs mt-2 inline-block hover:text-gold-300">Make your first payment →</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {myPayments.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: METHOD_COLORS[p.method] + '22', color: METHOD_COLORS[p.method] || '#888' }}>
                        {p.method === 'EasyPaisa' || p.method === 'JazzCash' ? '📱' : p.method === 'Bank Transfer' ? '🏦' : '🌐'}
                      </div>
                      <div>
                        <div className="text-white/80 text-sm font-medium">{p.method}</div>
                        <div className="text-white/30 text-xs">{p.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-gold-400">Rs. {p.amount?.toLocaleString()}</div>
                      <div className={`text-xs ${p.status === 'verified' ? 'text-emerald-400' : p.status === 'pending' ? 'text-amber-400' : 'text-red-400'}`}>
                        {p.status === 'verified' ? '✓ Verified' : p.status === 'pending' ? '⏳ Pending' : '✗ Rejected'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PAYMENT METHODS INFO */}
        <div className="card p-6 mt-6">
          <div className="section-label">Accepted Payment Methods</div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { name: 'EasyPaisa', number: '0345-6248118 · Shoukat Ali', icon: '📱', color: '#00a651' },
              { name: 'JazzCash', number: '0345-6248118 · Shoukat Ali', icon: '📱', color: '#c8102e' },
              { name: 'MCB Bank', number: 'PK95 MUCB 0970 1921 1100 2540', icon: '🏦', color: '#1a4fa0' },
              { name: 'PayPal', number: 'welfare@khanana.com', icon: '🌐', color: '#003087' },
              { name: 'Wise', number: 'welfare@khanana.com', icon: '🌍', color: '#9fe870' },
            ].map((m, i) => (
              <div key={i} className="rounded-xl p-3 text-center" style={{ background: m.color + '11', border: `1px solid ${m.color}33` }}>
                <div className="text-xl mb-1">{m.icon}</div>
                <div className="text-xs font-bold mb-0.5" style={{ color: m.color }}>{m.name}</div>
                <div className="text-white/25 text-[10px]">{m.number}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

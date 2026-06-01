import { useEffect, useState } from 'react'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import { Link } from 'react-router-dom'

const METHOD_COLORS = { EasyPaisa: '#00a651', JazzCash: '#c8102e', 'Bank Transfer': '#1a4fa0', PayPal: '#003087', Wise: '#9fe870' }

export default function PaymentHistory() {
  const { currentUser } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!currentUser) return
    const q = query(collection(db, 'payments'), where('uid', '==', currentUser.uid), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => {
      setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [currentUser])

  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter)
  const totalVerified = payments.filter(p => p.status === 'verified').reduce((s, p) => s + p.amount, 0)
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0)

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="page-title">My Payment History</h1>
            <p className="page-sub">{payments.length} total transactions</p>
          </div>
          <Link to="/pay" className="btn-primary px-5 py-2.5 text-sm font-bold">+ Pay Now</Link>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="stat-card border-emerald-500/15">
            <div className="section-label">Total Verified</div>
            <div className="font-display text-2xl font-black text-emerald-400">Rs. {totalVerified.toLocaleString()}</div>
          </div>
          <div className="stat-card border-amber-500/15">
            <div className="section-label">Pending</div>
            <div className="font-display text-2xl font-black text-amber-400">Rs. {totalPending.toLocaleString()}</div>
          </div>
          <div className="stat-card border-gold-500/15">
            <div className="section-label">Transactions</div>
            <div className="font-display text-2xl font-black text-gold-400">{payments.length}</div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'verified', 'pending', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                filter === f ? 'bg-gold-500/15 border border-gold-500/30 text-gold-400' : 'bg-white/3 border border-white/8 text-white/30 hover:text-white/50'
              }`}>{f}</button>
          ))}
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-3">
              {[1,2,3,4].map(i => <div key={i} className="h-14 bg-white/3 rounded-xl animate-shimmer" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <div className="text-5xl mb-4">📭</div>
              <div className="text-white/30 text-base mb-2">No payments found</div>
              <Link to="/pay" className="text-gold-400 text-sm hover:text-gold-300">Make your first contribution →</Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/7">
                  <th className="text-left px-5 py-4 text-[10px] font-bold text-white/25 uppercase tracking-widest">Date</th>
                  <th className="text-left px-5 py-4 text-[10px] font-bold text-white/25 uppercase tracking-widest">Method</th>
                  <th className="text-left px-5 py-4 text-[10px] font-bold text-white/25 uppercase tracking-widest">Amount</th>
                  <th className="text-left px-5 py-4 text-[10px] font-bold text-white/25 uppercase tracking-widest hidden md:table-cell">Note</th>
                  <th className="text-left px-5 py-4 text-[10px] font-bold text-white/25 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="table-row">
                    <td className="px-5 py-4 text-white/60 text-sm">{p.date}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{ background: (METHOD_COLORS[p.method] || '#888') + '22', color: METHOD_COLORS[p.method] || '#888' }}>
                        {p.method}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-black text-gold-400 font-display">Rs. {p.amount?.toLocaleString()}</td>
                    <td className="px-5 py-4 text-white/30 text-sm hidden md:table-cell">{p.note || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        p.status === 'verified' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' :
                        p.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' :
                        'bg-red-500/15 text-red-400 border border-red-500/25'
                      }`}>
                        {p.status === 'verified' ? '✓ Verified' : p.status === 'pending' ? '⏳ Pending' : '✗ Rejected'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  )
}

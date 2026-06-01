import { useEffect, useState } from 'react'
import { collection, query, onSnapshot, orderBy, doc, updateDoc, serverTimestamp, getDocs, where } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import { sendReceiptEmail } from '../utils/email'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const METHOD_COLORS = { EasyPaisa: '#00a651', JazzCash: '#c8102e', 'Bank Transfer': '#1a4fa0', PayPal: '#003087', Wise: '#9fe870' }

export default function AdminPayments() {
  const { isAdmin } = useAuth()
  const [payments, setPayments] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [processing, setProcessing] = useState(null)
  const [activeTab, setActiveTab] = useState('payments')

  useEffect(() => {
    if (!isAdmin) return
    const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => {
      setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [isAdmin])

  useEffect(() => {
    if (!isAdmin) return
    const unsub = onSnapshot(collection(db, 'users'), snap => {
      setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(u => u.role !== 'admin'))
    })
    return unsub
  }, [isAdmin])

  async function verifyPayment(payment) {
    setProcessing(payment.id)
    try {
      await updateDoc(doc(db, 'payments', payment.id), { status: 'verified', verifiedAt: serverTimestamp() })
      // Send receipt email
      const result = await sendReceiptEmail({
        toEmail: payment.email,
        toName: payment.memberName,
        amount: payment.amount,
        method: payment.method,
        date: payment.date,
        transactionId: payment.id.slice(-8).toUpperCase(),
        totalPaid: payment.amount,
      })
      if (result.success) toast.success(`✓ Verified! Receipt sent to ${payment.email}`)
      else toast.success('✓ Payment verified (email service not configured)')
    } catch (err) {
      console.error(err)
      toast.error('Error verifying payment')
    } finally { setProcessing(null) }
  }

  async function rejectPayment(id) {
    if (!confirm('Reject this payment?')) return
    try {
      await updateDoc(doc(db, 'payments', id), { status: 'rejected' })
      toast.success('Payment rejected')
    } catch { toast.error('Error') }
  }

  const filtered = payments.filter(p => {
    const matchSearch = p.memberName?.toLowerCase().includes(search.toLowerCase()) || p.email?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || p.status === filter
    return matchSearch && matchFilter
  })

  const totalFund = payments.filter(p => p.status === 'verified').reduce((s, p) => s + (p.amount || 0), 0)
  const pendingTotal = payments.filter(p => p.status === 'pending').reduce((s, p) => s + (p.amount || 0), 0)
  const thisMonth = format(new Date(), 'yyyy-MM')
  const thisMonthTotal = payments.filter(p => p.status === 'verified' && p.date?.startsWith(thisMonth)).reduce((s, p) => s + p.amount, 0)

  if (!isAdmin) return (
    <Layout><div className="p-8 text-center text-red-400">Access denied. Admin only.</div></Layout>
  )

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="page-title">Admin Panel</h1>
          <p className="page-sub">Manage all payments, members, and society data</p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Fund', value: `Rs. ${totalFund.toLocaleString()}`, color: 'text-gold-400', border: 'border-gold-500/15', icon: '💰' },
            { label: 'This Month', value: `Rs. ${thisMonthTotal.toLocaleString()}`, color: 'text-emerald-400', border: 'border-emerald-500/15', icon: '📅' },
            { label: 'Pending Approval', value: `Rs. ${pendingTotal.toLocaleString()}`, color: 'text-amber-400', border: 'border-amber-500/15', icon: '⏳' },
            { label: 'Total Members', value: members.length, color: 'text-blue-400', border: 'border-blue-500/15', icon: '👥' },
          ].map((s, i) => (
            <div key={i} className={`stat-card border ${s.border}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{s.icon}</span>
                <div className="section-label mb-0">{s.label}</div>
              </div>
              <div className={`font-display text-xl font-black ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'payments', label: 'Payments', count: payments.filter(p => p.status === 'pending').length },
            { id: 'members', label: 'Members', count: null },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === t.id ? 'bg-gold-500/15 border border-gold-500/30 text-gold-400' : 'bg-white/3 border border-white/8 text-white/40 hover:text-white/60'
              }`}>
              {t.label}
              {t.count > 0 && <span className="w-5 h-5 rounded-full bg-amber-500 text-dark-500 text-[10px] font-black flex items-center justify-center">{t.count}</span>}
            </button>
          ))}
        </div>

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-5">
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="🔍  Search by name or email..."
                className="input-field max-w-xs flex-1" />
              <div className="flex gap-2">
                {['all', 'pending', 'verified', 'rejected'].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                      filter === f ? 'bg-gold-500/15 border border-gold-500/30 text-gold-400' : 'bg-white/3 border border-white/8 text-white/30 hover:text-white/50'
                    }`}>
                    {f} {f !== 'all' && <span className="opacity-60">({payments.filter(p => p.status === f).length})</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="card overflow-hidden">
              {loading ? (
                <div className="p-8 space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-white/3 rounded-xl animate-shimmer" />)}</div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center text-white/30">No payments found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b border-white/7">
                        {['Member', 'Amount', 'Method', 'Date', 'Status', 'Actions'].map(h => (
                          <th key={h} className="text-left px-5 py-4 text-[10px] font-bold text-white/25 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(p => (
                        <tr key={p.id} className="table-row">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-navy-700 to-gold-700 flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                                {(p.memberName || 'M').split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>
                              <div>
                                <div className="text-white/80 text-sm font-semibold">{p.memberName}</div>
                                <div className="text-white/30 text-xs">{p.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 font-black text-gold-400 font-display">Rs. {p.amount?.toLocaleString()}</td>
                          <td className="px-5 py-4">
                            <span className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{ background: (METHOD_COLORS[p.method] || '#888') + '22', color: METHOD_COLORS[p.method] || '#888' }}>
                              {p.method}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-white/40 text-sm">{p.date}</td>
                          <td className="px-5 py-4">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                              p.status === 'verified' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' :
                              p.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' :
                              'bg-red-500/15 text-red-400 border border-red-500/25'
                            }`}>
                              {p.status === 'verified' ? '✓ Verified' : p.status === 'pending' ? '⏳ Pending' : '✗ Rejected'}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            {p.status === 'pending' && (
                              <div className="flex gap-2">
                                <button onClick={() => verifyPayment(p)} disabled={processing === p.id}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-bold hover:bg-emerald-500/25 transition-colors disabled:opacity-50">
                                  {processing === p.id ? '...' : '✓ Verify'}
                                </button>
                                <button onClick={() => rejectPayment(p.id)}
                                  className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors">
                                  ✗
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MEMBERS TAB */}
        {activeTab === 'members' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/7">
                    {['Member', 'Area', 'Phone', 'Joined', 'Total Paid', 'Status'].map(h => (
                      <th key={h} className="text-left px-5 py-4 text-[10px] font-bold text-white/25 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {members.map(m => {
                    const memberPayments = payments.filter(p => p.uid === m.uid && p.status === 'verified')
                    const totalPaid = memberPayments.reduce((s, p) => s + p.amount, 0)
                    const paidThisMonth = memberPayments.some(p => p.date?.startsWith(thisMonth))
                    return (
                      <tr key={m.id} className="table-row">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-navy-700 to-gold-700 flex items-center justify-center text-xs font-black text-white">
                              {(m.displayName || 'M').split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <div className="text-white/80 text-sm font-semibold">{m.displayName}</div>
                              <div className="text-white/30 text-xs">{m.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-white/50 text-sm">{m.area || '—'}</td>
                        <td className="px-5 py-4 text-white/50 text-sm">{m.phone || '—'}</td>
                        <td className="px-5 py-4 text-white/30 text-xs">{m.joinedAt?.toDate ? format(m.joinedAt.toDate(), 'MMM yyyy') : '—'}</td>
                        <td className="px-5 py-4 font-bold text-gold-400 font-display">Rs. {totalPaid.toLocaleString()}</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            paidThisMonth ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                          }`}>
                            {paidThisMonth ? '✓ Paid this month' : '⏳ Unpaid'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

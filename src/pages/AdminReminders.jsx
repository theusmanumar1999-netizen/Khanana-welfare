import { useState, useEffect } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import { sendReminderEmail } from '../utils/email'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function AdminReminders() {
  const { isAdmin } = useAuth()
  const [members, setMembers] = useState([])
  const [sending, setSending] = useState(false)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const [customMsg, setCustomMsg] = useState('')

  useEffect(() => {
    if (!isAdmin) return
    getDocs(collection(db, 'users')).then(snap => {
      setMembers(snap.docs.map(d => d.data()).filter(u => u.role !== 'admin' && u.email))
    })
  }, [isAdmin])

  async function sendAllReminders() {
    if (!confirm(`Send monthly reminder to all ${members.length} members?`)) return
    setSending(true); setProgress(0); setDone(false)
    const month = format(new Date(), 'MMMM')
    const year = format(new Date(), 'yyyy')
    let sent = 0
    for (const m of members) {
      try {
        await sendReminderEmail({ toEmail: m.email, toName: m.displayName, month, year, amount: 500, dueDate: `10 ${month} ${year}` })
        sent++
        setProgress(Math.round((sent / members.length) * 100))
        await new Promise(r => setTimeout(r, 300))
      } catch (err) { console.error('Failed for', m.email) }
    }
    setSending(false); setDone(true)
    toast.success(`Reminders sent to ${sent} members!`)
  }

  if (!isAdmin) return <Layout><div className="p-8 text-red-400">Access denied.</div></Layout>

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="page-title">Monthly Reminders</h1>
          <p className="page-sub">Send contribution reminders to all society members</p>
        </div>

        {/* Send bulk */}
        <div className="card p-8 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl glass-gold flex items-center justify-center text-2xl">🔔</div>
              <div>
                <h2 className="font-display font-bold text-white text-xl">Send Monthly Reminder</h2>
                <p className="text-white/40 text-sm">{format(new Date(), 'MMMM yyyy')} — {members.length} members will be notified</p>
              </div>
            </div>

            <div className="glass rounded-xl p-5 mb-6">
              <div className="section-label">Email Preview</div>
              <div className="text-white/60 text-sm leading-relaxed">
                <strong className="text-white">Subject:</strong> 🔔 Monthly Contribution Reminder — {format(new Date(), 'MMMM yyyy')}<br /><br />
                <strong className="text-white">Body:</strong> Dear [Member Name], your monthly contribution of <strong className="text-gold-400">Rs. 500</strong> for {format(new Date(), 'MMMM yyyy')} is due. Please make your payment before 10 {format(new Date(), 'MMMM')}. Click the button to submit your payment record.
              </div>
            </div>

            {sending && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-white/60 mb-2">
                  <span>Sending reminders...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gold-600 to-gold-300 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {done && (
              <div className="glass-gold rounded-xl p-4 mb-6 text-gold-400 text-sm font-semibold flex items-center gap-2">
                ✅ All reminders sent successfully for {format(new Date(), 'MMMM yyyy')}
              </div>
            )}

            <button onClick={sendAllReminders} disabled={sending}
              className="btn-primary w-full py-4 text-sm font-bold disabled:opacity-50">
              {sending ? `Sending... ${progress}%` : `📧 Send to All ${members.length} Members`}
            </button>
          </div>
        </div>

        {/* Member list */}
        <div className="card p-6">
          <div className="section-label mb-4">Member List ({members.length})</div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {members.map((m, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-white/2 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-navy-700 to-gold-700 flex items-center justify-center text-xs font-black text-white">
                    {(m.displayName || 'M').split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-white/70 text-sm font-medium">{m.displayName}</div>
                    <div className="text-white/25 text-xs">{m.email}</div>
                  </div>
                </div>
                <div className="text-white/25 text-xs">{m.area || '—'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

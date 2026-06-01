import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { downloadReceipt } from '../utils/receipt'

const PAYMENT_METHODS = [
  { id: 'EasyPaisa', label: 'EasyPaisa', icon: '📱', color: '#00a651', detail: '0345-6248118 · Shoukat Ali', tag: 'Pakistan', instruction: 'Account Name: Shoukat Ali\nEasyPaisa Number: 0345-6248118\n\nSteps:\n1. Open EasyPaisa app\n2. Go to "Send Money"\n3. Enter number: 0345-6248118\n4. Enter amount (min Rs. 500)\n5. Add reference: "KWS + Your Name"\n6. Confirm payment & take screenshot' },
  { id: 'JazzCash', label: 'JazzCash', icon: '📱', color: '#c8102e', detail: '0345-6248118 · Shoukat Ali', tag: 'Pakistan', instruction: 'Account Name: Shoukat Ali\nJazzCash Number: 0345-6248118\n\nSteps:\n1. Open JazzCash app\n2. Go to "Money Transfer"\n3. Enter number: 0345-6248118\n4. Enter amount (min Rs. 500)\n5. Add reference: "KWS + Your Name"\n6. Confirm payment & take screenshot' },
  { id: 'Bank Transfer', label: 'MCB Bank Transfer', icon: '🏦', color: '#1a4fa0', detail: 'MCB Bank · Shoukat Ali', tag: 'Pakistan', instruction: 'Account Title: Shoukat Ali\nBank: MCB Bank\nIBAN: PK95 MUCB 0970 1921 1100 2540\n\nSteps:\n1. Open your banking app\n2. Go to "Fund Transfer" or "IBFT"\n3. Enter IBAN: PK95MUCB0970192111002540\n4. Account Title: Shoukat Ali\n5. Enter amount (min Rs. 500)\n6. Add reference: "KWS + Your Name"\n7. Confirm & take screenshot' },
  { id: 'PayPal', label: 'PayPal', icon: '🌐', color: '#003087', detail: 'welfare@khanana.com', tag: 'International', instruction: 'PayPal Email: welfare@khanana.com\n\nSteps:\n1. Open PayPal\n2. Click "Send"\n3. Enter: welfare@khanana.com\n4. Enter amount\n5. Add note: "KWS + Your Name + Month"\n6. Confirm & take screenshot' },
  { id: 'Wise', label: 'Wise', icon: '🌍', color: '#9fe870', detail: 'welfare@khanana.com', tag: 'International', instruction: 'Wise Email: welfare@khanana.com\n\nSteps:\n1. Open Wise\n2. Click "Send Money"\n3. Enter: welfare@khanana.com\n4. Enter amount\n5. Add reference: "KWS + Your Name + Month"\n6. Confirm & take screenshot' },
]

export default function PayNow() {
  const { currentUser, userProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [amount, setAmount] = useState('500')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)

  async function handleSubmit() {
    if (!selectedMethod || !amount || parseInt(amount) < 500) {
      return toast.error('Minimum amount is Rs. 500')
    }
    setLoading(true)
    try {
      const docRef = await addDoc(collection(db, 'payments'), {
        uid: currentUser.uid,
        memberName: userProfile?.displayName || currentUser.displayName,
        fatherName: userProfile?.fatherName || '',
        email: currentUser.email,
        phone: userProfile?.phone || '',
        area: userProfile?.area || '',
        amount: parseInt(amount),
        method: selectedMethod.id,
        date: format(new Date(), 'yyyy-MM-dd'),
        note: note.trim(),
        status: 'pending',
        createdAt: serverTimestamp(),
      })
      const receiptData = {
        memberName: userProfile?.displayName || currentUser.displayName,
        fatherName: userProfile?.fatherName || '',
        amount: parseInt(amount),
        method: selectedMethod.id,
        date: format(new Date(), 'dd MMM yyyy'),
        transactionId: docRef.id.slice(-8).toUpperCase(),
        area: userProfile?.area || '',
      }
      setSubmittedData(receiptData)
      setSubmitted(true)
      toast.success('Payment submitted! Admin will verify within 24 hours.')
    } catch (err) {
      console.error(err)
      toast.error('Failed to submit. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="page-title">Make a Payment</h1>
          <p className="page-sub">Monthly minimum contribution: Rs. 500</p>
        </div>

        {/* SUCCESS SCREEN */}
        {submitted && submittedData && (
          <div className="animate-fade-in">
            <div className="card p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center text-4xl mx-auto mb-6">✅</div>
                <h2 className="font-display text-2xl font-black text-white mb-2">Payment Submitted!</h2>
                <p className="text-white/40 text-sm mb-8">Admin will verify within 24 hours. You'll receive an email receipt once verified.</p>

                {/* Receipt preview */}
                <div className="glass rounded-2xl p-6 mb-8 text-left">
                  <div className="section-label mb-4">Payment Summary</div>
                  <div className="space-y-3">
                    {[
                      ['Member', submittedData.memberName],
                      ['Amount', `Rs. ${Number(submittedData.amount).toLocaleString()}`],
                      ['Method', submittedData.method],
                      ['Date', submittedData.date],
                      ['Transaction ID', '#' + submittedData.transactionId],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                        <span className="text-white/40 text-sm">{k}</span>
                        <span className={`text-sm font-bold ${k === 'Amount' ? 'text-gold-400 text-lg font-display' : 'text-white/80'}`}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Download receipt button */}
                <button onClick={() => downloadReceipt(submittedData)}
                  className="btn-primary w-full py-4 text-sm font-bold mb-4 flex items-center justify-center gap-2">
                  <span>📥</span> Download Receipt (PNG)
                </button>
                <button onClick={() => navigate('/history')}
                  className="btn-ghost w-full py-3 text-sm font-semibold">
                  View Payment History →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Steps + form — hide after submission */}
        {!submitted && (
          <div>
          <div className="flex items-center gap-3 mb-8">
          {[
            { n: 1, label: 'Choose Method' },
            { n: 2, label: 'Transfer Funds' },
            { n: 3, label: 'Submit Record' },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-all ${
                step > s.n ? 'bg-emerald-500 text-white' : step === s.n ? 'bg-gold-500 text-dark-500' : 'bg-white/10 text-white/30'
              }`}>{step > s.n ? '✓' : s.n}</div>
              <span className={`text-xs font-medium hidden sm:block ${step === s.n ? 'text-gold-400' : 'text-white/25'}`}>{s.label}</span>
              {i < 2 && <div className="flex-1 h-px bg-white/10 ml-2" />}
            </div>
          ))}
          </div>

        {/* STEP 1: Choose method */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="section-label">Select Payment Method</div>
            <div className="space-y-3">
              {PAYMENT_METHODS.map(m => (
                <button key={m.id} onClick={() => setSelectedMethod(m)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                    selectedMethod?.id === m.id
                      ? 'border-gold-500/50 bg-gold-500/8'
                      : 'border-white/7 bg-white/2 hover:border-white/15 hover:bg-white/4'
                  }`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: m.color + '18', border: `1px solid ${m.color}33` }}>{m.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{m.label}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/30">{m.tag}</span>
                      </div>
                      <div className="text-white/40 text-sm mt-0.5">{m.detail}</div>
                    </div>
                    {selectedMethod?.id === m.id && <span className="text-gold-400 text-lg flex-shrink-0">✓</span>}
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => { if (!selectedMethod) return toast.error('Please select a payment method'); setStep(2) }}
              className="btn-primary w-full py-3.5 text-sm font-bold mt-6">
              Continue to Transfer Instructions →
            </button>
          </div>
        )}

        {/* STEP 2: Transfer instructions */}
        {step === 2 && selectedMethod && (
          <div className="animate-fade-in">
            <div className="section-label">Transfer Instructions</div>
            <div className="card p-6 mb-6" style={{ borderColor: selectedMethod.color + '44' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: selectedMethod.color + '18' }}>
                  {selectedMethod.icon}
                </div>
                <div>
                  <div className="font-bold text-white text-lg">{selectedMethod.label}</div>
                  <div className="text-white/40 text-sm">{selectedMethod.tag} Payment</div>
                </div>
              </div>
              <div className="bg-dark-300 rounded-xl p-4 mb-4">
                <div className="section-label mb-2">Account Details</div>
                <pre className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap font-body">{selectedMethod.instruction}</pre>
              </div>
              <div className="glass-gold rounded-xl p-4 text-sm text-gold-400/70 leading-relaxed">
                ⚠️ <strong className="text-gold-400">Important:</strong> After transferring, come back and click "I've Transferred" to submit your payment record for admin verification.
              </div>
            </div>

            {/* Amount */}
            <div className="card p-6 mb-6">
              <label className="section-label">Amount to Transfer</label>
              <div className="flex gap-3 mb-4">
                {['500', '1000', '1500', '2000'].map(a => (
                  <button key={a} onClick={() => setAmount(a)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      amount === a ? 'bg-gold-500/20 border border-gold-500/40 text-gold-400' : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/8'
                    }`}>Rs. {a}</button>
                ))}
              </div>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                min="500" placeholder="Or enter custom amount..."
                className="input-field" />
              <div className="text-white/25 text-xs mt-2">Minimum Rs. 500 per contribution</div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-ghost flex-1 py-3 text-sm font-semibold">← Back</button>
              <button onClick={() => setStep(3)} className="btn-primary flex-2 flex-1 py-3 text-sm font-bold">
                I've Transferred → Submit Record
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Submit record */}
        {step === 3 && (
          <div className="animate-fade-in">
            <div className="section-label">Confirm Your Payment</div>
            <div className="card p-6 mb-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-white/40 text-sm">Member</span>
                  <span className="text-white font-semibold text-sm">{userProfile?.displayName}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-white/40 text-sm">Method</span>
                  <span className="font-bold text-sm" style={{ color: selectedMethod?.color }}>{selectedMethod?.label}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-white/40 text-sm">Amount</span>
                  <span className="text-gold-400 font-black text-xl font-display">Rs. {parseInt(amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-white/40 text-sm">Date</span>
                  <span className="text-white text-sm">{format(new Date(), 'dd MMMM yyyy')}</span>
                </div>
                <div>
                  <label className="section-label">Note (Optional)</label>
                  <input value={note} onChange={e => setNote(e.target.value)}
                    placeholder="e.g. June 2025 contribution, advance payment..."
                    className="input-field" />
                </div>
              </div>
            </div>

            <div className="glass-gold rounded-2xl p-4 mb-6 text-sm text-gold-400/70 leading-relaxed">
              📧 After admin verification, you'll receive an <strong className="text-gold-400">email receipt</strong> automatically at <strong className="text-gold-400">{currentUser?.email}</strong>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-ghost flex-1 py-3 text-sm font-semibold">← Back</button>
              <button onClick={handleSubmit} disabled={loading}
                className="btn-primary flex-1 py-3 text-sm font-bold disabled:opacity-50">
                {loading ? 'Submitting...' : '✓ Submit Payment Record'}
              </button>
            </div>
          </div>
        )}
        </div>
        )}
      </div>
    </Layout>
  )
}

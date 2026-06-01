import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { updatePassword, updateProfile, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { db, auth } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'

const AREAS = ['Block A','Block B','Block C','Block D','Block E','Main Bazar','Near Masjid','Other']

export default function Profile() {
  const { currentUser, userProfile, fetchUserProfile } = useAuth()
  const [form, setForm] = useState({
    displayName: userProfile?.displayName || '',
    phone: userProfile?.phone || '',
    area: userProfile?.area || '',
  })
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [changingPass, setChangingPass] = useState(false)

  async function saveProfile(e) {
    e.preventDefault()
    if (!form.displayName) return toast.error('Name is required')
    setSaving(true)
    try {
      await updateProfile(auth.currentUser, { displayName: form.displayName })
      await updateDoc(doc(db, 'users', currentUser.uid), {
        displayName: form.displayName,
        phone: form.phone,
        area: form.area,
      })
      await fetchUserProfile(currentUser.uid)
      toast.success('Profile updated successfully!')
    } catch { toast.error('Failed to update profile') }
    finally { setSaving(false) }
  }

  async function changePassword(e) {
    e.preventDefault()
    if (passwords.newPass.length < 6) return toast.error('Password must be at least 6 characters')
    if (passwords.newPass !== passwords.confirm) return toast.error('Passwords do not match')
    setChangingPass(true)
    try {
      const cred = EmailAuthProvider.credential(currentUser.email, passwords.current)
      await reauthenticateWithCredential(auth.currentUser, cred)
      await updatePassword(auth.currentUser, passwords.newPass)
      toast.success('Password changed successfully!')
      setPasswords({ current: '', newPass: '', confirm: '' })
    } catch (err) {
      if (err.code === 'auth/wrong-password') toast.error('Current password is incorrect')
      else toast.error('Failed to change password')
    } finally { setChangingPass(false) }
  }

  const initials = (userProfile?.displayName || 'M').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="page-title">My Profile</h1>
          <p className="page-sub">Manage your account settings</p>
        </div>

        {/* Avatar section */}
        <div className="card p-6 mb-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-600 to-gold-600 flex items-center justify-center text-xl font-black text-white shadow-xl flex-shrink-0">
            {initials}
          </div>
          <div>
            <div className="font-display font-bold text-white text-xl">{userProfile?.displayName}</div>
            <div className="text-white/40 text-sm">{currentUser?.email}</div>
            <div className="flex items-center gap-2 mt-1">
              {userProfile?.area && <span className="text-xs bg-white/5 text-white/30 px-2 py-0.5 rounded">{userProfile.area}</span>}
              <span className="text-xs bg-gold-500/10 text-gold-500/60 border border-gold-500/20 px-2 py-0.5 rounded capitalize">{userProfile?.role || 'member'}</span>
            </div>
          </div>
        </div>

        {/* Profile form */}
        <div className="card p-6 mb-6">
          <div className="font-bold text-white mb-5">Personal Information</div>
          <form onSubmit={saveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Full Name *</label>
              <input value={form.displayName} onChange={e => setForm(p => ({ ...p, displayName: e.target.value }))}
                className="input-field" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Email Address</label>
              <input value={currentUser?.email} disabled className="input-field opacity-40 cursor-not-allowed" />
              <p className="text-white/20 text-xs mt-1">Email cannot be changed</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Phone Number</label>
                <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="0300-1234567" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Area / Block</label>
                <select value={form.area} onChange={e => setForm(p => ({ ...p, area: e.target.value }))} className="input-field">
                  <option value="">Select area...</option>
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn-primary w-full py-3 text-sm font-bold disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Password change */}
        <div className="card p-6">
          <div className="font-bold text-white mb-5">Change Password</div>
          <form onSubmit={changePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Current Password</label>
              <input type="password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                placeholder="••••••••" className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">New Password</label>
                <input type="password" value={passwords.newPass} onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))}
                  placeholder="Min 6 characters" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Confirm New</label>
                <input type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  placeholder="Re-enter" className="input-field" />
              </div>
            </div>
            <button type="submit" disabled={changingPass} className="btn-ghost w-full py-3 text-sm font-semibold disabled:opacity-50">
              {changingPass ? 'Changing...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}

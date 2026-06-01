import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const memberNav = [
  { to: '/dashboard', icon: '⬡', label: 'Dashboard' },
  { to: '/pay', icon: '💳', label: 'Pay Now' },
  { to: '/history', icon: '📋', label: 'My Payments' },
  { to: '/profile', icon: '👤', label: 'Profile' },
]

const adminNav = [
  { to: '/dashboard', icon: '⬡', label: 'Overview' },
  { to: '/admin/payments', icon: '📋', label: 'All Payments' },
  { to: '/admin/members', icon: '👥', label: 'Members' },
  { to: '/admin/reminders', icon: '🔔', label: 'Reminders' },
  { to: '/pay', icon: '💳', label: 'Pay Now' },
  { to: '/profile', icon: '👤', label: 'Profile' },
]

export default function Layout({ children }) {
  const { currentUser, userProfile, isAdmin, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    try { await logout(); navigate('/'); toast.success('Signed out') }
    catch { toast.error('Error signing out') }
  }

  const navItems = isAdmin ? adminNav : memberNav
  const initials = (userProfile?.displayName || currentUser?.displayName || 'M').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-500 to-gold-300 flex items-center justify-center font-black text-dark-500 text-lg shadow-lg shadow-gold-500/30">K</div>
          <div>
            <div className="font-display font-bold text-gold-300 text-sm leading-none">Khanana Welfare</div>
            <div className="text-white/25 text-[10px] tracking-widest uppercase">{isAdmin ? 'Admin Panel' : 'Member Portal'}</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-4 mb-3">
          {isAdmin ? 'Administration' : 'Navigation'}
        </div>
        {navItems.map(item => (
          <Link key={item.to} to={item.to}
            onClick={() => setMobileOpen(false)}
            className={`sidebar-link ${location.pathname === item.to ? 'active' : ''}`}>
            <span className="text-base w-5 text-center">{item.icon}</span>
            {item.label}
            {item.label === 'Pay Now' && (
              <span className="ml-auto w-2 h-2 rounded-full bg-gold-400 pulse-gold" />
            )}
          </Link>
        ))}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl glass mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-navy-600 to-gold-600 flex items-center justify-center text-xs font-black text-white flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white/80 text-sm font-semibold truncate">
              {userProfile?.displayName || currentUser?.displayName || 'Member'}
            </div>
            <div className="text-white/30 text-xs truncate">{currentUser?.email}</div>
          </div>
          {isAdmin && <span className="text-[9px] bg-gold-500/20 text-gold-400 border border-gold-500/30 px-1.5 py-0.5 rounded font-bold">ADMIN</span>}
        </div>
        <button onClick={handleLogout}
          className="w-full text-left px-4 py-2.5 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all text-xs font-semibold flex items-center gap-2">
          <span>⏏</span> Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-dark-500 overflow-hidden font-body">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/5 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 h-full bg-dark-400 border-r border-white/5 z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-white/5 bg-dark-500/95 backdrop-blur-xl flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="text-white/60 hover:text-white p-1">
            ☰
          </button>
          <div className="font-display text-gold-300 font-bold text-sm">Khanana Welfare</div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-navy-600 to-gold-600 flex items-center justify-center text-xs font-black text-white">
            {initials}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

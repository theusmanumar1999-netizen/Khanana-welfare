import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import JoinSociety from './pages/JoinSociety'
import Dashboard from './pages/Dashboard'
import PayNow from './pages/PayNow'
import PaymentHistory from './pages/PaymentHistory'
import AdminPayments from './pages/AdminPayments'
import AdminReminders from './pages/AdminReminders'
import Profile from './pages/Profile'
import About from './pages/About'
import Leadership from './pages/Leadership'

function PrivateRoute({ children }) {
  const { currentUser } = useAuth()
  return currentUser ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { currentUser, isAdmin } = useAuth()
  if (!currentUser) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return children
}

function PublicRoute({ children }) {
  const { currentUser } = useAuth()
  return currentUser ? <Navigate to="/dashboard" replace /> : children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/join" element={<PublicRoute><JoinSociety /></PublicRoute>} />
      <Route path="/leadership" element={<Leadership />} />

      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/pay" element={<PrivateRoute><PayNow /></PrivateRoute>} />
      <Route path="/history" element={<PrivateRoute><PaymentHistory /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

      <Route path="/admin/payments" element={<AdminRoute><AdminPayments /></AdminRoute>} />
      <Route path="/admin/reminders" element={<AdminRoute><AdminReminders /></AdminRoute>} />

      <Route path="/about" element={<About />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0f1923',
              color: '#e8dcc8',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '12px',
              fontSize: '13px',
              fontFamily: "'DM Sans', sans-serif",
            },
            success: { iconTheme: { primary: '#00c864', secondary: '#0f1923' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#0f1923' } },
          }}
        />
      </AuthProvider>
    </Router>
  )
}

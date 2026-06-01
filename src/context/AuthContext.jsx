import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@khanana-welfare.com'

  async function register(email, password, displayName, phone, area, fatherName = '', address = '') {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName })
    const isAdmin = email === ADMIN_EMAIL
    await setDoc(doc(db, 'users', result.user.uid), {
      uid: result.user.uid,
      displayName,
      email,
      phone: phone || '',
      area: area || '',
      fatherName: fatherName || '',
      address: address || '',
      role: isAdmin ? 'admin' : 'member',
      status: 'active',
      joinedAt: serverTimestamp(),
      totalPaid: 0,
      lastPayment: null,
    })
    return result
  }

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    return signOut(auth)
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

  async function fetchUserProfile(uid) {
    const snap = await getDoc(doc(db, 'users', uid))
    if (snap.exists()) {
      setUserProfile(snap.data())
      return snap.data()
    }
    return null
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        await fetchUserProfile(user.uid)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const isAdmin = userProfile?.role === 'admin'

  const value = {
    currentUser,
    userProfile,
    isAdmin,
    loading,
    register,
    login,
    logout,
    resetPassword,
    fetchUserProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

import { createContext, useContext, useState } from 'react'
import { useMembers } from './MembersContext'

const AuthContext = createContext(null)
const API_URL = import.meta.env.VITE_API_URL

function loadStoredUser() {
  const raw = localStorage.getItem('nazareno_user')
  return raw ? JSON.parse(raw) : null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser)

  const login = async (codigo, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo, password }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      throw new Error(body?.error || 'No se pudo iniciar sesión.')
    }
    const data = await res.json()
    localStorage.setItem('nazareno_user', JSON.stringify(data))
    setUser(data)
    return data
  }

  const logout = () => {
    localStorage.removeItem('nazareno_user')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}

export function useCurrentUser() {
  const { user } = useAuth()
  const { members } = useMembers()
  return members.find((m) => m.id === user?.id) || null
}
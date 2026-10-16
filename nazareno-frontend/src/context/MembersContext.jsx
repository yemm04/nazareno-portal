import { createContext, useContext, useEffect, useState } from 'react'
import { authHeaders } from '../utils/api'

const MembersContext = createContext(null)
const API_URL = import.meta.env.VITE_API_URL

export function MembersProvider({ children }) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMembers = async () => {
    setLoading(true)
    const res = await fetch(`${API_URL}/usuarios`)
    const data = await res.json()
    setMembers(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const addMember = async (data) => {
    const res = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      if (res.status === 400) throw new Error('Revisa los campos obligatorios.')
      const body = await res.json().catch(() => null)
      throw new Error(body?.error || 'No se pudo registrar el miembro.')
    }
    const nuevo = await res.json()
    setMembers((prev) => [...prev, nuevo])
    return nuevo
  }

  const updateMember = async (id, data) => {
    const res = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      throw new Error(body?.error || 'No se pudo actualizar el miembro.')
    }
    const actualizado = await res.json()
    setMembers((prev) => prev.map((m) => (m.id === actualizado.id ? actualizado : m)))
    return actualizado
  }

  const removeMember = async (id) => {
    const res = await fetch(`${API_URL}/usuarios/${id}`, { method: 'DELETE', headers: authHeaders() })
    if (!res.ok) throw new Error('No se pudo eliminar el miembro.')
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <MembersContext.Provider value={{ members, loading, addMember, updateMember, removeMember }}>
      {children}
    </MembersContext.Provider>
  )
}

export function useMembers() {
  const ctx = useContext(MembersContext)
  if (!ctx) throw new Error('useMembers debe usarse dentro de <MembersProvider>')
  return ctx
}


import { createContext, useContext, useEffect, useState } from 'react'

const AttendanceContext = createContext(null)
const API_URL = import.meta.env.VITE_API_URL

export function todayISO() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

// El backend devuelve el usuario completo anidado (r.usuario.id) por la
// relación @ManyToOne. En vez de tocar cada pantalla que ya usa r.memberId
// (Marcar Entrada, Registro de Asistencias, Reportes), lo normalizamos
// aquí una sola vez para que el resto de la app no note el cambio.
function normalize(record) {
  return { ...record, memberId: record.usuario.id }
}

export function AttendanceProvider({ children }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const refreshRecords = async () => {
      try {
        const res = await fetch(`${API_URL}/asistencias`)
        if (!res.ok) throw new Error('No se pudieron cargar las asistencias.')
        const data = await res.json()
        if (active) setRecords(data.map(normalize))
      } catch (error) {
        console.error('Error al actualizar las asistencias:', error)
      } finally {
        if (active) setLoading(false)
      }
    }

    refreshRecords()
    const intervalId = window.setInterval(refreshRecords, 30_000)
    return () => {
      active = false
      window.clearInterval(intervalId)
    }
  }, [])

  const getTodayRecord = (memberId) =>
    records.find((r) => r.memberId === memberId && r.fecha === todayISO())

  const markEntrada = async (memberId, metodo = 'MANUAL') => {
    const res = await fetch(`${API_URL}/asistencias/entrada`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioId: memberId, metodo }),
    })
    if (!res.ok) throw new Error('No se pudo marcar la entrada.')
    const record = normalize(await res.json())
    setRecords((prev) => {
      const yaExiste = prev.some((r) => r.id === record.id)
      return yaExiste ? prev.map((r) => (r.id === record.id ? record : r)) : [...prev, record]
    })
    return record
  }

  const markSalida = async (memberId) => {
    const res = await fetch(`${API_URL}/asistencias/salida`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioId: memberId }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      throw new Error(body?.error || 'No se pudo marcar la salida.')
    }
    const record = normalize(await res.json())
    setRecords((prev) => prev.map((r) => (r.id === record.id ? record : r)))
    return record
  }

  return (
    <AttendanceContext.Provider value={{ records, loading, markEntrada, markSalida, getTodayRecord }}>
      {children}
    </AttendanceContext.Provider>
  )
}

export function useAttendance() {
  const ctx = useContext(AttendanceContext)
  if (!ctx) throw new Error('useAttendance debe usarse dentro de <AttendanceProvider>')
  return ctx
}
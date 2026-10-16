import { createContext, useContext, useEffect, useState } from 'react'
import { authHeaders } from '../utils/api'

const TasksContext = createContext(null)
const API_URL = import.meta.env.VITE_API_URL

// El backend anida el usuario completo bajo "tomadaPor" (relación @ManyToOne).
// Lo normalizamos a un id plano para no tocar el resto de la app.
function normalize(task) {
  return { ...task, tomadaPor: task.tomadaPor ? task.tomadaPor.id : null }
}

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/tareas`)
      .then((res) => res.json())
      .then((data) => setTasks(data.map(normalize)))
      .finally(() => setLoading(false))
  }, [])

  const addTask = async (data) => {
    const res = await fetch(`${API_URL}/tareas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('No se pudo crear la tarea.')
    const nueva = normalize(await res.json())
    setTasks((prev) => [nueva, ...prev])
    return nueva
  }

  const takeTask = async (taskId, memberId) => {
    const res = await fetch(`${API_URL}/tareas/${taskId}/tomar`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioId: memberId }),
    })
    if (!res.ok) throw new Error('No se pudo tomar la tarea.')
    const actualizada = normalize(await res.json())
    setTasks((prev) => prev.map((t) => (t.id === taskId ? actualizada : t)))
  }

  const completeTask = async (taskId) => {
    const res = await fetch(`${API_URL}/tareas/${taskId}/completar`, { method: 'PATCH' })
    if (!res.ok) throw new Error('No se pudo completar la tarea.')
    const actualizada = normalize(await res.json())
    setTasks((prev) => prev.map((t) => (t.id === taskId ? actualizada : t)))
  }

  const removeTask = async (taskId) => {
    const res = await fetch(`${API_URL}/tareas/${taskId}`, { method: 'DELETE', headers: authHeaders() })
    if (!res.ok) throw new Error('No se pudo eliminar la tarea.')
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }

  return (
    <TasksContext.Provider value={{ tasks, loading, addTask, takeTask, completeTask, removeTask }}>
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TasksContext)
  if (!ctx) throw new Error('useTasks debe usarse dentro de <TasksProvider>')
  return ctx
}
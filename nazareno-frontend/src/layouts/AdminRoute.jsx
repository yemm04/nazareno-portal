import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute() {
  const { user } = useAuth()
  if (user?.rol !== 'ADMIN') {
    return <Navigate to="/marcar-entrada" replace />
  }
  return <Outlet />
}
import { useState } from 'react'
import { Outlet, Navigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'

export default function AppLayout() {
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
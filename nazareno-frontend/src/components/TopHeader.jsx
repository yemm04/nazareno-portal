import { Bell, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../constants/roles'

export default function TopHeader({ onMenuClick }) {
  const { user } = useAuth()
  const nombreCompleto = user ? `${user.nombre} ${user.apellido}` : ''
  const rolLabel = user ? ROLES[user.rol]?.label : ''

  return (
    <header className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8 sm:py-5 bg-white border-b border-gray-100 print:hidden">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menú"
          title="Abrir menú"
          className="lg:hidden flex-shrink-0 text-gray-600 hover:text-purple-900"
        >
          <Menu size={22} />
        </button>
        <p className="text-gray-500 truncate hidden sm:block">
        Bienvenido de nuevo, <span className="font-semibold text-gray-800">{nombreCompleto}</span>
        </p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <button className="text-gray-500">
          <Bell size={20} />
        </button>
        <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-900">
          {user?.nombre?.charAt(0)}
        </div>
        <div className="text-sm leading-tight hidden sm:block">
          <p className="font-semibold">{nombreCompleto}</p>
          <p className="text-gray-400 text-xs">{rolLabel}</p>
        </div>
      </div>
    </header>
  )
}
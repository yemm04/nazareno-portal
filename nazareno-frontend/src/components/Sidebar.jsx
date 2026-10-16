import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../constants/roles'
import {
  LayoutGrid, PenLine, UserCheck, Users, ClipboardList,
  ListTodo, CalendarDays, Megaphone, FileBarChart, UserCircle, LogOut, X,
} from 'lucide-react'

const ADMIN_NAV = [
  { label: 'Control del Sistema', icon: LayoutGrid, path: '/dashboard' },
  { label: 'Marcar Entrada', icon: PenLine, path: '/marcar-entrada' },
  { label: 'Control de Ingreso', icon: UserCheck, path: '/control-ingreso' },
  { label: 'Miembros', icon: Users, path: '/miembros' },
  { label: 'Registro de Asistencias', icon: ClipboardList, path: '/asistencias' },
  { label: 'Tareas del Día', icon: ListTodo, path: '/tareas' },
  { label: 'Calendario', icon: CalendarDays, path: '/calendario' },
  { label: 'Comunicaciones', icon: Megaphone, path: '/comunicaciones' },
  { label: 'Reportes', icon: FileBarChart, path: '/reportes' },
]

const STANDARD_NAV = [
  { label: 'Marcar Entrada', icon: PenLine, path: '/marcar-entrada' },
  { label: 'Tareas del Día', icon: ListTodo, path: '/tareas' },
  { label: 'Calendario', icon: CalendarDays, path: '/calendario' },
  { label: 'Comunicaciones', icon: Megaphone, path: '/comunicaciones' },
  { label: 'Mi Perfil', icon: UserCircle, path: '/perfil' },
]

export default function Sidebar({ mobileOpen, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const navItems = user?.rol === 'ADMIN' ? ADMIN_NAV : STANDARD_NAV
  const nombreCompleto = user ? `${user.nombre} ${user.apellido}` : ''
  const rolLabel = user ? ROLES[user.rol]?.label : ''

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 min-h-screen bg-purple-950 text-white flex flex-col print:hidden
          transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="px-6 py-6 flex items-center justify-between gap-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/logo-nazareno.png" alt="El Nazareno" className="w-10 h-10 object-contain" />
            <div>
              <p className="font-bold leading-tight text-sm">Colegio El Nazareno</p>
              <p className="text-xs text-purple-300">Portal de Asistencias</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-purple-300">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive ? 'bg-amber-500 text-purple-950' : 'text-purple-200 hover:bg-white/10'}`}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-purple-800 flex items-center justify-center text-sm font-bold">
              {user?.nombre?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">{nombreCompleto}</p>
              <p className="text-xs text-purple-300">{rolLabel}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 font-medium"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  )
}
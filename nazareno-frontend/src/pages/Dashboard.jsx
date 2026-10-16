import { useState, useEffect } from 'react'
import { Users, UserCheck, CalendarCheck } from 'lucide-react'
import { useMembers } from '../context/MembersContext'
import { useAttendance } from '../context/AttendanceContext'
import { ROLES } from '../constants/roles'

export default function Dashboard() {
  
  const { members } = useMembers() 
  const { records } = useAttendance()

  const [stats, setStats] = useState({ totalMiembros: 0, activos: 0, asistenciasMes: 0, practicantes: 0, coordinadores: 0 })

  useEffect(() => {
    setStats({
      
      totalMiembros: members.length,
      activos: members.filter((m) => m.estado === 'ACTIVO').length,
      asistenciasMes: records.length,
      practicantes: members.filter((m) => m.rol === ROLES.PRACTICANTE.id).length,
      coordinadores: members.filter((m) => m.rol === ROLES.COORDINADOR.id).length,
    })
  
  }, [members, records])
  const cards = [
    { label: 'TOTAL MIEMBROS', value: stats.totalMiembros, icon: Users },
    { label: 'ACTIVOS HOY', value: stats.activos, icon: UserCheck },
    { label: 'ASISTENCIAS ESTE MES', value: stats.asistenciasMes, icon: CalendarCheck },
  ]
  const totalRoles = stats.practicantes + stats.coordinadores || 1

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Control del Sistema</h1>
        <span className="text-sm text-gray-400">
          {new Date().toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-400 tracking-wide">{label}</p>
              <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                <Icon size={18} className="text-amber-600" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-purple-950">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 max-w-md">
        <h2 className="font-bold text-gray-900 mb-1">Miembros por Rol</h2>
        <p className="text-sm text-gray-400 mb-5">Distribución actual del equipo</p>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-medium mb-1"><span>Practicantes</span><span>{stats.practicantes}</span></div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-800 rounded-full" style={{ width: `${(stats.practicantes / totalRoles) * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium mb-1"><span>Coordinadores</span><span>{stats.coordinadores}</span></div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(stats.coordinadores / totalRoles) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
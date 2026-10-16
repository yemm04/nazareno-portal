import { useState } from 'react'
import { Camera, Bell, User, Clock, ClipboardList, FileText } from 'lucide-react'
import { useCurrentUser } from '../context/AuthContext'
import { useAttendance } from '../context/AttendanceContext'
import { mockSchedule } from '../data/mockSchedule'
import { DIAS_SEMANA, formatFecha } from '../utils/dates'
import { ROLES } from '../constants/roles'

const TABS = [
  { id: 'info', label: 'Información', icon: User },
  { id: 'horario', label: 'Mi Horario', icon: Clock },
  { id: 'asistencias', label: 'Asistencias', icon: ClipboardList },
  { id: 'documentos', label: 'Documentos', icon: FileText },
]

export default function MiPerfil() {
  const user = useCurrentUser()
  const { records } = useAttendance()
  const [tab, setTab] = useState('info')

  if (!user) {
    return <p className="text-center text-gray-400 py-20">Cargando tu perfil...</p>
  }

  const role = ROLES[user.rol]
  const misHorarios = mockSchedule.filter((s) => s.codigo === user.codigo)
  const misAsistencias = records.filter((r) => r.memberId === user.id).sort((a, b) => b.fecha.localeCompare(a.fecha))

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-5">Mi Perfil</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-5 flex flex-wrap items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-900 flex items-center justify-center text-xl font-bold">
          {user.nombre.charAt(0)}{user.apellido.charAt(0)}
        </div>
        <div className="flex-1 min-w-[200px]">
          <h2 className="text-lg font-bold text-gray-900 uppercase">{user.nombre} {user.apellido}</h2>
          <p className="text-sm text-gray-500">{role?.label} — {user.area}</p>
          <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">{user.estado}</span>
        </div>
        <div className="flex gap-2">
          <button disabled title="Próximamente" className="text-sm font-medium text-gray-400 border border-gray-200 rounded-lg px-3 py-2 cursor-not-allowed">
            Editar perfil
          </button>
          <button disabled title="Próximamente" className="flex items-center gap-1.5 text-sm font-medium text-gray-400 border border-gray-200 rounded-lg px-3 py-2 cursor-not-allowed">
            <Camera size={15} /> Agregar firma
          </button>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-5 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Bell size={20} className="text-blue-600" />
          <div>
            <p className="font-semibold text-gray-900 text-sm">Notificaciones push</p>
            <p className="text-xs text-gray-500">Recibe un aviso antes de que termine tu horario.</p>
          </div>
        </div>
        <button disabled title="Próximamente" className="text-sm font-medium bg-blue-200 text-blue-500 px-4 py-2 rounded-lg cursor-not-allowed">
          Activar notificaciones
        </button>
      </div>

      <div className="flex gap-1 mb-5 bg-white rounded-lg border border-gray-200 p-1 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-md ${tab === id ? 'bg-purple-950 text-white' : 'text-gray-500'}`}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {tab === 'info' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4">Datos Personales</h3>
            <dl className="space-y-3 text-sm">
              <Info label="DNI" value={user.dni} />
              <Info label="Fecha de Nacimiento" value={user.fechaNacimiento ? formatFecha(user.fechaNacimiento) : '—'} />
              <Info label="Género" value={user.genero || '—'} />
              <Info label="Teléfono" value={user.telefono || '—'} />
              <Info label="Correo" value={user.correo || '—'} />
            </dl>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4">Datos Laborales</h3>
            <dl className="space-y-3 text-sm">
              <Info label="Código" value={user.codigo} />
              <Info label="Cargo" value={role?.label} />
              <Info label="Área" value={user.area} />
              <Info label="Fecha de Ingreso" value={formatFecha(user.fechaIngreso)} />
            </dl>
          </div>
        </div>
      )}

      {tab === 'horario' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {DIAS_SEMANA.map((d) => {
            const franja = misHorarios.find((h) => h.dia === d.key)
            return (
              <div key={d.key} className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm font-medium text-gray-800 w-16">{d.label}</span>
                {franja ? (
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${franja.modalidad === 'PRESENCIAL' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {franja.modalidad === 'PRESENCIAL' ? 'Presencial' : 'Virtual'}
                    </span>
                    {franja.horaInicio} - {franja.horaFin}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400 italic">Día libre</span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {tab === 'asistencias' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Fecha</th>
                <th className="px-5 py-3 font-medium">Entrada</th>
                <th className="px-5 py-3 font-medium">Salida</th>
                <th className="px-5 py-3 font-medium">Método</th>
              </tr>
            </thead>
            <tbody>
              {misAsistencias.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3">{formatFecha(r.fecha)}</td>
                  <td className="px-5 py-3">{r.horaEntrada}</td>
                  <td className="px-5 py-3">{r.horaSalida || '—'}</td>
                  <td className="px-5 py-3 capitalize">{r.metodo.toLowerCase()}</td>
                </tr>
              ))}
              {misAsistencias.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-gray-400">Todavía no tienes marcas registradas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'documentos' && (
        <p className="text-sm text-gray-400 bg-white rounded-xl border border-gray-100 p-10 text-center">
          Próximamente — aquí verás tus documentos (CV, contratos, certificados).
        </p>
      )}
    </>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-gray-400 uppercase tracking-wide">{label}</dt>
      <dd className="text-gray-800 font-medium">{value}</dd>
    </div>
  )
}
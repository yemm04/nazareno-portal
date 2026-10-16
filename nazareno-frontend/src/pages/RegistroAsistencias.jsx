import { useState } from 'react'
import { Search, Download, FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { useMembers } from '../context/MembersContext'
import { useAttendance, todayISO } from '../context/AttendanceContext'
import { ROLES, ROLE_LIST } from '../constants/roles'
import { AREAS } from '../data/mockMembers'
import { formatFecha } from '../utils/dates'

export default function RegistroAsistencias() {
  const { members } = useMembers()
  const { records } = useAttendance()

  const today = todayISO()
  const [desde, setDesde] = useState(today)
  const [hasta, setHasta] = useState(today)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('TODOS')
  const [areaFilter, setAreaFilter] = useState('TODAS')
  const [expandedId, setExpandedId] = useState(null)

  const inRange = (fecha) => fecha >= desde && fecha <= hasta

  const filteredMembers = members.filter((m) => {
    const term = search.toLowerCase()
    const matchesSearch = `${m.nombre} ${m.apellido}`.toLowerCase().includes(term) || m.codigo.toLowerCase().includes(term)
    const matchesRole = roleFilter === 'TODOS' || m.rol === roleFilter
    const matchesArea = areaFilter === 'TODAS' || m.area === areaFilter
    return matchesSearch && matchesRole && matchesArea
  })

  const getMemberRecords = (memberId) =>
    records.filter((r) => r.memberId === memberId && inRange(r.fecha)).sort((a, b) => a.fecha.localeCompare(b.fecha))

  const presentesCount = filteredMembers.filter((m) => getMemberRecords(m.id).length > 0).length
  const sinMarcarCount = filteredMembers.length - presentesCount

  const handleExportExcel = () => {
    const headers = ['Código', 'Nombre', 'Rol', 'Área', 'Marcas en rango', 'Última entrada', 'Última salida']
    const rows = filteredMembers.map((m) => {
      const recs = getMemberRecords(m.id)
      const last = recs[recs.length - 1]
      return [m.codigo, `${m.nombre} ${m.apellido}`, ROLES[m.rol].label, m.area, recs.length, last?.horaEntrada || '-', last?.horaSalida || '-']
    })
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `asistencias_${desde}_a_${hasta}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportPDF = () => {
    alert('Exportar a PDF se conecta cuando tengamos el backend (o una librería como jsPDF) — por ahora usa "Exportar Excel".')
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registro de Asistencias</h1>
          <p className="text-sm text-gray-400">Lo que cada colaborador marcó en el rango seleccionado.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportExcel} className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium px-3.5 py-2 rounded-lg">
            <Download size={16} />
            Exportar Excel
          </button>
          <button onClick={handleExportPDF} className="flex items-center gap-2 bg-purple-950 hover:bg-purple-900 text-white text-sm font-medium px-3.5 py-2 rounded-lg">
            <FileText size={16} />
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3 mt-6 mb-5">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Desde</label>
          <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Hasta</label>
          <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar miembro..." className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
          <option value="TODOS">Todos los roles</option>
          {ROLE_LIST.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
        <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
          <option value="TODAS">Todas las áreas</option>
          {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <p className="text-xs text-gray-400 mb-3">
        {filteredMembers.length} miembros · <span className="text-green-700 font-medium">{presentesCount} con marcas</span> · <span className="text-gray-500 font-medium">{sinMarcarCount} sin marcar</span>
      </p>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        {filteredMembers.map((m) => {
          const recs = getMemberRecords(m.id)
          const role = ROLES[m.rol]
          const isOpen = expandedId === m.id
          return (
            <div key={m.id}>
              <div className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-900 flex items-center justify-center text-xs font-bold">
                    {m.nombre.charAt(0)}{m.apellido.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{m.nombre} {m.apellido}</p>
                    <p className="text-xs text-gray-400">
                      <span className={`font-semibold ${role.id === 'PRACTICANTE' ? 'text-purple-700' : 'text-amber-700'}`}>{role.label}</span> · {m.area}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500">
                    {recs.length === 0 ? 'Sin marcas en este rango' : `${recs.length} marca${recs.length > 1 ? 's' : ''}`}
                  </span>
                  <button onClick={() => setExpandedId(isOpen ? null : m.id)} className="flex items-center gap-1 text-xs font-semibold text-purple-800 hover:underline">
                    Ver detalle
                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="bg-gray-50 px-5 py-3">
                  {recs.length === 0 ? (
                    <p className="text-xs text-gray-400 py-2">No hay marcas registradas en el rango seleccionado.</p>
                  ) : (
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-left text-gray-400">
                          <th className="py-1.5 font-medium">Fecha</th>
                          <th className="py-1.5 font-medium">Entrada</th>
                          <th className="py-1.5 font-medium">Salida</th>
                          <th className="py-1.5 font-medium">Método</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recs.map((r) => (
                          <tr key={r.id} className="border-t border-gray-100">
                            <td className="py-1.5">{formatFecha(r.fecha)}</td>
                            <td className="py-1.5">{r.horaEntrada}</td>
                            <td className="py-1.5">{r.horaSalida || '—'}</td>
                            <td className="py-1.5 capitalize">{r.metodo.toLowerCase()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )
        })}
        {filteredMembers.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-10">No se encontraron miembros con esos filtros.</p>
        )}
      </div>
    </>
  )
}
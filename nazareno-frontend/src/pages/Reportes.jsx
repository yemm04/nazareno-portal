import { useState } from 'react'
import { ClipboardList, ClipboardCheck, Timer, Hourglass, RefreshCw, Download, FileText, CheckCircle2, XCircle, Clock, FileCheck } from 'lucide-react'
import { useMembers } from '../context/MembersContext'
import { useAttendance } from '../context/AttendanceContext'
import { mockSchedule } from '../data/mockSchedule'
import { AREAS } from '../data/mockMembers'
import { ROLES } from '../constants/roles'
import { formatFecha, formatFullDate, firstOfMonthISO } from '../utils/dates'
import { buildAttendanceReport } from '../utils/reports'
import { todayISO } from '../context/AttendanceContext'

const TABS = [
  { id: 'asistencias', label: 'Asistencias', icon: ClipboardList },
  { id: 'tareas', label: 'Tareas', icon: ClipboardCheck },
  { id: 'tardanzas', label: 'Tardanzas', icon: Timer },
  { id: 'horas', label: 'Horas', icon: Hourglass },
]

export default function Reportes() {
  const { members } = useMembers()
  const { records } = useAttendance()

  const [tab, setTab] = useState('asistencias')
  const [desde, setDesde] = useState(firstOfMonthISO())
  const [hasta, setHasta] = useState(todayISO())
  const [horarioFilter, setHorarioFilter] = useState('TODOS')
  const [areaFilter, setAreaFilter] = useState('TODAS')

  const [reportRows, setReportRows] = useState(null)
  const [generatedAt, setGeneratedAt] = useState(null)

  const handleGenerar = () => {
    if (tab !== 'asistencias') return // los demás tabs aún no calculan nada real
    const rows = buildAttendanceReport({ members, schedule: mockSchedule, records, desde, hasta, areaFilter, horarioFilter })
    setReportRows(rows)
    setGeneratedAt(new Date())
  }

  const totals = reportRows?.reduce(
    (acc, r) => ({ pres: acc.pres + r.pres, aus: acc.aus + r.aus, tard: acc.tard + r.tard, perm: acc.perm + r.perm, total: acc.total + r.total }),
    { pres: 0, aus: 0, tard: 0, perm: 0, total: 0 }
  )
  const asistenciaPromedio = totals?.total > 0 ? Math.round((totals.pres / totals.total) * 100) : 0

  const handleExportExcel = () => {
    const headers = ['Apellidos y Nombres', 'DNI', 'Cargo', 'Área', 'Presentes', 'Ausentes', 'Tardanzas', 'Permisos', 'Total', '% Asistencia']
    const rows = reportRows.map((r) => [
      `${r.member.apellido}, ${r.member.nombre}`, r.member.dni, ROLES[r.member.rol].label, r.member.area,
      r.pres, r.aus, r.tard, r.perm, r.total, r.pctAsist === null ? '' : `${r.pctAsist}%`,
    ])
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reporte_asistencias_${desde}_a_${hasta}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportPDF = () => window.print()

  return (
    <>
      <div className="print:hidden">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
            <p className="text-sm text-gray-400">Genera reportes autorizados de asistencia y tardanzas</p>
          </div>
          {reportRows && (
            <div className="flex gap-2">
              <button onClick={handleExportExcel} className="flex items-center gap-2 border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 text-sm font-medium px-3.5 py-2 rounded-lg">
                <Download size={16} /> Exportar Excel
              </button>
              <button onClick={handleExportPDF} className="flex items-center gap-2 bg-purple-950 hover:bg-purple-900 text-white text-sm font-medium px-3.5 py-2 rounded-lg">
                <FileText size={16} /> Exportar PDF
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-1 mt-5 mb-5 bg-white rounded-lg border border-gray-200 p-1 w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setTab(id); setReportRows(null) }}
              className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-md ${tab === id ? 'bg-purple-950 text-white' : 'text-gray-500'}`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Filtros</h2>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Desde</label>
              <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Hasta</label>
              <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Horario</label>
              <select value={horarioFilter} onChange={(e) => setHorarioFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
                <option value="TODOS">Todos los horarios</option>
                <option value="MANANA">Mañana</option>
                <option value="TARDE">Tarde</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Área</label>
              <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
                <option value="TODAS">Todas las áreas</option>
                {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <button onClick={handleGenerar} className="flex items-center gap-2 bg-purple-950 hover:bg-purple-900 text-white text-sm font-semibold px-4 py-2.5 rounded-lg">
              <RefreshCw size={16} /> Generar reporte
            </button>
          </div>
        </div>

        {tab !== 'asistencias' && (
          <p className="text-sm text-gray-400 bg-white rounded-xl border border-gray-100 p-6 text-center">
            Este reporte ({TABS.find((t) => t.id === tab).label}) queda pendiente de definir junto al equipo — misma estructura, se arma cuando lo prioricen.
          </p>
        )}

        {tab === 'asistencias' && reportRows && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <SummaryCard icon={CheckCircle2} value={totals.pres} label="Presentes" bg="bg-green-50" text="text-green-700" />
              <SummaryCard icon={XCircle} value={totals.aus} label="Ausentes" bg="bg-red-50" text="text-red-600" />
              <SummaryCard icon={Clock} value={totals.tard} label="Tardanzas" bg="bg-amber-50" text="text-amber-600" />
              <SummaryCard icon={FileCheck} value={totals.perm} label="Permisos" bg="bg-blue-50" text="text-blue-600" />
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 text-sm text-gray-500">{reportRows.length} miembros</div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                    <th className="px-5 py-3 font-medium">Miembro</th>
                    <th className="px-5 py-3 font-medium">Área</th>
                    <th className="px-5 py-3 font-medium">Pres.</th>
                    <th className="px-5 py-3 font-medium">Aus.</th>
                    <th className="px-5 py-3 font-medium">Tard.</th>
                    <th className="px-5 py-3 font-medium">Perm.</th>
                    <th className="px-5 py-3 font-medium">Total</th>
                    <th className="px-5 py-3 font-medium">% Asist.</th>
                  </tr>
                </thead>
                <tbody>
                  {reportRows.map((r) => (
                    <tr key={r.member.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">{r.member.apellido}, {r.member.nombre}</p>
                        <p className="text-xs text-gray-400">{ROLES[r.member.rol].label}</p>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{r.member.area}</td>
                      <td className="px-5 py-3 text-green-700 font-semibold">{r.pres}</td>
                      <td className="px-5 py-3 text-red-600 font-semibold">{r.aus}</td>
                      <td className="px-5 py-3 text-amber-600 font-semibold">{r.tard}</td>
                      <td className="px-5 py-3 text-blue-600 font-semibold">{r.perm}</td>
                      <td className="px-5 py-3 font-semibold text-gray-800">{r.total}</td>
                      <td className="px-5 py-3 font-bold text-gray-900">{r.pctAsist === null ? '—' : `${r.pctAsist}%`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Vista exclusiva para impresión / PDF */}
      {tab === 'asistencias' && reportRows && (
        <div className="hidden print:block p-8">
          <div className="flex items-center gap-5 border-b-4 border-purple-950 pb-4 mb-6">
            <img src="/logo-nazareno.png" alt="Logo" className="w-16 h-16 object-contain" />
            <div>
              <p className="text-xs font-bold text-purple-950 uppercase tracking-wide">Institución Educativa Privada</p>
              <p className="text-xl font-extrabold text-purple-950">El Nazareno</p>
            </div>
            <div className="ml-auto text-right text-xs text-gray-500">
              <p>Período: {formatFecha(desde)} — {formatFecha(hasta)}</p>
              <p>Generado: {generatedAt && formatFullDate(generatedAt)}</p>
            </div>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-4">Reporte de Asistencias</h1>

          <div className="grid grid-cols-4 gap-3 mb-3">
            <SummaryCard icon={CheckCircle2} value={totals.pres} label="Presentes" bg="bg-green-50" text="text-green-700" />
            <SummaryCard icon={XCircle} value={totals.aus} label="Ausentes" bg="bg-red-50" text="text-red-600" />
            <SummaryCard icon={Clock} value={totals.tard} label="Tardanzas" bg="bg-amber-50" text="text-amber-600" />
            <SummaryCard icon={FileCheck} value={totals.perm} label="Permisos" bg="bg-blue-50" text="text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 mb-5">
            Total de registros: {totals.total} · {reportRows.length} miembros · Asistencia promedio: {asistenciaPromedio}%
          </p>

          <h2 className="font-bold text-purple-950 mb-2 text-sm">Detalle por Miembro</h2>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-purple-950 text-white text-left">
                <th className="p-2">#</th>
                <th className="p-2">Apellidos y Nombres</th>
                <th className="p-2">DNI</th>
                <th className="p-2">Cargo</th>
                <th className="p-2">Área</th>
                <th className="p-2">Pres.</th>
                <th className="p-2">Aus.</th>
                <th className="p-2">Tard.</th>
                <th className="p-2">Perm.</th>
                <th className="p-2">Total</th>
                <th className="p-2">% Asist.</th>
              </tr>
            </thead>
            <tbody>
              {reportRows.map((r, i) => (
                <tr key={r.member.id} className="border-b border-gray-200">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">{r.member.apellido.toUpperCase()}, {r.member.nombre.toUpperCase()}</td>
                  <td className="p-2">{r.member.dni}</td>
                  <td className="p-2">{ROLES[r.member.rol].label}</td>
                  <td className="p-2">{r.member.area}</td>
                  <td className="p-2">{r.pres}</td>
                  <td className="p-2">{r.aus}</td>
                  <td className="p-2">{r.tard}</td>
                  <td className="p-2">{r.perm}</td>
                  <td className="p-2 font-semibold">{r.total}</td>
                  <td className="p-2 font-bold">{r.pctAsist === null ? '—' : `${r.pctAsist}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

function SummaryCard({ icon: Icon, value, label, bg, text }) {
  return (
    <div className={`rounded-xl p-4 ${bg}`}>
      <div className="flex items-center gap-2">
        <Icon size={18} className={text} />
        <span className={`text-2xl font-extrabold ${text}`}>{value}</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}
import { useState } from 'react'
import { Users, MapPin, Video, Clock, ChevronLeft, ChevronRight, X, Search } from 'lucide-react'
import { useMembers } from '../context/MembersContext'
import { AREAS } from '../data/mockMembers'
import { mockSchedule } from '../data/mockSchedule'
import { DIAS_SEMANA, getWeekDates, formatWeekLabel, formatFullDate, isSameDay } from '../utils/dates'
import ComingSoon from './ComingSoon'

const HOURS = Array.from({ length: 14 }, (_, i) => 7 + i)

export default function Calendario() {
  const { members } = useMembers()
  const practicantes = members.filter((m) => mockSchedule.some((s) => s.codigo === m.codigo))

  const [view, setView] = useState('practicas')
  const [weekOffset, setWeekOffset] = useState(0)
  const [search, setSearch] = useState('')
  const [areaFilter, setAreaFilter] = useState('TODAS')
  const [modalidadFilter, setModalidadFilter] = useState('TODAS')
  const [selectedDay, setSelectedDay] = useState(null)

  const weekDates = getWeekDates(weekOffset)
  const today = new Date()

  const term = search.toLowerCase()
  const filteredCodigos = practicantes
    .filter((m) => `${m.nombre} ${m.apellido}`.toLowerCase().includes(term))
    .filter((m) => areaFilter === 'TODAS' || m.area === areaFilter)
    .map((m) => m.codigo)

  const getDaySchedule = (diaKey) =>
    mockSchedule.filter(
      (s) => s.dia === diaKey && filteredCodigos.includes(s.codigo) && (modalidadFilter === 'TODAS' || s.modalidad === modalidadFilter)
    )

  const weekSchedule = DIAS_SEMANA.flatMap((d) => getDaySchedule(d.key))
  const presencialCodigos = new Set(weekSchedule.filter((s) => s.modalidad === 'PRESENCIAL').map((s) => s.codigo))
  const virtualCodigos = new Set(weekSchedule.filter((s) => s.modalidad === 'VIRTUAL').map((s) => s.codigo))
  const totalCodigos = new Set(weekSchedule.map((s) => s.codigo))
  const diasActivos = DIAS_SEMANA.filter((d) => getDaySchedule(d.key).length > 0).length

  const memberByCodigo = (codigo) => members.find((m) => m.codigo === codigo)

  return (
    <>
      <div className="flex items-start justify-between mb-1">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendario</h1>
          <p className="text-sm text-gray-400">Prácticas de practicantes, reuniones, tareas, eventos y cronogramas</p>
        </div>
        <div className="flex gap-1 bg-white rounded-lg border border-gray-200 p-1">
          <button onClick={() => setView('practicas')} className={`px-4 py-1.5 text-sm font-medium rounded-md ${view === 'practicas' ? 'bg-purple-950 text-white' : 'text-gray-500'}`}>Prácticas</button>
          <button onClick={() => setView('eventos')} className={`px-4 py-1.5 text-sm font-medium rounded-md ${view === 'eventos' ? 'bg-purple-950 text-white' : 'text-gray-500'}`}>Eventos</button>
        </div>
      </div>

      {view === 'eventos' ? (
        <div className="mt-6"><ComingSoon title="Eventos" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 mb-5">
            <StatCard icon={Users} value={totalCodigos.size} label="Total practicantes" />
            <StatCard icon={MapPin} value={presencialCodigos.size} label="Presenciales" iconClass="text-green-600" />
            <StatCard icon={Video} value={virtualCodigos.size} label="Virtuales" iconClass="text-blue-600" />
            <StatCard icon={Clock} value={diasActivos} label="Días activos" iconClass="text-amber-600" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-full px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Presencial
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-full px-3 py-1.5">
                <Video size={12} className="text-blue-600" /> Virtual
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar practicante..." className="border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm w-52" />
              </div>
              <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
                <option value="TODAS">Área</option>
                {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              <select value={modalidadFilter} onChange={(e) => setModalidadFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
                <option value="TODAS">Modalidad</option>
                <option value="PRESENCIAL">Presencial</option>
                <option value="VIRTUAL">Virtual</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setWeekOffset((o) => o - 1)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"><ChevronLeft size={16} /></button>
              <button onClick={() => setWeekOffset((o) => o + 1)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"><ChevronRight size={16} /></button>
              <span className="font-semibold text-gray-800 text-sm">{formatWeekLabel(weekDates)}</span>
            </div>
            <button onClick={() => setWeekOffset(0)} className="text-sm font-medium border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50">Hoy</button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-100">
                <div />
                {weekDates.map((d) => {
                  const entries = getDaySchedule(d.key)
                  const presCount = entries.filter((e) => e.modalidad === 'PRESENCIAL').length
                  const virtCount = entries.filter((e) => e.modalidad === 'VIRTUAL').length
                  const isToday = isSameDay(d.date, today)
                  const horaInicio = entries.length ? entries.reduce((min, e) => (e.horaInicio < min ? e.horaInicio : min), entries[0].horaInicio) : null
                  const horaFin = entries.length ? entries.reduce((max, e) => (e.horaFin > max ? e.horaFin : max), entries[0].horaFin) : null

                  return (
                    <button
                      key={d.key}
                      onClick={() => setSelectedDay(d)}
                      className={`text-left px-3 py-3 border-l border-gray-100 hover:bg-gray-50 ${isToday ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-gray-500">{d.label.toUpperCase()}</span>
                        <span className={`text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-gray-700'}`}>
                          {d.date.getDate()}
                        </span>
                      </div>
                      {entries.length === 0 ? (
                        <>
                          <p className="flex items-center gap-1 text-xs text-gray-400"><Users size={12} /> 0 Practicantes</p>
                          <p className="text-xs italic text-gray-400 mt-1">Día libre</p>
                        </>
                      ) : (
                        <div className="space-y-0.5 text-xs text-gray-500">
                          <p className="flex items-center gap-1"><Users size={12} /> {entries.length} Practicantes</p>
                          <p className="flex items-center gap-1"><MapPin size={12} className="text-green-600" /> {presCount} Presenciales</p>
                          <p className="flex items-center gap-1"><Video size={12} className="text-blue-600" /> {virtCount} Virtuales</p>
                          <p className="flex items-center gap-1"><Clock size={12} /> {horaInicio} - {horaFin}</p>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="grid grid-cols-[60px_repeat(7,1fr)] max-h-[420px] overflow-y-auto">
                <div>
                  {HOURS.map((h) => (
                    <div key={h} className="h-14 flex items-start justify-end pr-2 text-xs text-gray-400 border-t border-gray-50">
                      {String(h).padStart(2, '0')}:00
                    </div>
                  ))}
                </div>
                {weekDates.map((d) => {
                  const isToday = isSameDay(d.date, today)
                  return (
                    <div
                      key={d.key}
                      onClick={() => setSelectedDay(d)}
                      className={`relative border-l border-gray-100 cursor-pointer ${isToday ? 'bg-blue-50/40' : ''}`}
                    >
                      {HOURS.map((h) => <div key={h} className="h-14 border-t border-gray-50" />)}
                      {isToday && <NowLine />}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {selectedDay && (
            <DayDetailPanel
              day={selectedDay}
              entries={getDaySchedule(selectedDay.key)}
              memberByCodigo={memberByCodigo}
              onClose={() => setSelectedDay(null)}
            />
          )}
        </>
      )}
    </>
  )
}

function StatCard({ icon: Icon, value, label, iconClass = 'text-gray-500' }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
      <Icon size={20} className={iconClass} />
      <div>
        <p className="text-xl font-extrabold text-gray-900 leading-none">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{label}</p>
      </div>
    </div>
  )
}

function NowLine() {
  const now = new Date()
  const startHour = HOURS[0]
  const minutesFromStart = (now.getHours() - startHour) * 60 + now.getMinutes()
  if (minutesFromStart < 0 || minutesFromStart > HOURS.length * 60) return null
  const top = (minutesFromStart / 60) * 56

  return (
    <div className="absolute left-0 right-0 flex items-center pointer-events-none" style={{ top: `${top}px` }}>
      <div className="w-1.5 h-1.5 rounded-full bg-red-500 -ml-0.5" />
      <div className="flex-1 h-px bg-red-500" />
    </div>
  )
}

function DayDetailPanel({ day, entries, memberByCodigo, onClose }) {
  const presenciales = entries.filter((e) => e.modalidad === 'PRESENCIAL')
  const virtuales = entries.filter((e) => e.modalidad === 'VIRTUAL')
  const horaInicio = entries.length ? entries.reduce((min, e) => (e.horaInicio < min ? e.horaInicio : min), entries[0].horaInicio) : null
  const horaFin = entries.length ? entries.reduce((max, e) => (e.horaFin > max ? e.horaFin : max), entries[0].horaFin) : null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-xl overflow-y-auto p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Calendario · Prácticas</p>
            <h2 className="text-lg font-bold text-gray-900">Detalle de horario de Practicantes</h2>
            <p className="text-sm text-gray-500 mt-1">{formatFullDate(day.date)} · {entries.length} Practicantes</p>
            {entries.length > 0 && (
              <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-1"><Clock size={12} /> {horaInicio} - {horaFin}</p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        {entries.length === 0 && <p className="text-sm text-gray-400 py-10 text-center">No hay practicantes programados este día.</p>}

        {presenciales.length > 0 && (
          <DayGroup title="PRESENCIAL" count={presenciales.length} dotClass="bg-green-500" entries={presenciales} memberByCodigo={memberByCodigo} badgeClass="bg-green-100 text-green-700" badgeDot="bg-green-500" badgeLabel="Presencial" />
        )}
        {virtuales.length > 0 && (
          <DayGroup title="VIRTUAL" count={virtuales.length} dotClass="bg-blue-500" entries={virtuales} memberByCodigo={memberByCodigo} badgeClass="bg-blue-100 text-blue-700" badgeDot="bg-blue-500" badgeLabel="Virtual" />
        )}
      </div>
    </div>
  )
}

function DayGroup({ title, count, dotClass, entries, memberByCodigo, badgeClass, badgeDot, badgeLabel }) {
  return (
    <div className="mb-6">
      <p className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-3">
        <span className={`w-2 h-2 rounded-full ${dotClass}`} /> {title} ({count})
      </p>
      <div className="space-y-3">
        {entries.map((e) => {
          const m = memberByCodigo(e.codigo)
          if (!m) return null
          return (
            <div key={e.id} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-900 flex items-center justify-center text-xs font-bold shrink-0">
                {m.nombre.charAt(0)}{m.apellido.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900 uppercase truncate">{m.nombre} {m.apellido}</p>
                  <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${badgeClass}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${badgeDot}`} /> {badgeLabel}
                  </span>
                </div>
                <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5"><Clock size={12} /> {e.horaInicio} - {e.horaFin}</p>
                <p className="flex items-center gap-1 text-xs text-gray-400"><MapPin size={12} /> Área: {m.area}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
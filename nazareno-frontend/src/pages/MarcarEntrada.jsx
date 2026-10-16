import { useState } from 'react'
import { CheckCircle2, Clock, PenLine, ScanLine, Search, LogIn } from 'lucide-react'
import { useMembers } from '../context/MembersContext'
import { useAuth, useCurrentUser } from '../context/AuthContext'
import { useAttendance, todayISO } from '../context/AttendanceContext'

function horaSalidaAutomatica(horaEntrada) {
  const [hora, minuto] = horaEntrada.split(':').map(Number)
  const minutosTotales = (hora * 60 + minuto + 4 * 60) % (24 * 60)
  return `${String(Math.floor(minutosTotales / 60)).padStart(2, '0')}:${String(minutosTotales % 60).padStart(2, '0')}`
}

export default function MarcarEntrada() {
  const { members } = useMembers()
  const { records, markEntrada, getTodayRecord } = useAttendance()
  const { user } = useAuth()
  const isAdmin = user?.rol === 'ADMIN'
  const currentUser = useCurrentUser()

  const [codigoInput, setCodigoInput] = useState('')
  const [scanFeedback, setScanFeedback] = useState(null)
  const [firmaGuardada, setFirmaGuardada] = useState(false)
  const [search, setSearch] = useState('')

  const myRecord = currentUser ? getTodayRecord(currentUser.id) : null
  const entradasHoy = records.filter((r) => r.fecha === todayISO()).length

  const handleScan = async (e) => {
    e.preventDefault()
    const found = members.find((m) => m.codigo.toLowerCase() === codigoInput.trim().toLowerCase())
    if (!found) {
      setScanFeedback({ ok: false, text: 'Código no encontrado.' })
    } else {
      const existing = getTodayRecord(found.id)
      if (existing) {
        setScanFeedback({ ok: false, text: `${found.nombre} ${found.apellido} ya marcó entrada hoy (${existing.horaEntrada}).` })
      } else {
        try {
          const record = await markEntrada(found.id, 'CODIGO')
          setScanFeedback({ ok: true, text: `Entrada registrada para ${found.nombre} ${found.apellido} (${record.horaEntrada}).` })
        } catch (err) {
          setScanFeedback({ ok: false, text: err.message })
        }
      }
    }
    setCodigoInput('')
  }

  const filteredMembers = members.filter((m) => {
    const term = search.toLowerCase()
    return `${m.nombre} ${m.apellido}`.toLowerCase().includes(term) || m.codigo.toLowerCase().includes(term) || m.area.toLowerCase().includes(term)
  })

  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-gray-900">Marcar entrada</h1>
        <span className="flex items-center gap-1.5 text-xs font-semibold bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
          <CheckCircle2 size={14} />
          {entradasHoy} entradas hoy
        </span>
      </div>
      <p className="text-sm text-gray-400 mb-6">
        {new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900">Mi entrada</h2>
            <p className="text-sm text-gray-400 mb-4">Marca tu asistencia de ingreso con tu cuenta personal.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => currentUser && markEntrada(currentUser.id, 'MANUAL')}
                disabled={!!myRecord}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg"
              >
                <LogIn size={18} />
                {myRecord ? `Entrada ${myRecord.horaEntrada}` : 'MARCAR ENTRADA'}
              </button>
              <div
                aria-live="polite"
                className="flex items-center justify-center gap-2 bg-amber-100 text-amber-800 font-semibold py-3 rounded-lg"
              >
                <Clock size={18} />
                {!myRecord
                  ? 'SALIDA AUTOMÁTICA'
                  : myRecord.horaSalida
                    ? `SALIDA ${myRecord.horaSalida}`
                    : `SALIDA AUTOMÁTICA ${horaSalidaAutomatica(myRecord.horaEntrada)}`}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {myRecord && !myRecord.horaSalida
                ? 'La salida se registrará automáticamente al completar 4 horas desde la entrada.'
                : 'La salida se registra automáticamente al completar 4 horas desde la entrada.'}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-1">
              <PenLine size={18} className="text-purple-800" />
              <h2 className="font-bold text-gray-900">Mi firma</h2>
            </div>
            <p className="text-sm text-gray-400 mb-3">Registra tu firma digital para que se incluya automáticamente en tus marcaciones.</p>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-purple-800 cursor-pointer hover:underline">
              {firmaGuardada ? <><CheckCircle2 size={16} /> Firma guardada</> : 'Subir firma digital'}
              <input type="file" accept="image/*" className="hidden" onChange={() => setFirmaGuardada(true)} />
            </label>
          </div>

          {isAdmin && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-1">
                <ScanLine size={18} className="text-purple-800" />
                <h2 className="font-bold text-gray-900">Lector de código de barra</h2>
              </div>
              <p className="text-sm text-gray-400 mb-3">El lector puede escanear el código y confirmar con Enter.</p>
              <form onSubmit={handleScan} className="flex gap-2">
                <input
                  autoFocus
                  value={codigoInput}
                  onChange={(e) => setCodigoInput(e.target.value)}
                  placeholder="Escanea o escribe el código..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-800"
                />
                <button type="submit" className="bg-purple-950 hover:bg-purple-900 text-white text-sm font-semibold px-4 py-2.5 rounded-lg">
                  Marcar con código
                </button>
              </form>
              {scanFeedback && (
                <p className={`text-sm mt-2 ${scanFeedback.ok ? 'text-green-700' : 'text-red-600'}`}>{scanFeedback.text}</p>
              )}
            </div>
          )}

          {isAdmin && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-bold text-gray-900 mb-1">Marcación manual</h2>
              <p className="text-sm text-gray-400 mb-3">Busca a la persona y registra su entrada.</p>
              <div className="relative mb-3">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nombre, código o área..."
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-800"
                />
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {filteredMembers.map((m) => {
                  const rec = getTodayRecord(m.id)
                  return (
                    <div key={m.id} className="flex items-center justify-between py-2.5">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{m.nombre} {m.apellido}</p>
                        <p className="text-xs text-gray-400">{m.codigo} · {m.area}</p>
                      </div>
                      {rec ? (
                        <span className="text-xs text-green-700 font-medium flex items-center gap-1">
                          <CheckCircle2 size={14} /> {rec.horaEntrada}
                        </span>
                      ) : (
                        <button onClick={() => markEntrada(m.id, 'MANUAL')} className="text-xs font-semibold text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg">
                          Marcar entrada
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 h-fit">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={18} className="text-purple-800" />
            <h2 className="font-bold text-gray-900">Marcas de hoy</h2>
          </div>
          <p className="text-sm text-gray-400 mb-4">Registros de entrada disponibles.</p>
          {records.filter((r) => r.fecha === todayISO()).length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Aún no hay marcas registradas.</p>
          ) : (
            <div className="space-y-3">
              {records.filter((r) => r.fecha === todayISO()).map((r) => {
                const member = members.find((m) => m.id === r.memberId)
                if (!member) return null
                return (
                  <div key={r.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{member.nombre} {member.apellido}</p>
                      <p className="text-xs text-gray-400">{member.area}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {r.horaEntrada}{r.horaSalida
                        ? ` – ${r.horaSalida}`
                        : ` – salida prevista ${horaSalidaAutomatica(r.horaEntrada)}`}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
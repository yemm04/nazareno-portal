function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function toISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const DIA_BY_JS_DAY = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB']

function eachDateInRange(desdeISO, hastaISO) {
  const dates = []
  const current = new Date(`${desdeISO}T00:00:00`)
  const end = new Date(`${hastaISO}T00:00:00`)
  while (current <= end) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  return dates
}

function matchesHorario(entry, horarioFilter) {
  if (horarioFilter === 'TODOS') return true
  const turno = toMinutes(entry.horaInicio) < toMinutes('13:00') ? 'MANANA' : 'TARDE'
  return turno === horarioFilter
}

const GRACE_MINUTES = 10 // tolerancia antes de contar como tardanza

// Usa el horario semanal de mockSchedule (el mismo del Calendario) como
// "días esperados" por miembro, y las marcas reales de AttendanceContext
// para saber si llegó, llegó tarde, o faltó.
export function buildAttendanceReport({ members, schedule, records, desde, hasta, areaFilter, horarioFilter }) {
  const dateRange = eachDateInRange(desde, hasta)
  const filteredMembers = members.filter((m) => areaFilter === 'TODAS' || m.area === areaFilter)

  return filteredMembers.map((member) => {
    const memberSchedule = schedule.filter((s) => s.codigo === member.codigo && matchesHorario(s, horarioFilter))
    let pres = 0, aus = 0, tard = 0
    const perm = 0 // sin módulo de permisos todavía — placeholder para cuando exista

    dateRange.forEach((date) => {
      const scheduled = memberSchedule.find((s) => s.dia === DIA_BY_JS_DAY[date.getDay()])
      if (!scheduled) return // no era un día esperado para este miembro, no cuenta en el total

      const record = records.find((r) => r.memberId === member.id && r.fecha === toISO(date))
      if (!record) {
        aus++
      } else if (toMinutes(record.horaEntrada) > toMinutes(scheduled.horaInicio) + GRACE_MINUTES) {
        tard++
      } else {
        pres++
      }
    })

    const total = pres + aus + tard + perm
    const pctAsist = total > 0 ? Math.round((pres / total) * 100) : null
    return { member, pres, aus, tard, perm, total, pctAsist }
  })
}
const HORA_LIMITE_MINUTOS = 9 * 60

function toMinutes(hora) {
  const [hours, minutes] = hora.split(':').map(Number)
  return hours * 60 + minutes
}

function matchesHorario(record, horarioFilter) {
  if (horarioFilter === 'TODOS') return true
  const turno = toMinutes(record.horaEntrada) < 13 * 60 ? 'MANANA' : 'TARDE'
  return turno === horarioFilter
}

// El reporte refleja únicamente marcajes reales registrados dentro del período.
export function buildAttendanceReport({ members, records, desde, hasta, areaFilter, horarioFilter }) {
  const filteredMembers = members.filter((member) => areaFilter === 'TODAS' || member.area === areaFilter)

  return filteredMembers.map((member) => {
    const memberRecords = records.filter((record) =>
      record.memberId === member.id &&
      record.fecha >= desde &&
      record.fecha <= hasta &&
      matchesHorario(record, horarioFilter)
    )
    const pres = memberRecords.length
    const tard = memberRecords.reduce(
      (minutes, record) => minutes + Math.max(0, toMinutes(record.horaEntrada) - HORA_LIMITE_MINUTOS),
      0
    )
    const aus = 0
    const perm = 0
    const total = pres + aus + perm
    const pctAsist = total > 0 ? Math.round((pres / total) * 100) : null

    return { member, pres, aus, tard, perm, total, pctAsist }
  })
}

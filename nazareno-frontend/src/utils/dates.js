export function formatFecha(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export const DIAS_SEMANA = [
  { key: 'LUN', label: 'Lun' },
  { key: 'MAR', label: 'Mar' },
  { key: 'MIE', label: 'Mié' },
  { key: 'JUE', label: 'Jue' },
  { key: 'VIE', label: 'Vie' },
  { key: 'SAB', label: 'Sáb' },
  { key: 'DOM', label: 'Dom' },
]

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const DIAS_LARGOS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function getWeekDates(weekOffset = 0) {
  const now = new Date()
  const currentDay = now.getDay() // 0 = domingo
  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay
  const monday = new Date(now)
  monday.setDate(now.getDate() + diffToMonday + weekOffset * 7)
  monday.setHours(0, 0, 0, 0)

  return DIAS_SEMANA.map((d, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    return { ...d, date }
  })
}

export function formatWeekLabel(weekDates) {
  const start = weekDates[0].date
  const end = weekDates[6].date
  if (start.getMonth() === end.getMonth()) {
    return `Semana del ${start.getDate()} - ${end.getDate()} de ${capitalize(MESES[start.getMonth()])}`
  }
  return `Semana del ${start.getDate()} de ${capitalize(MESES[start.getMonth()])} - ${end.getDate()} de ${capitalize(MESES[end.getMonth()])}`
}

export function formatFullDate(date) {
  return `${DIAS_LARGOS[date.getDay()]}, ${date.getDate()} de ${capitalize(MESES[date.getMonth()])}`
}

export function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function firstOfMonthISO() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
}
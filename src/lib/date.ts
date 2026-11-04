const pad = (n: number) => String(n).padStart(2, '0')

export const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const parse = (s: string) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
export const today = () => ymd(new Date())
export const addDays = (s: string, n: number) => {
  const d = parse(s)
  d.setDate(d.getDate() + n)
  return ymd(d)
}

export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const longDate = (s: string) => {
  const d = parse(s)
  return `${WEEKDAYS[d.getDay()]} · ${d.getDate()} ${MONTHS[d.getMonth()]}`
}
export const shortDate = (s: string) => {
  const d = parse(s)
  return `${WEEKDAYS[d.getDay()].slice(0, 3)} ${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`
}

export function dueLabel(s: string): { text: string; late: boolean } {
  const t = today()
  if (s === t) return { text: 'Today', late: false }
  if (s === addDays(t, 1)) return { text: 'Tomorrow', late: false }
  if (s < t) return { text: `Overdue · ${shortDate(s)}`, late: true }
  return { text: shortDate(s), late: false }
}

export function greeting(d = new Date()) {
  const h = d.getHours()
  if (h < 5) return 'Rest well'
  if (h < 11) return 'Good morning'
  if (h < 17) return 'Hello'
  return 'Good evening'
}

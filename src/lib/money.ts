import type { Budget, Expense } from './types'
import { addDays, parse, today, ymd } from './date'

/** First and last day of the budget period that contains `day`. Weeks start on Monday. */
export function periodRange(period: Budget['period'], day = today()): [string, string] {
  const d = parse(day)
  if (period === 'day') return [day, day]
  if (period === 'week') {
    const start = addDays(day, -((d.getDay() + 6) % 7))
    return [start, addDays(start, 6)]
  }
  return [ymd(new Date(d.getFullYear(), d.getMonth(), 1)), ymd(new Date(d.getFullYear(), d.getMonth() + 1, 0))]
}

export function budgetStatus(budget: Budget, expenses: Expense[], day = today()) {
  const [start, end] = periodRange(budget.period, day)
  const inPeriod = expenses.filter((e) => e.date >= start && e.date <= end)
  const spent = round(inPeriod.reduce((sum, e) => sum + e.amount, 0))
  const left = round(budget.amount - spent)
  const daysLeft = Math.round((parse(end).getTime() - parse(day).getTime()) / 86400000) + 1
  const perDay = budget.period === 'day' ? left : round(left / daysLeft)
  const spentToday = round(inPeriod.filter((e) => e.date === day).reduce((s, e) => s + e.amount, 0))
  return { start, end, inPeriod, spent, left, over: left < 0, daysLeft, perDay, spentToday, used: budget.amount > 0 ? spent / budget.amount : 0 }
}

const round = (n: number) => Math.round(n * 100) / 100

export function money(n: number, currency = '€') {
  const abs = Math.abs(n)
  const s = abs % 1 === 0 ? abs.toFixed(0) : abs.toFixed(2).replace('.', ',')
  return `${n < 0 ? '−' : ''}${s} ${currency}`
}

/** Accepts "12", "12,50" or "12.50". */
export function parseAmount(s: string) {
  const n = Number(s.replace(',', '.').replace(/[^\d.]/g, ''))
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : null
}

export const PERIOD_LABEL = { day: 'today', week: 'this week', month: 'this month' } as const

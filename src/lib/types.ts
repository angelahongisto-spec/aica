export type Category = 'spirit' | 'body' | 'home' | 'goals'

export const CATEGORIES: { id: Category; label: string; hint: string }[] = [
  { id: 'spirit', label: 'Spirit', hint: 'yoga, journal, rest' },
  { id: 'body', label: 'Body', hint: 'training, food' },
  { id: 'home', label: 'Home', hint: 'errands, chores' },
  { id: 'goals', label: 'Goals', hint: 'work, money, dreams' },
]

export interface Task {
  id: string
  title: string
  category: Category
  due: string | null // YYYY-MM-DD
  done: boolean
  doneAt: string | null
  points: number
}

export interface CalEvent {
  id: string
  title: string
  category: Category
  date: string // first occurrence, YYYY-MM-DD
  time: string // HH:MM or '' for all day
  repeat: 'none' | 'weekly'
}

export interface ShopItem {
  id: string
  text: string
  done: boolean
}

export type Mood = 'heavy' | 'tender' | 'calm' | 'good' | 'glowing'

/** One day's rituals: a morning focus, an evening reflection. */
export interface DayLog {
  focus?: string
  morningDone?: boolean
  mood?: Mood
  gratitude?: string
  eveningDone?: boolean
}

export type BudgetPeriod = 'day' | 'week' | 'month'
export type SpendCategory = 'food' | 'home' | 'selfcare' | 'fun' | 'travel' | 'other'

export const SPEND_CATEGORIES: { id: SpendCategory; label: string; color: string }[] = [
  { id: 'food', label: 'Food', color: 'var(--body)' },
  { id: 'home', label: 'Home', color: 'var(--home)' },
  { id: 'selfcare', label: 'Self-care', color: 'var(--spirit)' },
  { id: 'fun', label: 'Fun', color: 'var(--goals)' },
  { id: 'travel', label: 'Travel', color: 'var(--muted)' },
  { id: 'other', label: 'Other', color: 'var(--gold)' },
]

export interface Expense {
  id: string
  amount: number
  note: string
  category: SpendCategory
  date: string // YYYY-MM-DD
}

export interface Budget {
  period: BudgetPeriod
  amount: number
  currency: string
}

export interface GoalStep {
  id: string
  text: string
  done: boolean
}

/** A goal and its roots: each "why" digs one level deeper toward the real reason. */
export interface Goal {
  id: string
  title: string
  area: Category
  whys: string[]
  steps: GoalStep[]
  createdAt: string
}

export type ThemeMode = 'light' | 'dark' | 'system'

export interface Settings {
  name: string
  theme: ThemeMode
}

export interface AppState {
  version: 1
  tasks: Task[]
  events: CalEvent[]
  shop: ShopItem[]
  recentShop: string[]
  light: number // points earned by finishing things
  days: Record<string, DayLog> // YYYY-MM-DD -> rituals
  budget: Budget | null
  expenses: Expense[]
  goals: Goal[]
  settings: Settings
}

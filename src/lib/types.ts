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

export interface AppState {
  version: 1
  tasks: Task[]
  events: CalEvent[]
  shop: ShopItem[]
  recentShop: string[]
  light: number // points earned by finishing things
  days: Record<string, DayLog> // YYYY-MM-DD -> rituals
}

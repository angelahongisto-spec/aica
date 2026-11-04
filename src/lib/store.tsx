import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AppState, CalEvent, Category, Task } from './types'
import { parse, today } from './date'

/*
 * Local-first store. Everything is saved to this device right away (localStorage),
 * so the app works offline. Cloud sync between iPhone and Mac plugs in here later
 * (v1: Supabase), without the screens needing to change.
 */

const KEY = 'aica:v1'

const empty: AppState = { version: 1, tasks: [], events: [], shop: [], recentShop: [], light: 0 }

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...empty, ...JSON.parse(raw) }
  } catch {
    /* storage unavailable: start fresh */
  }
  return seed()
}

// A gentle first run so the app never opens empty. Items are marked "Try:" and can be deleted.
function seed(): AppState {
  const t = today()
  return {
    ...empty,
    tasks: [
      { id: id(), title: 'Try: tap the circle to finish me', category: 'spirit', due: t, done: false, doneAt: null, points: 10 },
      { id: id(), title: 'Try: tap × to delete me', category: 'home', due: t, done: false, doneAt: null, points: 5 },
    ],
    events: [{ id: id(), title: 'Yoga', category: 'spirit', date: t, time: '18:00', repeat: 'weekly' }],
    shop: [
      { id: id(), text: 'Oat milk', done: false },
      { id: id(), text: 'Jasmine tea', done: false },
    ],
    recentShop: ['Avocados', 'Blueberries', 'Matcha'],
  }
}

export const id = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4)

export const POINTS: Record<Category, number> = { spirit: 10, body: 15, home: 5, goals: 20 }

/** Events that happen on a given day, including weekly repeats. */
export function eventsOn(events: CalEvent[], day: string) {
  const wd = parse(day).getDay()
  return events
    .filter((e) => e.date === day || (e.repeat === 'weekly' && e.date <= day && parse(e.date).getDay() === wd))
    .sort((a, b) => (a.time || '99').localeCompare(b.time || '99'))
}

function useAppState() {
  const [state, setState] = useState<AppState>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  const update = useCallback((fn: (s: AppState) => AppState) => setState((s) => fn(s)), [])

  return useMemo(
    () => ({
      state,
      addTask: (title: string, category: Category, due: string | null) =>
        update((s) => ({ ...s, tasks: [...s.tasks, { id: id(), title, category, due, done: false, doneAt: null, points: POINTS[category] }] })),
      toggleTask: (taskId: string) =>
        update((s) => {
          const t = s.tasks.find((x) => x.id === taskId)
          if (!t) return s
          const done = !t.done
          const tasks: Task[] = s.tasks.map((x) => (x.id === taskId ? { ...x, done, doneAt: done ? today() : null } : x))
          return { ...s, tasks, light: Math.max(0, s.light + (done ? t.points : -t.points)) }
        }),
      deleteTask: (taskId: string) => update((s) => ({ ...s, tasks: s.tasks.filter((x) => x.id !== taskId) })),
      clearDone: () => update((s) => ({ ...s, tasks: s.tasks.filter((x) => !x.done) })),
      saveEvent: (ev: CalEvent) =>
        update((s) => ({ ...s, events: s.events.some((x) => x.id === ev.id) ? s.events.map((x) => (x.id === ev.id ? ev : x)) : [...s.events, ev] })),
      deleteEvent: (evId: string) => update((s) => ({ ...s, events: s.events.filter((x) => x.id !== evId) })),
      addShop: (text: string) =>
        update((s) =>
          s.shop.some((x) => !x.done && x.text.toLowerCase() === text.toLowerCase())
            ? s
            : { ...s, shop: [...s.shop, { id: id(), text, done: false }] },
        ),
      toggleShop: (itemId: string) => update((s) => ({ ...s, shop: s.shop.map((x) => (x.id === itemId ? { ...x, done: !x.done } : x)) })),
      deleteShop: (itemId: string) => update((s) => ({ ...s, shop: s.shop.filter((x) => x.id !== itemId) })),
      clearBasket: () =>
        update((s) => {
          const bought = s.shop.filter((x) => x.done).map((x) => x.text)
          const recent = [...bought, ...s.recentShop].filter((v, i, a) => a.findIndex((z) => z.toLowerCase() === v.toLowerCase()) === i).slice(0, 14)
          return { ...s, shop: s.shop.filter((x) => !x.done), recentShop: recent }
        }),
    }),
    [state, update],
  )
}

type Store = ReturnType<typeof useAppState>
const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useAppState()
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore must be used inside StoreProvider')
  return s
}

import { Lotus } from './ui'

export type View = 'today' | 'calendar' | 'ask' | 'lists' | 'me' | 'rituals' | 'budget' | 'goals' | 'settings'
type Tab = 'today' | 'calendar' | 'lists' | 'me'

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d={d} /></svg>
)

const ICONS: Record<Tab, string> = {
  today: 'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M5 19l1.4-1.4M17.6 6.4L19 5',
  calendar: 'M7 5h10a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4zM8 3v4M16 3v4M3 10h18',
  lists: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
  me: 'M12 21c5-3 8-6.5 8-11a4.5 4.5 0 0 0-8-2.8A4.5 4.5 0 0 0 4 10c0 4.5 3 8 8 11z',
}

export function TabBar({ view, go }: { view: View; go: (v: View) => void }) {
  const inMe = ['me', 'rituals', 'budget', 'goals', 'settings'].includes(view)
  const tab = (v: Tab, label: string) => (
    <button className="tab" aria-current={view === v || (v === 'me' && inMe) ? 'page' : undefined} onClick={() => go(v)}>
      <Icon d={ICONS[v]} />
      {label}
    </button>
  )
  return (
    <nav className="tabs" aria-label="Main">
      {tab('today', 'Today')}
      {tab('calendar', 'Calendar')}
      <button className="tab ask" aria-label="Ask AiCA" aria-current={view === 'ask' ? 'page' : undefined} onClick={() => go('ask')}>
        <Lotus size={30} />
      </button>
      {tab('lists', 'Lists')}
      {tab('me', 'Me')}
    </nav>
  )
}

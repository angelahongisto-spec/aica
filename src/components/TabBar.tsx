import { Lotus } from './ui'

export type View = 'today' | 'calendar' | 'ask' | 'lists' | 'rituals'

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d={d} /></svg>
)

const ICONS: Record<Exclude<View, 'ask'>, string> = {
  today: 'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M5 19l1.4-1.4M17.6 6.4L19 5',
  calendar: 'M7 5h10a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4zM8 3v4M16 3v4M3 10h18',
  lists: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
  rituals: 'M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z',
}

export function TabBar({ view, go }: { view: View; go: (v: View) => void }) {
  const tab = (v: Exclude<View, 'ask'>, label: string) => (
    <button className="tab" aria-current={view === v ? 'page' : undefined} onClick={() => go(v)}>
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
      {tab('rituals', 'Rituals')}
    </nav>
  )
}

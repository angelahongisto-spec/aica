import { useStore } from '../lib/store'
import { levelFor } from '../lib/spirit'
import { budgetStatus, money, PERIOD_LABEL } from '../lib/money'
import { today } from '../lib/date'
import { Lotus } from '../components/ui'
import type { View } from '../components/TabBar'

export function Me({ go }: { go: (v: View) => void }) {
  const { state } = useStore()
  const lv = levelFor(state.light)
  const log = state.days[today()] ?? {}
  const st = state.budget ? budgetStatus(state.budget, state.expenses) : null
  const openSteps = state.goals.reduce((n, g) => n + g.steps.filter((s) => !s.done).length, 0)

  const tile = (v: View, eyebrow: string, title: string, detail: string, tone: string) => (
    <button className={`tile ${tone}`} onClick={() => go(v)}>
      <span className="eyebrow">{eyebrow}</span>
      <span className="tile-title">{title}</span>
      <span className="tile-detail">{detail}</span>
    </button>
  )

  return (
    <>
      <header>
        <div className="eyebrow">Your sanctuary</div>
        <h1>{state.settings.name || 'Me'}</h1>
      </header>

      <button className="level" onClick={() => go('rituals')} style={{ border: 0, textAlign: 'left', width: '100%' }}>
        <span style={{ color: 'var(--gold)' }}><Lotus size={60} filled /></span>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span className="eyebrow">Level {lv.level}</span>
          <span style={{ fontFamily: 'var(--f-display)', fontSize: 24 }}>{lv.name}</span>
          <div className="bar"><i style={{ width: `${Math.round(lv.progress * 100)}%` }} /></div>
          <span className="muted" style={{ fontSize: 12 }}>{state.light} light</span>
        </div>
      </button>

      <div className="tiles">
        {tile('budget', 'Budget', st ? `${money(Math.abs(st.left), state.budget!.currency)}${st.over ? ' over' : ' left'}` : 'Set a budget',
          st ? `${PERIOD_LABEL[state.budget!.period]}` : 'Day, week or month', st?.over ? 'tone-over' : 'tone-home')}
        {tile('goals', 'Goals', state.goals.length ? `${state.goals.length} ${state.goals.length === 1 ? 'goal' : 'goals'}` : 'Find your roots',
          state.goals.length ? `${openSteps} ${openSteps === 1 ? 'step' : 'steps'} waiting` : 'Why you want what you want', 'tone-goals')}
        {tile('rituals', 'Rituals', log.eveningDone ? 'Day closed' : log.morningDone ? 'Morning done' : 'Begin softly', 'Morning, midday, evening', 'tone-spirit')}
        {tile('settings', 'Settings', 'Make it yours', 'Light, dark, reminders', 'tone-body')}
      </div>
    </>
  )
}

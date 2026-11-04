import { useStore } from '../lib/store'
import { LEVELS, levelFor } from '../lib/spirit'
import { addDays, today } from '../lib/date'
import { CATEGORIES } from '../lib/types'
import { Lotus } from '../components/ui'

export function Rituals() {
  const { state } = useStore()
  const lv = levelFor(state.light)
  const weekAgo = addDays(today(), -6)
  const week = state.tasks.filter((x) => x.done && x.doneAt && x.doneAt >= weekAgo)
  const counts = CATEGORIES.map((c) => ({ ...c, n: week.filter((x) => x.category === c.id).length }))
  const max = Math.max(1, ...counts.map((c) => c.n))
  const lowest = counts.reduce((a, b) => (b.n < a.n ? b : a))

  return (
    <>
      <header>
        <div className="eyebrow">Your path</div>
        <h1>Rituals</h1>
      </header>

      <section className="level" aria-label="Your level">
        <span style={{ color: 'var(--gold)' }}><Lotus size={72} filled /></span>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span className="eyebrow" style={{ color: 'var(--gold)' }}>Level {lv.level}</span>
          <span style={{ fontFamily: 'var(--f-display)', fontSize: 24 }}>{lv.name}</span>
          <div className="bar" role="progressbar" aria-valuenow={Math.round(lv.progress * 100)} aria-valuemin={0} aria-valuemax={100}>
            <i style={{ width: `${Math.round(lv.progress * 100)}%` }} />
          </div>
          <span style={{ fontSize: 12, color: 'var(--night-muted)' }}>
            {lv.next ? `${state.light} / ${lv.next.at} light to ${lv.next.name}` : `${state.light} light. You are radiant.`}
          </span>
        </div>
      </section>

      <section className="sec">
        <h2>This week's balance</h2>
        <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {counts.map((c) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className={`t-${c.id}`} style={{ width: 56, fontSize: 13, fontWeight: 800 }}>{c.label}</span>
              <div style={{ flex: 1, height: 10, borderRadius: 9, background: 'var(--line)' }}>
                <div className={`c-${c.id}`} style={{ width: `${(c.n / max) * 100}%`, height: '100%', borderRadius: 9, background: 'currentColor', transition: 'width .4s' }} />
              </div>
              <span style={{ width: 24, textAlign: 'right', fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{c.n}</span>
            </div>
          ))}
          <p className={`quote t-${lowest.id}`} style={{ margin: 0, fontSize: 18 }}>
            {week.length ? `${lowest.label} could use a little light this week.` : 'Finish something today and watch your week bloom.'}
          </p>
        </div>
      </section>

      <section className="sec">
        <h2>The path</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 800 }} className="muted">
          {LEVELS.map((l, i) => <span key={l.name} className={i === lv.index ? 't-spirit' : undefined}>{l.name.split(' ')[0]}</span>)}
        </div>
        <div className="petals">
          {LEVELS.map((l, i) => <span key={l.name} style={{ background: i < lv.index ? 'var(--gold)' : i === lv.index ? 'var(--lotus)' : undefined }} />)}
        </div>
        <p className="muted" style={{ margin: 0, fontSize: 13 }}>Spirit +10 · Body +15 · Home +5 · Goals +20. Streaks and workouts arrive in v2.</p>
      </section>
    </>
  )
}

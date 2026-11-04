import { useEffect, useState } from 'react'
import { useStore } from '../lib/store'
import { today } from '../lib/date'
import type { Mood } from '../lib/types'

export const MOODS: { id: Mood; label: string; color: string }[] = [
  { id: 'heavy', label: 'Heavy', color: 'var(--goals)' },
  { id: 'tender', label: 'Tender', color: 'var(--lotus)' },
  { id: 'calm', label: 'Calm', color: 'var(--body)' },
  { id: 'good', label: 'Good', color: 'var(--home)' },
  { id: 'glowing', label: 'Glowing', color: 'var(--gold)' },
]

export type RitualTime = 'morning' | 'midday' | 'evening'
export const ritualTime = (h = new Date().getHours()): RitualTime => (h < 12 ? 'morning' : h < 17 ? 'midday' : 'evening')

/** Three slow breaths: 4 seconds in, 4 seconds out. */
export function Breath({ onDone }: { onDone?: () => void }) {
  const [phase, setPhase] = useState<'idle' | 'in' | 'out' | 'done'>('idle')
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (phase === 'idle' || phase === 'done') return
    const t = setTimeout(() => {
      if (phase === 'in') setPhase('out')
      else if (count + 1 >= 3) { setPhase('done'); onDone?.() }
      else { setCount(count + 1); setPhase('in') }
    }, 4000)
    return () => clearTimeout(t)
  }, [phase, count, onDone])

  if (phase === 'idle') return <button type="button" className="btn soft" onClick={() => { setCount(0); setPhase('in') }}>Take 3 slow breaths</button>
  if (phase === 'done') return <span className="t-body" style={{ fontWeight: 800 }}>Beautiful. You are here.</span>
  return (
    <div className="breath" aria-live="polite">
      <span className={`breath-orb ${phase}`} aria-hidden="true" />
      <span style={{ fontWeight: 800 }}>{phase === 'in' ? 'Breathe in…' : 'Breathe out…'}</span>
      <span className="muted" style={{ fontSize: 13 }}>{count + 1} of 3</span>
    </div>
  )
}

export function RitualCard({ when = ritualTime() }: { when?: RitualTime }) {
  const { state, logDay } = useStore()
  const t = today()
  const log = state.days[t] ?? {}
  const [focus, setFocus] = useState(log.focus ?? '')
  const [gratitude, setGratitude] = useState(log.gratitude ?? '')
  const [mood, setMood] = useState<Mood | undefined>(log.mood)

  if (when === 'morning') {
    if (log.morningDone) {
      return (
        <section className="ritual">
          <span className="eyebrow t-home">Morning ritual · done</span>
          <p className="quote" style={{ margin: 0, fontSize: 22 }}>{log.focus ? `Today I focus on ${log.focus}.` : 'You began your day with presence.'}</p>
        </section>
      )
    }
    return (
      <form className="ritual" onSubmit={(e) => { e.preventDefault(); logDay(t, { focus: focus.trim() || undefined, morningDone: true }) }}>
        <span className="eyebrow t-home">Morning ritual</span>
        <h2>Arrive in your day</h2>
        <Breath />
        <label className="field">What do you want to focus on today?
          <input value={focus} onChange={(e) => setFocus(e.target.value)} placeholder="e.g. being gentle with myself" />
        </label>
        <div><button className="btn">Begin my day · +10 light</button></div>
      </form>
    )
  }

  if (when === 'midday') {
    return (
      <section className="ritual">
        <span className="eyebrow t-body">Midday pause</span>
        <h2>Come back to yourself</h2>
        <p className="quote" style={{ margin: 0, fontSize: 22 }}>{log.focus ? `This morning you chose: ${log.focus}.` : 'Notice your shoulders, your jaw, your breath.'}</p>
        <Breath />
      </section>
    )
  }

  if (log.eveningDone) {
    const m = MOODS.find((x) => x.id === log.mood)
    return (
      <section className="ritual">
        <span className="eyebrow t-goals">Evening ritual · done</span>
        <p className="quote" style={{ margin: 0, fontSize: 22 }}>
          {m ? `Today felt ${m.label.toLowerCase()}.` : 'You closed the day softly.'}{log.gratitude ? ` Grateful for ${log.gratitude}.` : ''}
        </p>
      </section>
    )
  }
  return (
    <form className="ritual" onSubmit={(e) => { e.preventDefault(); logDay(t, { mood, gratitude: gratitude.trim() || undefined, eveningDone: true }) }}>
      <span className="eyebrow t-goals">Evening ritual</span>
      <h2>How did today feel?</h2>
      <div className="chips" role="group" aria-label="Today felt">
        {MOODS.map((m) => (
          <button type="button" key={m.id} className="chip" aria-pressed={mood === m.id} onClick={() => setMood(m.id)}>
            <span className="dot" style={{ color: m.color }} />{m.label}
          </button>
        ))}
      </div>
      <label className="field">One thing I'm grateful for
        <input value={gratitude} onChange={(e) => setGratitude(e.target.value)} placeholder="e.g. the sunset on my walk" />
      </label>
      <div><button className="btn">Close the day · +10 light</button></div>
    </form>
  )
}

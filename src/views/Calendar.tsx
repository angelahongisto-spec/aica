import { useState } from 'react'
import { useStore, eventsOn } from '../lib/store'
import { MONTHS, WEEKDAYS, parse, shortDate, today, ymd } from '../lib/date'
import { Empty, TaskRow } from '../components/ui'
import type { CalEvent } from '../lib/types'

export function Calendar({ openEvent }: { openEvent: (e: Partial<CalEvent> & { date: string }) => void }) {
  const { state, toggleTask, deleteTask } = useStore()
  const t = today()
  const [sel, setSel] = useState(t)
  const [month, setMonth] = useState(() => { const d = new Date(); return [d.getFullYear(), d.getMonth()] as const })

  const [y, m] = month
  const offset = (new Date(y, m, 1).getDay() + 6) % 7 // weeks start on Monday
  const days = new Date(y, m + 1, 0).getDate()
  const shift = (n: number) => { const d = new Date(y, m + n, 1); setMonth([d.getFullYear(), d.getMonth()]) }

  const selEvents = eventsOn(state.events, sel)
  const selTasks = state.tasks.filter((x) => x.due === sel)

  return (
    <>
      <div className="cal-head">
        <button className="navbtn" onClick={() => shift(-1)} aria-label="Previous month">‹</button>
        <div style={{ textAlign: 'center' }}>
          <div className="eyebrow">{y}</div>
          <h1>{MONTHS[m]}</h1>
        </div>
        <button className="navbtn" onClick={() => shift(1)} aria-label="Next month">›</button>
      </div>

      <div className="card">
        <div className="grid">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((w) => <div key={w} className="wd">{w}</div>)}
          {Array.from({ length: offset }, (_, i) => <div key={'b' + i} />)}
          {Array.from({ length: days }, (_, i) => {
            const ds = ymd(new Date(y, m, i + 1))
            const evs = eventsOn(state.events, ds).slice(0, 3)
            return (
              <button
                key={ds}
                className={`day${ds === t ? ' today' : ''}${ds === sel ? ' sel' : ''}`}
                aria-pressed={ds === sel}
                aria-label={`${i + 1} ${MONTHS[m]}${evs.length ? `, ${evs.length} moments` : ''}`}
                onClick={() => setSel(ds)}
              >
                <span className="n">{i + 1}</span>
                <span className="dots">{evs.map((e) => <span key={e.id} className={`dot c-${e.category}`} />)}</span>
              </button>
            )
          })}
        </div>
      </div>

      <section className="sec">
        <div className="sec-head">
          <h2>{sel === t ? 'Today' : `${WEEKDAYS[parse(sel).getDay()]}, ${shortDate(sel).slice(4)}`}</h2>
          <button className="link" onClick={() => openEvent({ date: sel })}>+ Moment</button>
        </div>
        <div className="card">
          {selEvents.length ? (
            <ul className="list">
              {selEvents.map((e) => (
                <li key={e.id}>
                  <button className="row" style={{ width: '100%', border: 0, background: 'none', textAlign: 'left' }} onClick={() => openEvent(e)}>
                    <span style={{ width: 52, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{e.time || 'All day'}</span>
                    <span className={`dot c-${e.category}`} />
                    <span className="txt"><span>{e.title}</span>{e.repeat === 'weekly' && <span className={`sub t-${e.category}`}>Every week</span>}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>A free day.</Empty>
          )}
        </div>
        {selTasks.length > 0 && (
          <div className="card">
            <ul className="list">{selTasks.map((x) => <TaskRow key={x.id} task={x} showDue={false} onToggle={() => toggleTask(x.id)} onDelete={() => deleteTask(x.id)} />)}</ul>
          </div>
        )}
      </section>
    </>
  )
}

import { useStore, eventsOn } from '../lib/store'
import { greeting, longDate, today } from '../lib/date'
import { affirmationFor } from '../lib/spirit'
import { Empty, Lotus, TaskRow } from '../components/ui'
import { TaskAdd } from '../components/TaskAdd'
import type { View } from '../components/TabBar'
import type { CalEvent } from '../lib/types'

export function Today({ go, openEvent }: { go: (v: View) => void; openEvent: (e: Partial<CalEvent> & { date: string }) => void }) {
  const { state, addTask, toggleTask, deleteTask } = useStore()
  const t = today()

  const moments = eventsOn(state.events, t)
  const flow = state.tasks
    .filter((x) => x.due && x.due <= t && (!x.done || x.doneAt === t))
    .sort((a, b) => Number(a.done) - Number(b.done))
  const doneCount = flow.filter((x) => x.done).length

  return (
    <>
      <header className="top">
        <div>
          <div className="eyebrow">{longDate(t)}</div>
          <h1>{greeting()}, Angela</h1>
        </div>
        <button className="badge-light" onClick={() => go('rituals')} aria-label={`${state.light} light earned, open Rituals`}>
          <Lotus size={26} filled />
          {state.light} light
        </button>
      </header>

      <section className="intention" aria-label="Today's intention">
        <span className="eyebrow">Today's intention</span>
        <p className="quote">{affirmationFor(t)}</p>
      </section>

      <section className="sec">
        <div className="sec-head">
          <h2>Today's flow</h2>
          {flow.length > 0 && <span className="muted" style={{ fontSize: 13, fontWeight: 700 }}>{doneCount} of {flow.length} bloomed</span>}
        </div>
        {flow.length > 0 && (
          <div className="petals" aria-hidden="true">
            {flow.map((x) => <span key={x.id} style={x.done ? { background: `var(--${x.category})` } : undefined} />)}
          </div>
        )}
        <TaskAdd placeholder="Add something for today" onAdd={(title, cat) => addTask(title, cat, t)} />
        <div className="card">
          {flow.length ? (
            <ul className="list">{flow.map((x) => <TaskRow key={x.id} task={x} showDue={x.due !== t} onToggle={() => toggleTask(x.id)} onDelete={() => deleteTask(x.id)} />)}</ul>
          ) : (
            <Empty>Nothing planned for today. Enjoy the space.</Empty>
          )}
        </div>
      </section>

      <section className="sec">
        <div className="sec-head">
          <h2>Moments</h2>
          <button className="link" onClick={() => openEvent({ date: t })}>+ Add</button>
        </div>
        <div className="card">
          {moments.length ? (
            <ul className="list">
              {moments.map((e) => (
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
            <Empty>No moments today.</Empty>
          )}
        </div>
      </section>
    </>
  )
}

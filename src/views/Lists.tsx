import { useState } from 'react'
import { useStore } from '../lib/store'
import { addDays, today } from '../lib/date'
import { Empty, ItemRow, TaskRow } from '../components/ui'
import { TaskAdd } from '../components/TaskAdd'
import type { Task } from '../lib/types'

type Due = 'none' | 'today' | 'tomorrow' | 'date'

export function Lists() {
  const [tab, setTab] = useState<'tasks' | 'shop'>('tasks')
  return (
    <>
      <header>
        <div className="eyebrow">Keep it light</div>
        <h1>Lists</h1>
      </header>
      <div className="chips" role="tablist" aria-label="Lists">
        <button className="chip" role="tab" aria-selected={tab === 'tasks'} aria-pressed={tab === 'tasks'} onClick={() => setTab('tasks')}>To-do</button>
        <button className="chip" role="tab" aria-selected={tab === 'shop'} aria-pressed={tab === 'shop'} onClick={() => setTab('shop')}>Shopping</button>
      </div>
      {tab === 'tasks' ? <Tasks /> : <Shopping />}
    </>
  )
}

function Tasks() {
  const { state, addTask, toggleTask, deleteTask, clearDone } = useStore()
  const [due, setDue] = useState<Due>('none')
  const [date, setDate] = useState('')
  const t = today()
  const tm = addDays(t, 1)

  const open = state.tasks.filter((x) => !x.done)
  const done = state.tasks.filter((x) => x.done)
  const groups: [string, Task[], boolean][] = [
    ['Overdue', open.filter((x) => x.due && x.due < t), true],
    ['Today', open.filter((x) => x.due === t), false],
    ['Tomorrow', open.filter((x) => x.due === tm), false],
    ['Later', open.filter((x) => x.due && x.due > tm).sort((a, b) => a.due!.localeCompare(b.due!)), true],
    ['Someday', open.filter((x) => !x.due), false],
  ]
  const shown = groups.filter((g) => g[1].length)
  const dueValue = due === 'today' ? t : due === 'tomorrow' ? tm : due === 'date' && date ? date : null
  const dueChip = (k: Due, label: string) => (
    <button type="button" className="chip" aria-pressed={due === k} onClick={() => setDue(k)}>{label}</button>
  )

  return (
    <>
      <div className="sec" style={{ gap: 8 }}>
        <TaskAdd placeholder="What do you want to remember?" onAdd={(title, cat) => addTask(title, cat, dueValue)} />
        <div className="chips" role="group" aria-label="When">
          {dueChip('none', 'Someday')}
          {dueChip('today', 'Today')}
          {dueChip('tomorrow', 'Tomorrow')}
          <label className="chip" aria-pressed={due === 'date'}>
            On
            <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setDue(e.target.value ? 'date' : 'none') }} aria-label="Pick a day" style={{ border: 0, background: 'none', fontSize: 14, color: 'inherit' }} />
          </label>
        </div>
      </div>

      {shown.length ? shown.map(([title, items, showDue]) => (
        <section className="sec" key={title}>
          <h2 className={title === 'Overdue' ? 't-spirit' : undefined}>{title}</h2>
          <div className="card"><ul className="list">{items.map((x) => <TaskRow key={x.id} task={x} showDue={showDue} onToggle={() => toggleTask(x.id)} onDelete={() => deleteTask(x.id)} />)}</ul></div>
        </section>
      )) : <div className="card"><Empty>Your list is clear. Write the first thing you want to remember above.</Empty></div>}

      {done.length > 0 && (
        <details className="sec">
          <summary className="eyebrow" style={{ cursor: 'pointer' }}>Bloomed ({done.length})</summary>
          <div className="card" style={{ marginTop: 10 }}><ul className="list">{done.map((x) => <TaskRow key={x.id} task={x} onToggle={() => toggleTask(x.id)} onDelete={() => deleteTask(x.id)} />)}</ul></div>
          <div style={{ marginTop: 10 }}><button className="btn ghost" onClick={clearDone}>Clear finished</button></div>
        </details>
      )}
    </>
  )
}

function Shopping() {
  const { state, addShop, toggleShop, deleteShop, clearBasket } = useStore()
  const [text, setText] = useState('')
  const need = state.shop.filter((x) => !x.done)
  const got = state.shop.filter((x) => x.done)
  const sugg = state.recentShop.filter((r) => !need.some((x) => x.text.toLowerCase() === r.toLowerCase())).slice(0, 10)

  return (
    <>
      <div className="sec" style={{ gap: 8 }}>
        <form className="add" onSubmit={(e) => { e.preventDefault(); if (text.trim()) { addShop(text.trim()); setText('') } }}>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add an item, e.g. oat milk" aria-label="New shopping item" />
          <button className="btn plus" aria-label="Add">+</button>
        </form>
        {sugg.length > 0 && (
          <div className="chips" aria-label="Bought before">
            {sugg.map((s) => <button key={s} className="chip sugg" onClick={() => addShop(s)}>{s}</button>)}
          </div>
        )}
      </div>
      <section className="sec">
        <div className="sec-head"><h2>To buy</h2><span className="muted" style={{ fontWeight: 700, fontSize: 14 }}>{need.length}</span></div>
        <div className="card">
          {need.length ? <ul className="list">{need.map((x) => <ItemRow key={x.id} text={x.text} done={false} onToggle={() => toggleShop(x.id)} onDelete={() => deleteShop(x.id)} />)}</ul>
            : <Empty>{got.length ? 'Everything is in the basket.' : 'Nothing to buy.'}</Empty>}
        </div>
      </section>
      {got.length > 0 && (
        <section className="sec">
          <div className="sec-head"><h2>In the basket</h2><button className="link" onClick={clearBasket}>Done shopping</button></div>
          <div className="card"><ul className="list">{got.map((x) => <ItemRow key={x.id} text={x.text} done onToggle={() => toggleShop(x.id)} onDelete={() => deleteShop(x.id)} />)}</ul></div>
          <p className="muted" style={{ margin: 0, fontSize: 13 }}>Finished items become quick picks for next time.</p>
        </section>
      )}
    </>
  )
}

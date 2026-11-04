import { useState } from 'react'
import { useStore, id } from '../lib/store'
import { CATEGORIES, type Category, type Goal } from '../lib/types'
import { today } from '../lib/date'
import { BackHeader } from '../components/BackHeader'

const WHY_PROMPTS = ['Why do you want this?', 'And why does that matter to you?', 'Go one layer deeper. Why is that important?', 'What is the feeling underneath it all?']

function NewGoal({ onDone }: { onDone: () => void }) {
  const { saveGoal } = useStore()
  const [title, setTitle] = useState('')
  const [area, setArea] = useState<Category>('goals')
  const [whys, setWhys] = useState<string[]>([''])
  const [step, setStep] = useState('')
  const canDig = whys.length < WHY_PROMPTS.length && whys[whys.length - 1].trim() !== ''

  return (
    <form className="ritual" onSubmit={(e) => {
      e.preventDefault()
      if (!title.trim()) return
      saveGoal({
        id: id(), title: title.trim(), area, createdAt: today(),
        whys: whys.map((w) => w.trim()).filter(Boolean),
        steps: step.trim() ? [{ id: id(), text: step.trim(), done: false }] : [],
      })
      onDone()
    }}>
      <span className="eyebrow">Plant a new goal</span>
      <label className="field">What do you want?
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Find my dream job" autoFocus />
      </label>
      <div className="chips" role="group" aria-label="Area">
        {CATEGORIES.map((c) => (
          <button type="button" key={c.id} className="chip" aria-pressed={area === c.id} onClick={() => setArea(c.id)}><span className={`dot c-${c.id}`} />{c.label}</button>
        ))}
      </div>
      <div className="roots-form">
        {whys.map((w, i) => (
          <label key={i} className="field">{WHY_PROMPTS[i]}
            <input value={w} onChange={(e) => setWhys(whys.map((x, j) => (j === i ? e.target.value : x)))} placeholder={i === 0 ? 'e.g. I want to feel proud of my work' : 'Because…'} />
          </label>
        ))}
        {canDig && <button type="button" className="link" style={{ alignSelf: 'flex-start', padding: 0 }} onClick={() => setWhys([...whys, ''])}>↓ Dig deeper</button>}
      </div>
      <label className="field">One small first step
        <input value={step} onChange={(e) => setStep(e.target.value)} placeholder="e.g. Update my CV" />
      </label>
      <div className="actions" style={{ justifyContent: 'flex-start' }}>
        <button className="btn" disabled={!title.trim()}>Plant goal</button>
        <button type="button" className="btn ghost" onClick={onDone}>Cancel</button>
      </div>
    </form>
  )
}

function GoalCard({ goal }: { goal: Goal }) {
  const { saveGoal, deleteGoal, toggleStep } = useStore()
  const [stepText, setStepText] = useState('')
  const [newWhy, setNewWhy] = useState<string | null>(null)
  const [confirm, setConfirm] = useState(false)
  const done = goal.steps.filter((s) => s.done).length

  return (
    <article className="goal">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className={`dot c-${goal.area}`} />
        <h2 style={{ flex: 1, fontSize: 22 }}>{goal.title}</h2>
      </div>

      {goal.whys.length > 0 && (
        <div className="roots" aria-label="Roots">
          {goal.whys.map((w, i) => (
            <div key={i} className={`root${i === goal.whys.length - 1 ? ' deepest' : ''}`}>
              <span className="eyebrow">{i === goal.whys.length - 1 ? 'Root' : 'Because'}</span>
              <span className="quote" style={{ fontSize: i === goal.whys.length - 1 ? 21 : 18 }}>{w}</span>
            </div>
          ))}
        </div>
      )}
      {newWhy === null ? (
        goal.whys.length < WHY_PROMPTS.length && <button className="link" style={{ alignSelf: 'flex-start', padding: 0 }} onClick={() => setNewWhy('')}>↓ {goal.whys.length ? 'Dig deeper' : 'Find the root'}</button>
      ) : (
        <form className="add" onSubmit={(e) => { e.preventDefault(); if (newWhy.trim()) saveGoal({ ...goal, whys: [...goal.whys, newWhy.trim()] }); setNewWhy(null) }}>
          <input value={newWhy} onChange={(e) => setNewWhy(e.target.value)} placeholder={WHY_PROMPTS[goal.whys.length]} aria-label={WHY_PROMPTS[goal.whys.length]} autoFocus />
          <button className="btn plus" aria-label="Save">+</button>
        </form>
      )}

      <div className="sec" style={{ gap: 6 }}>
        <div className="sec-head"><span className="eyebrow">Steps</span>{goal.steps.length > 0 && <span className="muted" style={{ fontSize: 13, fontWeight: 700 }}>{done} of {goal.steps.length}</span>}</div>
        <ul className="list">
          {goal.steps.map((s) => (
            <li key={s.id} className={`row step${s.done ? ' done' : ''}`}>
              <button className={`check c-${goal.area}`} onClick={() => toggleStep(goal.id, s.id)} aria-label={`${s.done ? 'Mark as not done' : 'Mark as done'}: ${s.text}`}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="var(--surface)" strokeWidth="3" /></svg>
              </button>
              <div className="txt"><span className="title">{s.text}</span></div>
              <span className={`pts t-${goal.area}`}>+5</span>
            </li>
          ))}
        </ul>
        <form className="add" onSubmit={(e) => { e.preventDefault(); if (stepText.trim()) { saveGoal({ ...goal, steps: [...goal.steps, { id: id(), text: stepText.trim(), done: false }] }); setStepText('') } }}>
          <input value={stepText} onChange={(e) => setStepText(e.target.value)} placeholder="Add a small step" aria-label={`Add a step to ${goal.title}`} />
          <button className="btn plus" aria-label="Add step">+</button>
        </form>
      </div>
      <button className="link" style={{ alignSelf: 'flex-end', color: 'var(--muted)', fontWeight: 700 }} onClick={() => (confirm ? deleteGoal(goal.id) : setConfirm(true))}>
        {confirm ? 'Tap again to let it go' : 'Let go of this goal'}
      </button>
    </article>
  )
}

export function Goals({ back }: { back: () => void }) {
  const { state } = useStore()
  const [adding, setAdding] = useState(state.goals.length === 0)
  return (
    <>
      <BackHeader back={back} eyebrow="Roots & goals" title="Goals" />
      <p className="quote" style={{ margin: 0, fontSize: 21 }}>Every flower starts below the surface. Know why you want it, and the how gets lighter.</p>
      {adding ? <NewGoal onDone={() => setAdding(false)} /> : <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setAdding(true)}>+ Plant a new goal</button>}
      {state.goals.map((g) => <GoalCard key={g.id} goal={g} />)}
    </>
  )
}

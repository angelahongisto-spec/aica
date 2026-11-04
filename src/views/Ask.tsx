import { useState } from 'react'
import { useStore, id } from '../lib/store'
import { AFFIRMATIONS } from '../lib/spirit'
import { addDays, parse, today } from '../lib/date'

type Msg = { from: 'me' | 'aica'; text: string }

function nextWeekday(wd: number) {
  let d = today()
  while (parse(d).getDay() !== wd) d = addDays(d, 1)
  return d
}

/*
 * v1: quick actions that work right away, no AI needed.
 * v1.2: the text field talks to Claude through a small server function.
 */
export function Ask() {
  const { saveEvent, addTask } = useStore()
  const [log, setLog] = useState<Msg[]>([{ from: 'aica', text: 'Hi Angela. What would you like to make space for?' }])
  const [text, setText] = useState('')
  const say = (me: string, aica: string) => setLog((l) => [...l, { from: 'me', text: me }, { from: 'aica', text: aica }])

  const actions = [
    {
      label: 'Weekly yoga, Wed 18:00',
      run: () => {
        saveEvent({ id: id(), title: 'Yoga', category: 'spirit', date: nextWeekday(3), time: '18:00', repeat: 'weekly' })
        say('Add yoga every Wednesday evening', 'Done. Yoga is in your calendar every Wednesday at 18:00.')
      },
    },
    {
      label: 'Drink water today',
      run: () => {
        addTask('Drink 2 litres of water', 'body', today())
        say('Remind me to drink water', 'Added to today’s flow. Small sips, big glow.')
      },
    },
    {
      label: 'Give me a mantra',
      run: () => say('Give me a mantra', AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]),
    },
    {
      label: 'Plan my week',
      run: () => say('Plan my week', 'Weekly planning arrives with my AI upgrade. For now, try the calendar and I will help you soon.'),
    },
  ]

  return (
    <div className="ask-wrap">
      <header style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span className="eyebrow" style={{ color: 'var(--gold)' }}>Your calm little planner</span>
        <h1>Ask AiCA</h1>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} aria-live="polite">
        {log.map((m, i) => (
          <div key={i} className={m.from === 'me' ? 'bubble me' : 'bubble'}>{m.text}</div>
        ))}
      </div>

      <div className="ask-bottom">
        <div className="chips">
          {actions.map((a) => <button key={a.label} className="chip night" onClick={a.run}>{a.label}</button>)}
        </div>
        <form className="add night" onSubmit={(e) => {
          e.preventDefault()
          if (!text.trim()) return
          say(text.trim(), 'I can do the quick actions above for now. Free-form chat comes with my AI upgrade soon.')
          setText('')
        }}>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Tell AiCA anything…" aria-label="Message AiCA" />
          <button className="btn plus" style={{ background: 'var(--gold)', color: 'var(--night)' }} aria-label="Send">→</button>
        </form>
      </div>
    </div>
  )
}

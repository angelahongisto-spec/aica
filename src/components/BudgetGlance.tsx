import { useState } from 'react'
import { useStore } from '../lib/store'
import { budgetStatus, money, parseAmount, PERIOD_LABEL } from '../lib/money'
import { today } from '../lib/date'
import type { View } from './TabBar'

/** Today's money at a glance, with a one-line quick spend. */
export function BudgetGlance({ go }: { go: (v: View) => void }) {
  const { state, addExpense } = useStore()
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const b = state.budget

  if (!b) {
    return (
      <button className="glance" onClick={() => go('budget')}>
        <span className="eyebrow">Budget</span>
        <span>Set a daily, weekly or monthly budget →</span>
      </button>
    )
  }
  const st = budgetStatus(b, state.expenses)
  const value = parseAmount(amount)
  return (
    <section className="glance" aria-label="Budget">
      <button className="glance-top" onClick={() => go('budget')}>
        <span className="eyebrow">{st.over ? `Over ${PERIOD_LABEL[b.period]}` : `Left ${PERIOD_LABEL[b.period]}`}</span>
        <span className={`glance-num${st.over ? ' over' : ''}`}>{money(Math.abs(st.left), b.currency)}</span>
      </button>
      <div className="money-bar" aria-hidden="true"><i className={st.over ? 'over' : st.used > 0.85 ? 'near' : ''} style={{ width: `${Math.min(100, st.used * 100)}%` }} /></div>
      <form className="quick-spend" onSubmit={(e) => {
        e.preventDefault()
        if (!value) return
        addExpense({ amount: value, note: note.trim() || 'Spend', category: 'other', date: today() })
        setAmount(''); setNote('')
      }}>
        <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="€" aria-label="Amount spent" style={{ width: 70 }} />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Spent on…" aria-label="Spent on" style={{ flex: 1, minWidth: 0 }} />
        <button className="btn plus" aria-label="Log spend" disabled={!value}>+</button>
      </form>
    </section>
  )
}

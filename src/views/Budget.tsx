import { useState } from 'react'
import { useStore } from '../lib/store'
import { budgetStatus, money, parseAmount, PERIOD_LABEL } from '../lib/money'
import { shortDate, today } from '../lib/date'
import { SPEND_CATEGORIES, type BudgetPeriod, type SpendCategory } from '../lib/types'
import { Empty } from '../components/ui'
import { BackHeader } from '../components/BackHeader'

function BudgetSetup({ onDone }: { onDone?: () => void }) {
  const { state, setBudget } = useStore()
  const [period, setPeriod] = useState<BudgetPeriod>(state.budget?.period ?? 'week')
  const [amount, setAmount] = useState(state.budget ? String(state.budget.amount) : '')
  const value = parseAmount(amount)
  return (
    <form className="ritual" onSubmit={(e) => { e.preventDefault(); if (value) { setBudget({ period, amount: value, currency: '€' }); onDone?.() } }}>
      <span className="eyebrow">Your budget</span>
      <div className="segmented" role="group" aria-label="Budget period">
        {(['day', 'week', 'month'] as BudgetPeriod[]).map((p) => (
          <button type="button" key={p} aria-pressed={period === p} onClick={() => setPeriod(p)}>{p === 'day' ? 'Daily' : p === 'week' ? 'Weekly' : 'Monthly'}</button>
        ))}
      </div>
      <label className="field">How much can you spend {PERIOD_LABEL[period]}?
        <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 150" />
      </label>
      <div className="actions" style={{ justifyContent: 'flex-start' }}>
        <button className="btn" disabled={!value}>Save budget</button>
        {onDone && state.budget && <button type="button" className="btn ghost" onClick={onDone}>Cancel</button>}
      </div>
    </form>
  )
}

export function Budget({ back }: { back: () => void }) {
  const { state, addExpense, deleteExpense } = useStore()
  const [editing, setEditing] = useState(false)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [cat, setCat] = useState<SpendCategory>('food')
  const b = state.budget

  if (!b || editing) {
    return (
      <>
        <BackHeader back={back} eyebrow="Money, mindfully" title="Budget" />
        {!b && <p className="quote" style={{ margin: 0, fontSize: 22 }}>Abundance grows where attention goes. Set a budget, then log what you spend.</p>}
        <BudgetSetup onDone={b ? () => setEditing(false) : undefined} />
      </>
    )
  }

  const st = budgetStatus(b, state.expenses)
  const value = parseAmount(amount)
  const byDay = Object.entries(
    st.inPeriod.reduce<Record<string, typeof st.inPeriod>>((acc, e) => { (acc[e.date] ??= []).push(e); return acc }, {}),
  ).sort((a, z) => z[0].localeCompare(a[0]))
  const byCat = SPEND_CATEGORIES.map((c) => ({ ...c, sum: st.inPeriod.filter((e) => e.category === c.id).reduce((s, e) => s + e.amount, 0) })).filter((c) => c.sum > 0)
  const maxCat = Math.max(1, ...byCat.map((c) => c.sum))

  return (
    <>
      <BackHeader back={back} eyebrow="Money, mindfully" title="Budget" />

      <section className="money-hero" aria-label="Budget status">
        <span className="eyebrow">{st.over ? `Over budget ${PERIOD_LABEL[b.period]}` : `Left ${PERIOD_LABEL[b.period]}`}</span>
        <span className={`money-big${st.over ? ' over' : ''}`}>{money(Math.abs(st.left), b.currency)}{st.over ? ' over' : ''}</span>
        <div className="money-bar" aria-hidden="true"><i className={st.over ? 'over' : st.used > 0.85 ? 'near' : ''} style={{ width: `${Math.min(100, st.used * 100)}%` }} /></div>
        <div className="money-meta">
          <span>Spent {money(st.spent, b.currency)} of {money(b.amount, b.currency)}</span>
          {b.period !== 'day' && !st.over && <span>About {money(st.perDay, b.currency)} a day for {st.daysLeft} {st.daysLeft === 1 ? 'day' : 'days'}</span>}
          {st.over && <span className="t-over">Be gentle with yourself. A fresh {b.period} starts soon.</span>}
        </div>
        <button className="link" style={{ alignSelf: 'flex-start', padding: 0 }} onClick={() => setEditing(true)}>Change budget</button>
      </section>

      <form className="ritual" onSubmit={(e) => {
        e.preventDefault()
        if (!value) return
        addExpense({ amount: value, note: note.trim() || SPEND_CATEGORIES.find((c) => c.id === cat)!.label, category: cat, date: today() })
        setAmount(''); setNote('')
      }}>
        <span className="eyebrow">Log a spend</span>
        <div className="two">
          <label className="field">Amount (€)<input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="12,50" /></label>
          <label className="field">For what?<input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Lunch" /></label>
        </div>
        <div className="chips" role="group" aria-label="Category">
          {SPEND_CATEGORIES.map((c) => (
            <button type="button" key={c.id} className="chip" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
              <span className="dot" style={{ color: c.color }} />{c.label}
            </button>
          ))}
        </div>
        <div><button className="btn" disabled={!value}>Add spend</button></div>
      </form>

      {byCat.length > 0 && (
        <section className="sec">
          <h2>Where it went</h2>
          <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {byCat.map((c) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 74, fontSize: 13, fontWeight: 700 }}>{c.label}</span>
                <div style={{ flex: 1, height: 8, borderRadius: 9, background: 'var(--line)' }}>
                  <div style={{ width: `${(c.sum / maxCat) * 100}%`, height: '100%', borderRadius: 9, background: c.color }} />
                </div>
                <span className="num" style={{ width: 64, textAlign: 'right', fontSize: 13, fontWeight: 700 }}>{money(c.sum, b.currency)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="sec">
        <h2>Spending {PERIOD_LABEL[b.period]}</h2>
        {byDay.length ? byDay.map(([day, items]) => (
          <div key={day} className="sec" style={{ gap: 6 }}>
            <span className="eyebrow">{day === today() ? 'Today' : shortDate(day)}</span>
            <div className="card"><ul className="list">
              {items.map((e) => {
                const c = SPEND_CATEGORIES.find((x) => x.id === e.category)!
                return (
                  <li key={e.id} className="row">
                    <span className="dot" style={{ color: c.color }} />
                    <div className="txt"><span>{e.note}</span><span className="sub muted">{c.label}</span></div>
                    <span className="num" style={{ fontWeight: 800 }}>{money(e.amount, b.currency)}</span>
                    <button className="del" onClick={() => deleteExpense(e.id)} aria-label={`Delete ${e.note}`}>×</button>
                  </li>
                )
              })}
            </ul></div>
          </div>
        )) : <div className="card"><Empty>Nothing spent yet {PERIOD_LABEL[b.period]}.</Empty></div>}
      </section>
    </>
  )
}

import { useState } from 'react'
import { CATEGORIES, type Category } from '../lib/types'

/** Text field plus the four color-coded areas. */
export function TaskAdd({ placeholder, onAdd, children }: { placeholder: string; onAdd: (title: string, cat: Category) => void; children?: React.ReactNode }) {
  const [text, setText] = useState('')
  const [cat, setCat] = useState<Category>('spirit')
  return (
    <div className="sec" style={{ gap: 8 }}>
      <form className="add" onSubmit={(e) => { e.preventDefault(); if (text.trim()) { onAdd(text.trim(), cat); setText('') } }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
        <button className="btn plus" aria-label="Add">+</button>
      </form>
      <div className="chips" role="group" aria-label="Area">
        {CATEGORIES.map((c) => (
          <button type="button" key={c.id} className="chip" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
            <span className={`dot c-${c.id}`} />{c.label}
          </button>
        ))}
        {children}
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import type { CalEvent, Category } from '../lib/types'
import { CATEGORIES } from '../lib/types'
import { id } from '../lib/store'

export function EventSheet({ initial, onSave, onDelete, onClose }: {
  initial: Partial<CalEvent> & { date: string }
  onSave: (e: CalEvent) => void
  onDelete?: () => void
  onClose: () => void
}) {
  const isNew = !initial.id
  const [title, setTitle] = useState(initial.title ?? '')
  const [date, setDate] = useState(initial.date)
  const [time, setTime] = useState(initial.time ?? '')
  const [category, setCategory] = useState<Category>(initial.category ?? 'spirit')
  const [repeat, setRepeat] = useState<CalEvent['repeat']>(initial.repeat ?? 'none')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ev-h"
        onSubmit={(e) => {
          e.preventDefault()
          if (!title.trim()) return
          onSave({ id: initial.id ?? id(), title: title.trim(), date, time, category, repeat })
          onClose()
        }}
      >
        <h2 id="ev-h">{isNew ? 'New moment' : 'Edit moment'}</h2>
        <label className="field">What?
          <input ref={titleRef} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Yin yoga" required />
        </label>
        <div className="two">
          <label className="field">Day<input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></label>
          <label className="field">Time<input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></label>
        </div>
        <div className="field">Area
          <div className="chips">
            {CATEGORIES.map((c) => (
              <button type="button" key={c.id} className="chip" aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>
                <span className={`dot c-${c.id}`} />{c.label}
              </button>
            ))}
          </div>
        </div>
        <div className="field">Repeats
          <div className="chips">
            <button type="button" className="chip" aria-pressed={repeat === 'none'} onClick={() => setRepeat('none')}>Once</button>
            <button type="button" className="chip" aria-pressed={repeat === 'weekly'} onClick={() => setRepeat('weekly')}>Every week</button>
          </div>
        </div>
        <div className="actions">
          {onDelete && (
            <button type="button" className="btn left" onClick={() => (confirmDelete ? (onDelete(), onClose()) : setConfirmDelete(true))}>
              {confirmDelete ? 'Tap again to delete' : 'Delete'}
            </button>
          )}
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn">Save</button>
        </div>
      </form>
    </div>
  )
}

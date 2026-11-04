import type { Task } from '../lib/types'
import { dueLabel } from '../lib/date'

export function Lotus({ size = 28, filled = false }: { size?: number; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <g fill={filled ? 'var(--lotus)' : 'none'} stroke={filled ? 'var(--spirit)' : 'currentColor'} strokeWidth="2" strokeLinejoin="round">
        <path d="M24 8c5 6 5 16 0 24c-5-8-5-18 0-24z" />
        <path d="M24 32c-3-8-9-14-17-15c0 9 7 15 17 15z" />
        <path d="M24 32c3-8 9-14 17-15c0 9-7 15-17 15z" />
      </g>
    </svg>
  )
}

const Tick = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="var(--surface)" strokeWidth="3" />
  </svg>
)

export function TaskRow({ task, onToggle, onDelete, showDue = true }: { task: Task; onToggle: () => void; onDelete: () => void; showDue?: boolean }) {
  const due = task.due && showDue && !task.done ? dueLabel(task.due) : null
  const cat = task.category
  return (
    <li className={`row${task.done ? ' done' : ''}`}>
      <button className={`check c-${cat}`} onClick={onToggle} aria-label={`${task.done ? 'Mark as not done' : 'Mark as done'}: ${task.title}`}>
        <Tick />
      </button>
      <div className="txt">
        <span className="title">{task.title}</span>
        {due && <span className={`sub ${due.late ? 't-spirit' : `t-${cat}`}`}>{due.text}</span>}
      </div>
      <span className={`pts t-${cat}`}>+{task.points}</span>
      <button className="del" onClick={onDelete} aria-label={`Delete ${task.title}`}>×</button>
    </li>
  )
}

export function ItemRow({ text, done, onToggle, onDelete }: { text: string; done: boolean; onToggle: () => void; onDelete: () => void }) {
  return (
    <li className={`row${done ? ' done' : ''}`}>
      <button className="check c-home" onClick={onToggle} aria-label={`${done ? 'Back to list' : 'In the basket'}: ${text}`}>
        <Tick />
      </button>
      <div className="txt"><span className="title">{text}</span></div>
      <button className="del" onClick={onDelete} aria-label={`Delete ${text}`}>×</button>
    </li>
  )
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="empty">{children}</div>
}

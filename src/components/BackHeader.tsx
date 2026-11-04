export function BackHeader({ back, eyebrow, title }: { back: () => void; eyebrow: string; title: string }) {
  return (
    <header style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <button className="back" onClick={back} aria-label="Back">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Me
      </button>
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
      </div>
    </header>
  )
}

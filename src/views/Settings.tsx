import { useStore } from '../lib/store'
import type { ThemeMode } from '../lib/types'
import { BackHeader } from '../components/BackHeader'
import { Reminders } from '../components/Reminders'
import { today } from '../lib/date'

export function SettingsView({ back }: { back: () => void }) {
  const { state, setSettings } = useStore()
  const s = state.settings

  function backup() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `aica-backup-${today()}.json`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }

  return (
    <>
      <BackHeader back={back} eyebrow="Make it yours" title="Settings" />

      <section className="sec">
        <span className="eyebrow">Appearance</span>
        <div className="segmented" role="group" aria-label="Appearance">
          {(['light', 'dark', 'system'] as ThemeMode[]).map((m) => (
            <button key={m} aria-pressed={s.theme === m} onClick={() => setSettings({ theme: m })}>
              {m === 'light' ? 'Light' : m === 'dark' ? 'Dark' : 'Match phone'}
            </button>
          ))}
        </div>
      </section>

      <section className="sec">
        <span className="eyebrow">Your name</span>
        <form className="add" onSubmit={(e) => e.preventDefault()}>
          <input value={s.name} onChange={(e) => setSettings({ name: e.target.value })} aria-label="Your name" placeholder="Your name" />
        </form>
      </section>

      <Reminders />

      <section className="sec">
        <span className="eyebrow">Your data</span>
        <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="muted" style={{ fontSize: 14 }}>Everything is saved on this device. Keep a backup file now and then.</span>
          <div><button className="btn ghost" onClick={backup}>Download backup</button></div>
        </div>
      </section>

      <p className="muted" style={{ margin: 0, fontSize: 13, textAlign: 'center' }}>AiCA · made with love by {s.name || 'you'}</p>
    </>
  )
}

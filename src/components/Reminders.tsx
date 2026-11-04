import { useState } from 'react'

const VAPID_PUBLIC_KEY = 'BGc7oHQFLhNLv7ohDgLjXzOETJKD9_wJCnGrFyQpMghDccBQHz1DwaaO35r0SW91OEj9ZVxAlibekTpmvj0kEt0'

function urlBase64ToUint8Array(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from(raw, (c) => c.charCodeAt(0))
}

/**
 * Turns on the three daily reminders (morning, midday, evening).
 * The phone gives us a "subscription" address; the scheduled GitHub job sends to it.
 */
export function Reminders() {
  const supported = typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
  const [sub, setSub] = useState('')
  const [status, setStatus] = useState('')
  const [copied, setCopied] = useState(false)

  async function enable() {
    setStatus('')
    try {
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') { setStatus('Notifications are turned off. You can allow them in iPhone Settings › AiCA › Notifications.'); return }
      const reg = await navigator.serviceWorker.ready
      const s = (await reg.pushManager.getSubscription()) ?? (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) }))
      setSub(JSON.stringify(s))
    } catch {
      setStatus('Could not turn on reminders. Open AiCA from your home screen icon and try again.')
    }
  }

  async function copy() {
    try { await navigator.clipboard.writeText(sub); setCopied(true) } catch { setCopied(false) }
  }

  return (
    <section className="ritual">
      <span className="eyebrow t-spirit">Reminders</span>
      <h2>Three gentle nudges a day</h2>
      <p className="muted" style={{ margin: 0, fontSize: 14 }}>Morning intention at 8:00, a midday pause at 13:00 and your evening ritual at 21:00.</p>
      {!supported ? (
        <p className="muted" style={{ margin: 0, fontSize: 14 }}>Open AiCA from your home screen icon to turn on reminders.</p>
      ) : !sub ? (
        <div><button className="btn" onClick={enable}>Turn on reminders</button></div>
      ) : (
        <div className="sec" style={{ gap: 8 }}>
          <span className="t-body" style={{ fontWeight: 800 }}>Reminders allowed on this phone.</span>
          <span className="muted" style={{ fontSize: 13 }}>Last step: copy this code and save it in GitHub as the secret PUSH_SUBSCRIPTION.</span>
          <textarea readOnly value={sub} rows={3} aria-label="Reminder code" onFocus={(e) => e.currentTarget.select()} style={{ width: '100%', border: '1.5px solid var(--line)', borderRadius: 14, padding: 10, fontSize: 12, background: 'var(--paper)', color: 'var(--ink)' }} />
          <div><button className="btn ghost" onClick={copy}>{copied ? 'Copied' : 'Copy code'}</button></div>
        </div>
      )}
      {status && <p className="t-spirit" style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{status}</p>}
    </section>
  )
}

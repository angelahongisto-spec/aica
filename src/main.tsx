import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

// Fetch new versions automatically: on open, and whenever AiCA comes back to the screen.
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh: () => updateSW(true),
  onRegisteredSW: (_url, reg) => {
    if (!reg) return
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update() })
    setInterval(() => reg.update(), 30 * 60 * 1000)
  },
})

// Match the saved light/dark choice before the first frame so the splash doesn't flash.
try {
  const theme = JSON.parse(localStorage.getItem('aica:v1') || '{}')?.settings?.theme
  const dark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
} catch { /* first run */ }

const started = performance.now()
setTimeout(() => {
  const el = document.getElementById('splash')
  el?.classList.add('hide')
  setTimeout(() => el?.remove(), 700)
}, Math.max(0, 1600 - (performance.now() - started)))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

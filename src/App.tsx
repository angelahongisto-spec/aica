import { useCallback, useEffect, useState } from 'react'
import { StoreProvider, useStore } from './lib/store'
import { TabBar, type View } from './components/TabBar'
import { EventSheet } from './components/EventSheet'
import { Today } from './views/Today'
import { Calendar } from './views/Calendar'
import { Lists } from './views/Lists'
import { Ask } from './views/Ask'
import { Rituals } from './views/Rituals'
import { Me } from './views/Me'
import { Budget } from './views/Budget'
import { Goals } from './views/Goals'
import { SettingsView } from './views/Settings'
import type { CalEvent } from './lib/types'

const VIEWS: View[] = ['today', 'calendar', 'ask', 'lists', 'me', 'rituals', 'budget', 'goals', 'settings']
const fromHash = (): View => {
  const h = location.hash.slice(1) as View
  return VIEWS.includes(h) ? h : 'today'
}

function Shell() {
  const { state, saveEvent, deleteEvent } = useStore()
  const theme = state.settings.theme
  const [view, setView] = useState<View>(fromHash)
  const [sheet, setSheet] = useState<(Partial<CalEvent> & { date: string }) | null>(null)

  useEffect(() => {
    const onHash = () => setView(fromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('is-night', view === 'ask')
  }, [view])

  // Light, dark or follow the phone.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches)
      document.documentElement.dataset.theme = dark ? 'dark' : 'light'
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#15100D' : '#FCF8F5')
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme])

  const go = (v: View) => {
    history.replaceState(null, '', '#' + v)
    setView(v)
    window.scrollTo(0, 0)
  }
  const closeSheet = useCallback(() => setSheet(null), [])

  return (
    <>
      <main className="app">
        {view === 'today' && <Today go={go} openEvent={setSheet} />}
        {view === 'calendar' && <Calendar openEvent={setSheet} />}
        {view === 'ask' && <Ask />}
        {view === 'lists' && <Lists />}
        {view === 'me' && <Me go={go} />}
        {view === 'rituals' && <Rituals back={() => go('me')} />}
        {view === 'budget' && <Budget back={() => go('me')} />}
        {view === 'goals' && <Goals back={() => go('me')} />}
        {view === 'settings' && <SettingsView back={() => go('me')} />}
      </main>
      <TabBar view={view} go={go} />
      {sheet && (
        <EventSheet
          key={sheet.id ?? 'new'}
          initial={sheet}
          onSave={saveEvent}
          onDelete={sheet.id ? () => deleteEvent(sheet.id!) : undefined}
          onClose={closeSheet}
        />
      )}
    </>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}

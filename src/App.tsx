import { useCallback, useEffect, useState } from 'react'
import { StoreProvider, useStore } from './lib/store'
import { TabBar, type View } from './components/TabBar'
import { EventSheet } from './components/EventSheet'
import { Today } from './views/Today'
import { Calendar } from './views/Calendar'
import { Lists } from './views/Lists'
import { Ask } from './views/Ask'
import { Rituals } from './views/Rituals'
import type { CalEvent } from './lib/types'

const VIEWS: View[] = ['today', 'calendar', 'ask', 'lists', 'rituals']
const fromHash = (): View => {
  const h = location.hash.slice(1) as View
  return VIEWS.includes(h) ? h : 'today'
}

function Shell() {
  const { saveEvent, deleteEvent } = useStore()
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
        {view === 'rituals' && <Rituals />}
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

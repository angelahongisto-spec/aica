// Shows AiCA reminders sent by the scheduled GitHub job, and opens the app when tapped.
self.addEventListener('push', (event) => {
  let data = { title: 'AiCA', body: 'A gentle moment for you.' }
  try { data = { ...data, ...event.data.json() } } catch { /* plain text or empty */ }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      tag: data.tag || 'aica',
      data: { url: data.url || './#today' },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = new URL(event.notification.data?.url || './#today', self.registration.scope).href
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) if ('focus' in c) { c.navigate(url); return c.focus() }
      return self.clients.openWindow(url)
    }),
  )
})

// Sends AiCA's three daily reminders. Runs every hour from GitHub Actions and only sends
// when the hour in AiCA_TIMEZONE matches a ritual time.
import webpush from 'web-push'
import { readFileSync } from 'node:fs'

const affirmations = JSON.parse(readFileSync(new URL('../src/lib/affirmations.json', import.meta.url), 'utf8'))
const tz = process.env.AICA_TIMEZONE || 'Europe/Rome'
const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, PUSH_SUBSCRIPTION } = process.env

if (!VAPID_PRIVATE_KEY || !PUSH_SUBSCRIPTION) {
  console.log('Reminders are not set up yet (missing secrets). Skipping.')
  process.exit(0)
}

const parts = Object.fromEntries(
  new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).map((p) => [p.type, p.value]),
)
const hour = Number(parts.hour)
const day = `${parts.year}-${parts.month}-${parts.day}`

// Same daily affirmation as the app shows.
let h = 0
for (const c of day) h = (h * 31 + c.charCodeAt(0)) >>> 0
const intention = affirmations[h % affirmations.length]

const SLOTS = {
  8: { title: 'Good morning, Angela', body: `Today's intention: ${intention} Take a moment for your morning ritual.`, tag: 'morning' },
  13: { title: 'Midday pause', body: 'Breathe. Come back to the focus you chose this morning.', tag: 'midday' },
  21: { title: 'How did today feel?', body: 'Close the day softly with your evening ritual.', tag: 'evening' },
}
const forced = process.env.FORCE_SLOT
const slot = SLOTS[forced || hour]
if (!slot) {
  console.log(`No reminder at ${hour}:00 in ${tz}.`)
  process.exit(0)
}

webpush.setVapidDetails('https://github.com/angelahongisto-spec/aica', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
await webpush.sendNotification(JSON.parse(PUSH_SUBSCRIPTION), JSON.stringify({ ...slot, url: './#today' }))
console.log(`Sent the ${slot.tag} reminder.`)

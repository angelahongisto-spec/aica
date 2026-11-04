# AiCA

**AI + Calendar.** In Finnish, *aika* means *time*.

AiCA is my personal life planner: calendar, to-do lists, shopping list, gentle rituals and (soon) an AI helper, in one calm app. It installs on my iPhone and Mac from the browser, works offline, and is designed to feel like a quiet morning rather than another productivity tool.

I designed and built it as a personal project, from moodboard to working app.

## Features (v1)

- **Today:** a daily intention, today's flow with progress, and the day's moments
- **Calendar:** month view with color-coded dots, weekly repeating events
- **Lists:** to-dos grouped by Overdue / Today / Tomorrow / Later / Someday, and a shopping list that remembers what you buy
- **Color coding:** every item belongs to an area: Spirit, Body, Home or Goals
- **Budget:** daily, weekly or monthly budget, quick spend logging, what is left and where it went
- **Goals & roots:** each goal digs down through "why?" to its real root, with small steps that earn light
- **Settings:** light, dark or match phone, name, reminders, data backup
- **Rituals:** finishing things earns *light*; levels grow from Seed to Radiant, and a weekly balance shows which area needs care
- **Ask AiCA:** quick actions such as "weekly yoga on Wednesdays" (full AI chat in v1.2)
- **Installable PWA:** offline support, home screen icon, safe-area aware layout for iPhone

## Design

The Lotus theme comes from my own moodboards: lotus pink, jade water, candle gold and a candle-lit "temple night" for the assistant. Headings are set in Marcellus, affirmations in Cormorant Garamond italic, and the interface in Nunito Sans.

The spiritual mood is meant as inspiration, not decoration: nature, light and stillness carry it. Points are called *light* rather than borrowing sacred terms, and the affirmations are original.

## Tech

- React 19 + TypeScript, built with Vite
- `vite-plugin-pwa` for install and offline support
- Local-first state (works offline), designed so cloud sync can plug in without changing the screens

## Roadmap

- **v1.1** Reminders and notifications, quick commands ("yoga every Wed 18")
- **v1.2** AI assistant powered by Claude, through a small server function that keeps the API key private
- **v1.3** Sync between iPhone and Mac
- **v2** Streaks, workout log, meal plans that fill the shopping list, more themes (Mermaid, Fairy, Witch, Valkyrie)

## Run locally

```bash
npm install
npm run dev
```

---
Designed and built by Angela Hongisto.

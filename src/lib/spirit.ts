// Original affirmations written for AiCA, inspired by nature and stillness (see affirmations.json).
import affirmations from './affirmations.json'

export const AFFIRMATIONS: string[] = affirmations

/** Same affirmation all day, a new one tomorrow. */
export function affirmationFor(day: string) {
  let h = 0
  for (const c of day) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return AFFIRMATIONS[h % AFFIRMATIONS.length]
}

// "Light" levels: the path from seed to radiant.
export const LEVELS = [
  { name: 'Seed', at: 0 },
  { name: 'Sprout', at: 50 },
  { name: 'Bud', at: 150 },
  { name: 'Blooming Lotus', at: 300 },
  { name: 'Golden Lotus', at: 500 },
  { name: 'Radiant', at: 800 },
]

export function levelFor(light: number) {
  let i = 0
  while (i + 1 < LEVELS.length && light >= LEVELS[i + 1].at) i++
  const cur = LEVELS[i]
  const next = LEVELS[i + 1]
  const progress = next ? (light - cur.at) / (next.at - cur.at) : 1
  return { index: i, level: i + 1, name: cur.name, next, progress }
}

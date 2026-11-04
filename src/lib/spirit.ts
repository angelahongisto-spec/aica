// Original affirmations written for AiCA, inspired by nature and stillness.
export const AFFIRMATIONS = [
  'Like water, I find my way.',
  'The lotus rises from the mud. So do I.',
  'What is meant for me flows to me.',
  'Slow is also a direction.',
  'Today I plant, tomorrow I bloom.',
  'I am the calm in my own storm.',
  'Roots first, then flowers.',
  'I move gently and still arrive.',
  'The tide always returns. So does my energy.',
  'I make space, and good things fill it.',
  'Breathe in light, breathe out hurry.',
  'Every small step is a petal opening.',
]

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

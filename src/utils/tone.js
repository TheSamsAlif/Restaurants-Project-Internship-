// Each menu category gets a stable colour so the menu can be scanned at a glance.
// The colours themselves live in app.scss (.tone-0 ... .tone-5) with light and dark variants.
const TONES = 6

export function toneClass(category = '') {
  let h = 0
  for (const ch of String(category).toLowerCase()) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return `tone-${h % TONES}`
}

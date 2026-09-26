/** Short unique id. crypto.randomUUID() needs HTTPS, so this works everywhere. */
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

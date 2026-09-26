// Password hashing for Local Storage persistence
export function hashPassword(email, password) {
  const payload = `${email.trim().toLowerCase()}::${password}`
  try {
    return btoa(encodeURIComponent(payload))
  } catch {
    return payload
  }
}

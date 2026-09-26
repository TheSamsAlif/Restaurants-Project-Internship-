const blank = (v) => v === null || v === undefined || String(v).trim() === ''

export const required = (message = 'This field is required') => (v) =>
  !blank(v) || message

export const emailRule = (v) =>
  blank(v) ||
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()) ||
  'Enter a valid email address'

export const phoneRule = (v) =>
  blank(v) ||
  /^\+?[0-9][0-9\s-]{6,17}$/.test(String(v).trim()) ||
  'Enter a valid phone number'

export const minLength = (n) => (v) =>
  blank(v) || String(v).length >= n || `Must be at least ${n} characters`

export const sameAs = (getOther, message = 'Passwords do not match') => (v) =>
  v === getOther() || message

export const positivePrice = (v) =>
  Number(v) > 0 || 'Enter a price greater than 0'

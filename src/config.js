// One place for the numbers and labels the whole app shares.
export const APP_NAME = 'Resto POS'

// Every Local Storage key is prefixed so the app never collides with other sites on localhost.
export const STORAGE_PREFIX = 'restopos:'

// Billing
export const TAX_RATE = 0.05 // 5% VAT, shown as a separate line on invoices
export const CURRENCY_SYMBOL = '৳' // used on screen
export const CURRENCY_CODE = 'BDT' // used in the text and PDF invoices (standard PDF fonts have no ৳ glyph)

// Logos are shrunk before saving so they fit comfortably inside the ~5 MB Local Storage quota.
export const LOGO_MAX_SIDE = 320
export const LOGO_MAX_FILE_MB = 5

import { CURRENCY_CODE, CURRENCY_SYMBOL } from '@/config'

export const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100

const number = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** ৳1,250.00 - for screens. */
export const formatMoney = (n) => `${CURRENCY_SYMBOL}${number.format(Number(n) || 0)}`

/** BDT 1,250.00 - for text files and PDFs, where the ৳ glyph may not exist. */
export const formatMoneyPlain = (n) => `${CURRENCY_CODE} ${number.format(Number(n) || 0)}`

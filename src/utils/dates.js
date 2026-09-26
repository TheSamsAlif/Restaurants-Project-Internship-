import { date } from 'quasar'

/** 22 Sep 2026, 08:14 PM */
export const formatDateTime = (iso) => (iso ? date.formatDate(new Date(iso), 'DD MMM YYYY, hh:mm A') : '')

/** Start of the day N days ago (0 = today). */
export function startOfDaysAgo(days) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - days)
  return d.getTime()
}

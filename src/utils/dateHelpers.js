export function formatShortDate(value) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
}

export function daysUntil(value) {
  const dayMs = 24 * 60 * 60 * 1000
  return Math.ceil((new Date(value).getTime() - Date.now()) / dayMs)
}

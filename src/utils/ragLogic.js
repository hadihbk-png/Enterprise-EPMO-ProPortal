export function getRagStatus(score) {
  if (score >= 80) return { label: 'Green', color: '#10b981' }
  if (score >= 55) return { label: 'Amber', color: '#f59e0b' }
  return { label: 'Red', color: '#f43f5e' }
}

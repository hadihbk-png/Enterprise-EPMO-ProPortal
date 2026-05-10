export function calculateRiskScore({ probability = 1, impact = 1 }) {
  return Math.min(25, Math.max(1, probability * impact))
}

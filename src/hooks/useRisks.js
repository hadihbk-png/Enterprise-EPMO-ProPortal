import { useEffect, useState } from 'react'
import { fetchRisks } from '../services/api.js'

export function useRisks() {
  const [risks, setRisks] = useState([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    fetchRisks().then(setRisks).finally(() => setLoading(false))
  }, [])

  return { risks, isLoading }
}

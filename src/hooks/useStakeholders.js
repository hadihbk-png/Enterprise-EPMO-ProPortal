import { useEffect, useState } from 'react'
import { fetchStakeholders } from '../services/api.js'

export function useStakeholders() {
  const [stakeholders, setStakeholders] = useState([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    fetchStakeholders().then(setStakeholders).finally(() => setLoading(false))
  }, [])

  return { stakeholders, isLoading }
}

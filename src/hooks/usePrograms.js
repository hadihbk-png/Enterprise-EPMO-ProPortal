import { useEffect, useState } from 'react'
import { fetchPrograms } from '../services/api.js'

export function usePrograms() {
  const [programs, setPrograms] = useState([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrograms().then(setPrograms).finally(() => setLoading(false))
  }, [])

  return { programs, isLoading }
}

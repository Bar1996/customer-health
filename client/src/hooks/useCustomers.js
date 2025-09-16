import { useEffect, useState } from 'react'
import { getCustomers } from '../services/api'

export function useCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true)
        const data = await getCustomers()
        setCustomers(data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [])

  return { customers, loading, error }
}
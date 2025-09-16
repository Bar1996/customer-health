import { useState } from 'react'
import { getCustomerHealth } from '../services/api'

export function useCustomerHealth() {
  const [health, setHealth] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function fetchHealth(id) {
    try {
      setLoading(true)
      const data = await getCustomerHealth(id)
      setSelectedCustomer(data.customer)
      setHealth(data.health)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return { health, selectedCustomer, loading, error, fetchHealth }
}
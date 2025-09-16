import { useState } from 'react'
import { useCustomers } from '../hooks/useCustomers'
import { useCustomerHealth } from '../hooks/useCustomerHealth'
import CustomerTable from '../components/CustomerTable'
import HealthPanel from '../components/HealthPanel'
import Modal from '../components/Modal'

export default function Dashboard() {
  const { customers, loading: loadingCustomers, error: customersError } = useCustomers()
  const { health, selectedCustomer, loading: loadingHealth, error: healthError, fetchHealth } = useCustomerHealth()
  const [isModalOpen, setModalOpen] = useState(false)

  async function handleSelect(id) {
    await fetchHealth(id)
    setModalOpen(true)
  }

  if (loadingCustomers) return <p className="p-6">Loading customers...</p>
  if (customersError) return <p className="p-6 text-red-500">Failed to load customers</p>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4">Customer Health Dashboard</h1>

      <CustomerTable customers={customers} onSelect={handleSelect} />

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        {loadingHealth && <p>Loading health data...</p>}
        {healthError && <p className="text-red-500">Failed to load health data</p>}
        {selectedCustomer && <HealthPanel customer={selectedCustomer} health={health} />}
      </Modal>
    </div>
  )
}
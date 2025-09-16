// client/src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 📌 Interceptor לפני שליחת הבקשה
api.interceptors.request.use(
  (config) => {


    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 📌 Interceptor לתשובה
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // לוג כללי לשגיאות
    if (error.response) {
      console.error(
        `[API Error] ${error.response.status} ${error.config?.url}`,
        error.response.data
      )
      alert(`Error ${error.response.status}: ${error.response.data.error || 'Something went wrong'}`)
    } else {
      console.error(`[API Error] ${error.message}`)
      alert('Network error, please check your connection')
    }

    return Promise.reject(error)
  }
)

export async function getCustomers() {
  const { data } = await api.get('/customers')
  return data
}

export async function getCustomerHealth(id) {
  const { data } = await api.get(`/customers/${id}/health`)
  return data
}


export async function addEvent(customerId, eventType, date) {
  const res = await api.post(`/customers/${customerId}/events`, {
    event_type: eventType,
    event_date: date,
  });
  return res.data;
}

export default api;

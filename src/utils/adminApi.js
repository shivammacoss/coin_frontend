// Admin API helper with authentication
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export const adminFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('adminToken')
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, config)
  
  // If 401, redirect to admin login
  if (response.status === 401) {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    window.location.href = '/admin'
    throw new Error('Unauthorized')
  }
  
  return response
}

export default adminFetch

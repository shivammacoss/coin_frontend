// Centralized API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

// API endpoints
export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/auth`,
  ADMIN_AUTH: `${API_BASE_URL}/admin-auth`,
  ADMIN: `${API_BASE_URL}/admin`,
  ACCOUNT_TYPES: `${API_BASE_URL}/account-types`,
  TRADING_ACCOUNTS: `${API_BASE_URL}/trading-accounts`,
  WALLET: `${API_BASE_URL}/wallet`,
  PAYMENT_METHODS: `${API_BASE_URL}/payment-methods`,
  TRADE: `${API_BASE_URL}/trade`,
  WALLET_TRANSFER: `${API_BASE_URL}/wallet-transfer`,
  ADMIN_TRADE: `${API_BASE_URL}/admin/trade`,
  COPY: `${API_BASE_URL}/copy`,
  IB: `${API_BASE_URL}/ib`,
  PROP: `${API_BASE_URL}/prop`,
  CHARGES: `${API_BASE_URL}/charges`,
  PRICES: `${API_BASE_URL}/prices`,
  EARNINGS: `${API_BASE_URL}/earnings`,
  SUPPORT: `${API_BASE_URL}/support`,
}

export default API_BASE_URL

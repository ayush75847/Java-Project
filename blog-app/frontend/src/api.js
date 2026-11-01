import axios from 'axios'

export const API_URL = 'http://localhost:8080'

// One axios instance for the whole app.
const api = axios.create({ baseURL: API_URL })

// Before every request: attach the JWT if we have one.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Turns a backend error ({ message: "..." }) into a readable string.
export function errorMessage(err) {
  return err.response?.data?.message || err.message || 'Something went wrong'
}

export default api

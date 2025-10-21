import { api } from './api'

const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds

let sessionTimer = null

const startSessionTimer = () => {
  clearSessionTimer()
  
  sessionTimer = setTimeout(() => {
    logout()
    window.location.href = '/login'
    alert('Your session has expired. Please log in again.')
  }, SESSION_TIMEOUT)
}

const clearSessionTimer = () => {
  if (sessionTimer) {
    clearTimeout(sessionTimer)
    sessionTimer = null
  }
}

const resetSessionTimer = () => {
  startSessionTimer()
}

// Reset timer on user activity
if (typeof window !== 'undefined') {
  ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetSessionTimer, true)
  })
}

export const login = async (email, password) => {
  const response = await api.login(email, password)
  
  if (response.token) {
    localStorage.setItem('token', response.token)
    
    const user = {
      id: response.userId,
      email: response.email,
      role: response.role
    }
    
    localStorage.setItem('user', JSON.stringify(user))
    startSessionTimer()
    
    return user
  }
  
  throw new Error('Login failed')
}

export const register = async (name, email, password, role, specialization) => {
  return await api.register(name, email, password, role, specialization)
}

export const logout = () => {
  clearSessionTimer()
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

export const getToken = () => {
  return localStorage.getItem('token')
}

export const isAuthenticated = () => {
  return !!getToken()
}

export const validateSession = async () => {
  try {
    const result = await api.validateSession()
    if (result.valid) {
      resetSessionTimer()
      return true
    }
    logout()
    return false
  } catch (error) {
    logout()
    return false
  }
}

// Initialize session timer if user is logged in
if (isAuthenticated()) {
  startSessionTimer()
}

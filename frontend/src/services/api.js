const API_BASE_URL = 'http://localhost:8080/api'

const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

const handleResponse = async (response) => {
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
    throw new Error('Session expired')
  }
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }))
    throw new Error(error.message || 'Request failed')
  }
  
  return response.json()
}

export const api = {
  // Auth
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    return handleResponse(response)
  },

  register: async (name, email, password, role, specialization) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, specialization })
    })
    return handleResponse(response)
  },

  validateSession: async () => {
    const token = localStorage.getItem('token')
    if (!token) return { valid: false }
    
    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return handleResponse(response)
  },

  // Users
  getUsers: async (page = 0, size = 100) => {
    const response = await fetch(`${API_BASE_URL}/users?page=${page}&size=${size}`, {
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  getActiveUsersCount: async () => {
    const response = await fetch(`${API_BASE_URL}/users/active-count`, {
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  getUserById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  updateCurrentUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PUT',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    return handleResponse(response)
  },

  updateUser: async (id, userData) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    return handleResponse(response)
  },

  deleteUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  // Appointments
  getMyAppointments: async () => {
    const response = await fetch(`${API_BASE_URL}/appointments/my-appointments`, {
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  getDoctors: async () => {
    const response = await fetch(`${API_BASE_URL}/appointments/doctors`, {
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  scheduleAppointment: async (clinicianId, scheduledTime, notes) => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ clinicianId, scheduledTime, notes })
    })
    return handleResponse(response)
  },

  updateAppointmentStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}/status`, {
      method: 'PUT',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    return handleResponse(response)
  },

  cancelAppointment: async (id) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  updateAppointment: async (id, scheduledTime) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheduledTime })
    })
    return handleResponse(response)
  },

  checkAppointmentConflict: async (clinicianId, scheduledTime) => {
    const response = await fetch(`${API_BASE_URL}/appointments/check-conflict?clinicianId=${clinicianId}&scheduledTime=${scheduledTime}`, {
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  // Health Metrics
  logHealthMetric: async (data) => {
    const response = await fetch(`${API_BASE_URL}/health-metrics`, {
      method: 'POST',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  getUserHealthMetrics: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/health-metrics/user/${userId}`, {
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  // Support Tickets
  createSupportTicket: async (subject, description) => {
    const response = await fetch(`${API_BASE_URL}/support-tickets`, {
      method: 'POST',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, description })
    })
    return handleResponse(response)
  },

  getPendingTickets: async () => {
    const response = await fetch(`${API_BASE_URL}/support-tickets/queue`, {
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  acceptTicket: async (id) => {
    const response = await fetch(`${API_BASE_URL}/support-tickets/${id}/accept`, {
      method: 'POST',
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  resolveTicket: async (id) => {
    const response = await fetch(`${API_BASE_URL}/support-tickets/${id}/resolve`, {
      method: 'PUT',
      headers: getAuthHeader()
    })
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
      throw new Error('Session expired')
    }
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }))
      throw new Error(error.message || 'Request failed')
    }
    return { success: true }
  },

  // Compliance
  getComplianceLogs: async (startDate, endDate) => {
    let url = `${API_BASE_URL}/compliance/logs`
    if (startDate && endDate) {
      url += `?startDate=${startDate}T00:00:00&endDate=${endDate}T23:59:59`
    }
    const response = await fetch(url, {
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  exportLogsToCSV: async (startDate, endDate) => {
    let url = `${API_BASE_URL}/compliance/export/csv`
    if (startDate && endDate) {
      url += `?startDate=${startDate}T00:00:00&endDate=${endDate}T23:59:59`
    }
    const response = await fetch(url, {
      headers: getAuthHeader()
    })
    if (!response.ok) throw new Error('Export failed')
    return response.text()
  },

  // Diet Plan Requests
  createDietRequest: async (data) => {
    const response = await fetch(`${API_BASE_URL}/diet-requests`, {
      method: 'POST',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  getMyDietRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/diet-requests/my-requests`, {
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  getDietRequestQueue: async () => {
    const response = await fetch(`${API_BASE_URL}/diet-requests/queue`, {
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  acceptDietRequest: async (id) => {
    const response = await fetch(`${API_BASE_URL}/diet-requests/${id}/accept`, {
      method: 'POST',
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  updateDietRequest: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/diet-requests/${id}`, {
      method: 'PUT',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  deleteDietRequest: async (id) => {
    const response = await fetch(`${API_BASE_URL}/diet-requests/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    })
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
      throw new Error('Session expired')
    }
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }))
      throw new Error(error.message || 'Request failed')
    }
    return { success: true }
  },

  // Support Ticket Messages
  getMyTickets: async () => {
    const response = await fetch(`${API_BASE_URL}/support-tickets/my-tickets`, {
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  checkTicketChatAccess: async (ticketId) => {
    const response = await fetch(`${API_BASE_URL}/support-tickets/${ticketId}/chat-access`, {
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  // Messages
  sendMessage: async (recipientId, content) => {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId, content })
    })
    return handleResponse(response)
  },

  sendTicketMessage: async (ticketId, content) => {
    const response = await fetch(`${API_BASE_URL}/messages/ticket/${ticketId}`, {
      method: 'POST',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    })
    return handleResponse(response)
  },

  getTicketMessages: async (ticketId) => {
    const response = await fetch(`${API_BASE_URL}/messages/ticket/${ticketId}`, {
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  getInbox: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/messages/inbox/${userId}`, {
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  getSentMessages: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/messages/sent/${userId}`, {
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  markMessageAsRead: async (messageId) => {
    const response = await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
      method: 'PUT',
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  // Care Plans
  createCarePlan: async (patientId, creatorId, planType, content) => {
    const response = await fetch(`${API_BASE_URL}/care-plans`, {
      method: 'POST',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, creatorId, planType, content })
    })
    return handleResponse(response)
  },

  updateCarePlan: async (id, content) => {
    const response = await fetch(`${API_BASE_URL}/care-plans/${id}`, {
      method: 'PUT',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    })
    return handleResponse(response)
  },

  updateAdherence: async (id, adherencePercentage) => {
    const response = await fetch(`${API_BASE_URL}/care-plans/${id}/adherence`, {
      method: 'PUT',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ adherencePercentage })
    })
    return handleResponse(response)
  },

  getPatientCarePlans: async (patientId) => {
    const response = await fetch(`${API_BASE_URL}/care-plans/patient/${patientId}`, {
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  getCreatorCarePlans: async (creatorId) => {
    const response = await fetch(`${API_BASE_URL}/care-plans/creator/${creatorId}`, {
      headers: getAuthHeader()
    })
    return handleResponse(response)
  },

  getAcceptedPatients: async () => {
    const response = await fetch(`${API_BASE_URL}/diet-requests/accepted-patients`, {
      headers: getAuthHeader()
    })
    return handleResponse(response)
  }
}

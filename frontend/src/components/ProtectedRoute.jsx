import { Navigate } from 'react-router-dom'
import { getCurrentUser } from '../services/auth'

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = getCurrentUser()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }
  
  return children
}

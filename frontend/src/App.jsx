import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Unauthorized from './pages/Unauthorized'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/patient/Dashboard'
import Appointments from './pages/patient/Appointments'
import DietRequest from './pages/patient/DietRequest'
import Support from './pages/patient/Support'
import SupportChat from './pages/patient/SupportChat'
import MyTickets from './pages/patient/MyTickets'
import Profile from './pages/patient/Profile'
import PatientMealPlans from './pages/patient/MealPlans'
import DoctorDashboard from './pages/doctor/Dashboard'
import PendingAppointments from './pages/doctor/PendingAppointments'
import PastAppointments from './pages/doctor/PastAppointments'
import DoctorSupport from './pages/doctor/Support'
import DoctorSupportChat from './pages/patient/SupportChat'
import DoctorMyTickets from './pages/doctor/MyTickets'
import DoctorProfile from './pages/doctor/Profile'
import DietitianDashboard from './pages/dietitian/Dashboard'
import DietitianPendingAppointments from './pages/dietitian/PendingAppointments'
import DietitianPastAppointments from './pages/dietitian/PastAppointments'
import DietitianSupport from './pages/dietitian/Support'
import DietitianSupportChat from './pages/patient/SupportChat'
import DietitianMyTickets from './pages/dietitian/MyTickets'
import DietitianProfile from './pages/dietitian/Profile'
import DietitianMealPlans from './pages/dietitian/MealPlans'
import DietitianDietRequests from './pages/dietitian/DietRequests'
import SupportStaffDashboard from './pages/support-staff/Dashboard'
import PendingTickets from './pages/support-staff/PendingTickets'
import TicketChat from './pages/support-staff/TicketChat'
import ContactStaff from './pages/support-staff/ContactStaff'
import SupportStaffProfile from './pages/support-staff/Profile'
import AdminDashboard from './pages/admin/Dashboard'
import AdminComplianceLogs from './pages/admin/ComplianceLogs'
import UserManagement from './pages/admin/UserManagement'
import AdminContactStaff from './pages/admin/ContactStaff'
import AdminProfile from './pages/admin/Profile'
import SuperAdminDashboard from './pages/super-admin/Dashboard'
import ComplianceLogs from './pages/super-admin/ComplianceLogs'
import SuperAdminUserManagement from './pages/super-admin/UserManagement'
import SuperAdminContactInformation from './pages/super-admin/ContactInformation'
import SuperAdminProfile from './pages/super-admin/Profile'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/patient/dashboard" element={<ProtectedRoute allowedRoles={['PATIENT']}><Dashboard /></ProtectedRoute>} />
      <Route path="/patient/appointments" element={<ProtectedRoute allowedRoles={['PATIENT']}><Appointments /></ProtectedRoute>} />
      <Route path="/patient/diet-request" element={<ProtectedRoute allowedRoles={['PATIENT']}><DietRequest /></ProtectedRoute>} />
      <Route path="/patient/support" element={<ProtectedRoute allowedRoles={['PATIENT']}><Support /></ProtectedRoute>} />
      <Route path="/patient/support/my-tickets" element={<ProtectedRoute allowedRoles={['PATIENT']}><MyTickets /></ProtectedRoute>} />
      <Route path="/patient/support/chat/:ticketId" element={<ProtectedRoute allowedRoles={['PATIENT']}><SupportChat /></ProtectedRoute>} />
      <Route path="/patient/profile" element={<ProtectedRoute allowedRoles={['PATIENT']}><Profile /></ProtectedRoute>} />
      <Route path="/patient/meal-plans" element={<ProtectedRoute allowedRoles={['PATIENT']}><PatientMealPlans /></ProtectedRoute>} />
      <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={['DOCTOR']}><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/doctor/appointments/pending" element={<ProtectedRoute allowedRoles={['DOCTOR']}><PendingAppointments /></ProtectedRoute>} />
      <Route path="/doctor/appointments/past" element={<ProtectedRoute allowedRoles={['DOCTOR']}><PastAppointments /></ProtectedRoute>} />
      <Route path="/doctor/support" element={<ProtectedRoute allowedRoles={['DOCTOR']}><DoctorSupport /></ProtectedRoute>} />
      <Route path="/doctor/support/my-tickets" element={<ProtectedRoute allowedRoles={['DOCTOR']}><DoctorMyTickets /></ProtectedRoute>} />
      <Route path="/doctor/support/chat/:ticketId" element={<ProtectedRoute allowedRoles={['DOCTOR']}><DoctorSupportChat /></ProtectedRoute>} />
      <Route path="/doctor/profile" element={<ProtectedRoute allowedRoles={['DOCTOR']}><DoctorProfile /></ProtectedRoute>} />
      <Route path="/dietitian/dashboard" element={<ProtectedRoute allowedRoles={['DIETITIAN']}><DietitianDashboard /></ProtectedRoute>} />
      <Route path="/dietitian/appointments/pending" element={<ProtectedRoute allowedRoles={['DIETITIAN']}><DietitianPendingAppointments /></ProtectedRoute>} />
      <Route path="/dietitian/appointments/past" element={<ProtectedRoute allowedRoles={['DIETITIAN']}><DietitianPastAppointments /></ProtectedRoute>} />
      <Route path="/dietitian/support" element={<ProtectedRoute allowedRoles={['DIETITIAN']}><DietitianSupport /></ProtectedRoute>} />
      <Route path="/dietitian/support/my-tickets" element={<ProtectedRoute allowedRoles={['DIETITIAN']}><DietitianMyTickets /></ProtectedRoute>} />
      <Route path="/dietitian/support/chat/:ticketId" element={<ProtectedRoute allowedRoles={['DIETITIAN']}><DietitianSupportChat /></ProtectedRoute>} />
      <Route path="/dietitian/profile" element={<ProtectedRoute allowedRoles={['DIETITIAN']}><DietitianProfile /></ProtectedRoute>} />
      <Route path="/dietitian/meal-plans" element={<ProtectedRoute allowedRoles={['DIETITIAN']}><DietitianMealPlans /></ProtectedRoute>} />
      <Route path="/dietitian/diet-requests" element={<ProtectedRoute allowedRoles={['DIETITIAN']}><DietitianDietRequests /></ProtectedRoute>} />
      <Route path="/support-staff/dashboard" element={<ProtectedRoute allowedRoles={['SUPPORT_STAFF']}><SupportStaffDashboard /></ProtectedRoute>} />
      <Route path="/support-staff/tickets" element={<ProtectedRoute allowedRoles={['SUPPORT_STAFF']}><PendingTickets /></ProtectedRoute>} />
      <Route path="/support-staff/chat/:ticketId" element={<ProtectedRoute allowedRoles={['SUPPORT_STAFF']}><TicketChat /></ProtectedRoute>} />
      <Route path="/support-staff/contact" element={<ProtectedRoute allowedRoles={['SUPPORT_STAFF']}><ContactStaff /></ProtectedRoute>} />
      <Route path="/support-staff/profile" element={<ProtectedRoute allowedRoles={['SUPPORT_STAFF']}><SupportStaffProfile /></ProtectedRoute>} />
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/compliance" element={<ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}><AdminComplianceLogs /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}><UserManagement /></ProtectedRoute>} />
      <Route path="/admin/contact" element={<ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}><AdminContactStaff /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}><AdminProfile /></ProtectedRoute>} />
      <Route path="/super-admin/dashboard" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><SuperAdminDashboard /></ProtectedRoute>} />
      <Route path="/super-admin/compliance" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'SYSTEM_ADMIN']}><ComplianceLogs /></ProtectedRoute>} />
      <Route path="/super-admin/users" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><SuperAdminUserManagement /></ProtectedRoute>} />
      <Route path="/super-admin/contact" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><SuperAdminContactInformation /></ProtectedRoute>} />
      <Route path="/super-admin/profile" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><SuperAdminProfile /></ProtectedRoute>} />
    </Routes>
  )
}

export default App

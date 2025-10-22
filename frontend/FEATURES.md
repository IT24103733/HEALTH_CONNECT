# Health Connect Frontend - Feature Documentation

This document provides a comprehensive overview of the frontend implementation for each major feature in the Health Connect platform.

---

## 1. RBAC and Security

### Overview
Role-based user interface with JWT authentication, automatic logout, session management, and role-specific navigation.

### Frontend Code Files

#### Authentication
- `pages/Login.jsx` - Login form with JWT token storage
  - Email/password authentication
  - Token storage in localStorage
  - Automatic redirect to role-specific dashboard
  - Error handling for invalid credentials

- `pages/Register.jsx` - User registration form
  - Role selection dropdown
  - Password confirmation validation
  - Automatic login after registration

#### API Integration
- `services/api.js` - Centralized API client with authentication
  - `login(email, password)` - Authenticate and receive JWT token
  - `register(userData)` - Create new user account
  - `getCurrentUser()` - Get current user profile
  - `updateCurrentUser(userData)` - Update current user profile
  - Automatic token injection in Authorization header
  - Automatic logout on 401/403 responses

#### Role-Based Dashboards
- `pages/PatientDashboard.jsx` - Patient home page with health metrics summary
- `pages/DoctorDashboard.jsx` - Doctor home page with appointment overview
- `pages/DietitianDashboard.jsx` - Dietitian home page with pending diet requests
- `pages/SupportStaffDashboard.jsx` - Support staff home page with ticket queue
- `pages/AdminDashboard.jsx` - Admin home page with user management and active users count
- `pages/SuperAdminDashboard.jsx` - Super admin home page with system overview

#### Navigation Components
- `components/PatientSidebar.jsx` - Patient navigation menu with logout button
- `components/DoctorSidebar.jsx` - Doctor navigation menu with logout button
- `components/DietitianSidebar.jsx` - Dietitian navigation menu with logout button
- `components/SupportStaffSidebar.jsx` - Support staff navigation menu with logout button
- `components/AdminSidebar.jsx` - Admin navigation menu with logout button
- `components/SuperAdminSidebar.jsx` - Super admin navigation menu with logout button

#### Profile Management
- `pages/PatientProfile.jsx` - Patient profile view/edit with real user data
- `pages/DoctorProfile.jsx` - Doctor profile view/edit with real user data
- `pages/DietitianProfile.jsx` - Dietitian profile view/edit with real user data
- `pages/SupportStaffProfile.jsx` - Support staff profile view/edit with real user data
- `pages/AdminProfile.jsx` - Admin profile view/edit with real user data
- `pages/SuperAdminProfile.jsx` - Super admin profile view/edit with real user data

#### Routing
- `App.jsx` - React Router configuration with role-based routes
  - Public routes: /login, /register
  - Patient routes: /patient/*
  - Doctor routes: /doctor/*
  - Dietitian routes: /dietitian/*
  - Support staff routes: /support-staff/*
  - Admin routes: /admin/*
  - Super admin routes: /super-admin/*

### Key Security Features
- **JWT Token Storage** - Stored in localStorage with automatic injection
- **Automatic Logout** - On token expiry (401) or forbidden access (403)
- **Role-Based Routing** - Separate route namespaces per role
- **Logout Functionality** - Clear token and user data, redirect to login
- **Session Persistence** - User data cached in localStorage

### Logout Implementation
All sidebar components include logout button:
```javascript
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  navigate('/login');
};
```

---

## 2. Health Metrics

### Overview
Daily health data logging with visual progress tracking, trend analysis, and health score display.

### Frontend Code Files

#### Health Metrics Pages
- `pages/HealthMetrics.jsx` - Health metrics logging and viewing
  - Daily metric entry form (calories, exercise, sleep, water, symptoms, energy)
  - Metrics history table with date, health score, and details
  - Date range filtering
  - Health score display (0-100 with color coding)
  - Edit/delete functionality for existing metrics

- `pages/HealthTrends.jsx` - Visual trend analysis and charts
  - Weekly aggregated trends
  - Line charts for calories, exercise, sleep, water
  - Average calculations
  - Date range filtering
  - Health score trend visualization

#### API Integration
- `services/api.js` - Health metrics API methods
  - `logHealthMetric(metricData)` - Create new health metric entry
  - `getUserHealthMetrics(userId)` - Get user's metrics history
  - `getHealthMetricsInRange(userId, startDate, endDate)` - Date-filtered metrics
  - `getWeeklyTrends(userId)` - Get aggregated weekly trends

### Health Metrics Form Fields
- **Calories Intake** - Daily calorie consumption
- **Exercise Minutes** - Physical activity duration
- **Sleep Hours** - Sleep duration
- **Water Intake (ml)** - Hydration tracking
- **Symptoms** - Text description of any symptoms
- **Energy Level** - Subjective energy rating (1-10)
- **Health Score** - Auto-calculated (0-100)

### Visual Features
- **Color-Coded Scores** - Green (80+), Yellow (50-79), Red (<50)
- **Trend Charts** - Line graphs for each metric over time
- **Weekly Aggregation** - Average values per week
- **Date Filtering** - Custom date range selection

---

## 3. Care Plan Coordination

### Overview
Patient-clinician care coordination with meal plans (dietitian) and treatment plans (doctor), adherence tracking, and progress monitoring.

### Frontend Code Files

#### Patient Views
- `pages/CarePlans.jsx` - Patient view of assigned care plans
  - List of active meal plans and treatment plans
  - Plan details (title, description, content)
  - Adherence percentage display with progress bar
  - Creator information (dietitian/doctor name)
  - Color-coded adherence (Green 80+, Yellow 50-79, Red <50)

#### Dietitian Views
- `pages/MealPlans.jsx` - Dietitian meal plan management
  - List of accepted patients (from diet plan requests)
  - Create meal plan form (patient selection, title, description, content)
  - View existing meal plans by patient
  - Update adherence percentage
  - Edit meal plan content

#### Doctor Views
- `pages/TreatmentPlans.jsx` - Doctor treatment plan management
  - Patient selection dropdown
  - Create treatment plan form (title, description, content)
  - View existing treatment plans by patient
  - Update adherence percentage
  - Edit treatment plan content

#### API Integration
- `services/api.js` - Care plan API methods
  - `createCarePlan(carePlanData)` - Create new care plan (MEAL_PLAN or TREATMENT_PLAN)
  - `updateCarePlanContent(id, contentData)` - Update plan details
  - `updateCarePlanAdherence(id, adherenceData)` - Update adherence percentage
  - `getPatientCarePlans(patientId)` - Get patient's care plans
  - `getCreatorCarePlans(creatorId)` - Get creator's care plans
  - `getAcceptedPatients()` - Get dietitian's accepted patients (for meal plans)

### Care Plan Types
- **MEAL_PLAN** - Created by dietitian, nutrition-focused
- **TREATMENT_PLAN** - Created by doctor, medical treatment-focused

### Adherence Tracking
- **Percentage Display** - 0-100% with progress bar
- **Color Coding** - Visual feedback on adherence level
- **Editable by Creator** - Dietitian/doctor can update adherence
- **Patient View** - Read-only adherence display for patients

---

## 4. Appointment Management

### Overview
Calendar-based appointment scheduling with conflict detection, status tracking, and role-specific management.

### Frontend Code Files

#### Patient Views
- `pages/Appointments.jsx` - Patient appointment management
  - List of available doctors/dietitians
  - Book appointment form (clinician selection, date/time picker, notes)
  - My appointments list with status badges
  - Edit appointment time with conflict detection
  - Cancel appointment functionality
  - Color-coded status (Green: SCHEDULED, Blue: DONE, Red: CANCELLED)
  - Disabled edit/delete for cancelled appointments

#### Doctor/Dietitian Views
- `pages/DoctorAppointments.jsx` - Doctor appointment management
  - List of scheduled appointments
  - Update status to DONE or CANCELLED
  - View appointment details (patient name, time, notes)
  - Status badges with color coding

- `pages/DietitianAppointments.jsx` - Dietitian appointment management
  - List of scheduled appointments
  - Update status to DONE or CANCELLED
  - View appointment details (patient name, time, notes)
  - Status badges with color coding

#### API Integration
- `services/api.js` - Appointment API methods
  - `getDoctors()` - Get list of available doctors/dietitians
  - `bookAppointment(appointmentData)` - Create new appointment
  - `updateAppointment(id, appointmentData)` - Update appointment time
  - `cancelAppointment(id)` - Cancel appointment
  - `updateAppointmentStatus(id, status)` - Update status to DONE/CANCELLED
  - `getMyAppointments()` - Get current user's appointments
  - `checkAppointmentConflict(clinicianId, scheduledTime)` - Check time slot availability

### Appointment Status Workflow
1. **SCHEDULED** - Initial state (green badge)
2. **DONE** - Completed by clinician (blue badge)
3. **CANCELLED** - Cancelled by patient or clinician (red badge)

### Conflict Detection
- **Real-time Validation** - Check before booking/updating
- **Time Window** - ±30 minutes from requested time
- **Visual Feedback** - Error message if conflict detected
- **Automatic Prevention** - Cannot book conflicting slots

### Visual Features
- **Status Badges** - Color-coded appointment status
- **Date/Time Picker** - Calendar-based scheduling
- **Clinician Selection** - Dropdown with doctor/dietitian names
- **Edit Modal** - Update appointment time with validation
- **Conditional Buttons** - Hide edit/delete for cancelled appointments

---

## 5. Communication Hub

### Overview
Ticket-based support system with real-time chat, queue management, and role-based access control.

### Frontend Code Files

#### Patient Views
- `pages/MyTickets.jsx` - Patient support ticket management
  - Create new ticket form (subject, description)
  - List of created tickets with status badges
  - View chat button (enabled for ASSIGNED/IN_PROGRESS tickets)
  - Status display (OPEN: waiting for assignment, ASSIGNED: chat enabled)

#### Support Staff Views
- `pages/SupportTicketQueue.jsx` - Support staff ticket queue
  - List of open (unassigned) tickets
  - Accept ticket button to claim from queue
  - Ticket details (subject, description, created date)

- `pages/ActiveTickets.jsx` - Support staff active tickets
  - List of assigned/in-progress tickets
  - View chat button for each ticket
  - Ticket status display

- `pages/MyTickets.jsx` - Support staff assigned tickets
  - List of tickets assigned to current staff member
  - View chat button
  - Mark as resolved functionality

#### Doctor/Dietitian Views
- `pages/MyTickets.jsx` - Doctor/Dietitian support ticket management
  - Create new ticket form (subject, description)
  - List of created tickets with status badges
  - View chat button (enabled for ASSIGNED/IN_PROGRESS tickets)

#### Chat Interface
- `pages/TicketChat.jsx` - Real-time ticket chat
  - Message history display with sender names
  - Send message form
  - Auto-scroll to latest message
  - Mark as resolved button (support staff only)
  - Access control validation

#### API Integration
- `services/api.js` - Support ticket and messaging API methods
  - `createSupportTicket(ticketData)` - Create new support ticket
  - `getOpenTickets()` - Get unassigned tickets (support staff queue)
  - `acceptTicket(ticketId)` - Accept ticket from queue
  - `resolveTicket(ticketId)` - Mark ticket as resolved
  - `getMyTickets()` - Get user's created or assigned tickets
  - `checkChatAccess(ticketId)` - Validate chat access permissions
  - `sendTicketMessage(ticketId, content)` - Send message in ticket chat
  - `getTicketMessages(ticketId)` - Get ticket chat history

### Ticket Status Workflow
1. **OPEN** - Created, waiting for staff assignment (gray badge)
2. **ASSIGNED** - Accepted by support staff, chat enabled (blue badge)
3. **IN_PROGRESS** - Active conversation (yellow badge)
4. **RESOLVED** - Issue resolved by staff (green badge)
5. **CLOSED** - Ticket archived (dark gray badge)

### Chat Access Control
- **Ticket Creator** - Can view/send messages on their tickets
- **Assigned Staff** - Can view/send messages on assigned tickets
- **Other Users** - No access (403 error)

### Visual Features
- **Status Badges** - Color-coded ticket status
- **Chat Bubbles** - Sender-specific message styling
- **Real-time Updates** - Message list refreshes on send
- **Conditional Buttons** - Show/hide based on ticket status
- **Queue Management** - Support staff can claim tickets

---

## 6. Compliance Documentation

### Overview
Admin-only audit log viewing with date filtering, user-specific tracking, and CSV export for regulatory compliance.

### Frontend Code Files

#### Admin Views
- `pages/ComplianceLogs.jsx` - Compliance audit log viewer
  - Access log table (user, action, timestamp, IP address)
  - Date range filtering (start date, end date)
  - User-specific log filtering
  - CSV export button
  - Pagination for large datasets
  - Sort by timestamp (newest first)

#### Super Admin Views
- `pages/ComplianceLogs.jsx` - Same as admin view (shared component)

#### API Integration
- `services/api.js` - Compliance API methods
  - `getAccessLogs(startDate, endDate)` - Get all access logs with date filtering
  - `getUserAccessLogs(userId, startDate, endDate)` - Get user-specific logs
  - `exportLogsToCSV(startDate, endDate)` - Download CSV report

### Logged Information Display
- **User ID** - Who performed the action
- **Action** - HTTP method and endpoint (e.g., "GET /api/health-metrics/user/1")
- **Timestamp** - When the action occurred (formatted date/time)
- **IP Address** - Client IP address
- **User Agent** - Browser/client information (truncated for display)

### Filtering Options
- **Date Range** - Start date and end date pickers
- **User Filter** - Filter by specific user ID
- **Clear Filters** - Reset to show all logs

### CSV Export
- **Download Button** - Generate CSV file with filtered logs
- **File Format** - Standard CSV with headers
- **Date Filtering** - Export only logs within selected date range

### Visual Features
- **Table Layout** - Sortable columns with pagination
- **Date Pickers** - Calendar-based date selection
- **Export Button** - Download icon with CSV generation
- **Loading States** - Spinner during data fetch
- **Empty State** - Message when no logs found

---

## Cross-Cutting Frontend Concerns

### API Client (services/api.js)
Centralized HTTP client with:
- **Base URL Configuration** - `http://localhost:8080/api`
- **Token Injection** - Automatic Authorization header
- **Error Handling** - Automatic logout on 401/403
- **Response Parsing** - JSON parsing with error handling

### Routing (App.jsx)
React Router configuration with:
- **Public Routes** - /login, /register
- **Protected Routes** - Role-specific route namespaces
- **Default Redirect** - Redirect to login if not authenticated

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Responsive Design** - Mobile-friendly layouts
- **Color Coding** - Consistent color scheme for status indicators
- **Icons** - React Icons library (FontAwesome)

### State Management
- **React Hooks** - useState, useEffect for local state
- **localStorage** - Token and user data persistence
- **API Calls** - Fetch data on component mount

### Form Handling
- **Controlled Components** - React state-driven forms
- **Validation** - Client-side validation before API calls
- **Error Display** - User-friendly error messages
- **Success Feedback** - Toast notifications or success messages

---

## Component Structure

### Layout Components
- Sidebar components for each role (navigation menu)
- Dashboard components for each role (home page)
- Profile components for each role (user profile)

### Feature Components
- Health metrics logging and viewing
- Care plan management (patient, dietitian, doctor views)
- Appointment scheduling and management
- Support ticket creation and chat
- Compliance log viewing and export

### Shared Components
- Form inputs (text, date, select, textarea)
- Buttons (primary, secondary, danger)
- Status badges (color-coded)
- Loading spinners
- Error messages

---

## User Flows

### Patient Journey
1. Login → Patient Dashboard
2. Log health metrics → View trends
3. View assigned care plans → Track adherence
4. Book appointment → View/edit/cancel appointments
5. Create support ticket → Chat with support staff
6. View profile → Update personal information
7. Logout

### Dietitian Journey
1. Login → Dietitian Dashboard
2. View pending diet requests → Accept request
3. Create meal plan for accepted patient
4. Update meal plan adherence
5. Manage appointments
6. View profile → Update personal information
7. Logout

### Doctor Journey
1. Login → Doctor Dashboard
2. View patient list
3. Create treatment plan for patient
4. Update treatment plan adherence
5. Manage appointments → Update status to DONE
6. View profile → Update personal information
7. Logout

### Support Staff Journey
1. Login → Support Staff Dashboard
2. View open ticket queue → Accept ticket
3. View active tickets → Open chat
4. Chat with patient → Resolve ticket
5. View profile → Update personal information
6. Logout

### Admin Journey
1. Login → Admin Dashboard
2. View user management → Create/edit/delete users
3. View compliance logs → Filter by date/user
4. Export logs to CSV
5. View profile → Update personal information
6. Logout

---

## Environment Configuration

### API Base URL
- Development: `http://localhost:8080/api`
- Production: Configure in environment variables

### Local Storage Keys
- `token` - JWT authentication token
- `user` - Current user data (JSON string)

---

## Dependencies

### Core Libraries
- **React 18** - UI framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client (via api.js)
- **Tailwind CSS** - Styling framework
- **React Icons** - Icon library

### Development Tools
- **Vite** - Build tool and dev server
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## Build and Run

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Environment Variables
Create `.env` file:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## Future Enhancements
- Real-time notifications (WebSocket)
- File upload for care plans
- Calendar view for appointments
- Chart.js integration for advanced visualizations
- Dark mode support
- Mobile app (React Native)

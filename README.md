# Web-Based Diet Planning and Health Checkup System

A comprehensive, role-based healthcare management platform that enables patients to track their health metrics, receive personalized diet plans, schedule appointments, and communicate securely with healthcare providers.

## Overview

Health Connect is a secure web application designed to bridge the gap between patients and healthcare providers through digital health management. The platform centralizes health tracking, care plan management, appointment scheduling, and secure communication in one unified system.

## Key Features

### 1. **Role-Based Access Control**
Six distinct user roles with specific permissions:
- **PATIENT** - Track health, request diet plans, book appointments
- **DIETITIAN** - Create meal plans, manage diet requests
- **DOCTOR** - Create treatment plans, manage appointments
- **SUPPORT_STAFF** - Handle patient support tickets
- **SYSTEM_ADMIN** - Manage users and view compliance reports
- **SUPER_ADMIN** - Full system access including role management

### 2. **Health Metrics Tracking**
- **Daily Logging**: Record calories, water intake, exercise, weight, sleep hours, symptoms
- **Automated Health Score**: Rule-based calculated score (0-100) based on optimal health ranges
- **Visual Analytics**: Progress charts and trend analysis
- **Historical Data**: Date range filtering and weekly trend aggregation
- **Unique Constraint**: One entry per user per day (update existing or create new)

### 3. **Diet Plan Request System**
- **Patient-Initiated**: Submit requests with health goals, dietary restrictions, activity level
- **Queue Management**: Dietitians view and accept requests from pending queue
- **Request Limits**: Maximum 3 open requests per patient
- **Full Lifecycle**: Create, update, view, and delete requests
- **Status Tracking**: PENDING → ACCEPTED → COMPLETED or CANCELLED

### 4. **Care Plan Management**
- **Plan Types**:
  - **MEAL_PLAN** - Created by dietitians for nutrition guidance
  - **TREATMENT_PLAN** - Created by doctors for medical protocols
  - **REHABILITATION_PROTOCOL** - Created by doctors for rehabilitation
- **Adherence Tracking**: Real-time percentage indicators
- **Collaborative Care**: Coordination between clinicians
- **Immutable Records**: No deletion for medical record retention

### 5. **Appointment Scheduling**
- **Calendar Interface**: Book appointments with doctors/dietitians
- **Conflict Detection**: Real-time validation prevents double-booking
- **Time Management**: Update appointment times with automatic conflict checking
- **Status Workflow**: SCHEDULED → COMPLETED, CANCELLED, or NO_SHOW
- **Role-Specific Views**: Patients book, clinicians manage

### 6. **Support Ticket System**
- **Issue Reporting**: Patients create tickets with subject and description
- **Queue-Based Assignment**: Support staff accept tickets from open queue
- **Integrated Chat**: Messaging for ticket resolution
- **Status Tracking**: OPEN → ASSIGNED → RESOLVED
- **Access Control**: Only assigned staff and ticket creator can chat

### 7. **Secure Messaging (Ticket-Based)**
- **Ticket Communication**: Messages linked to support tickets
- **Access Control**: Only ticket creator and assigned staff can chat
- **Conversation History**: View all messages in ticket thread
- **XSS Prevention**: HTML sanitization for security
- **Immutable Audit**: Messages cannot be deleted (compliance requirement)

### 8. **Compliance & Auditing**
- **Access Logging**: All user actions tracked with timestamps
- **Date-Range Reports**: Filter logs by time period
- **CSV Export**: Regulatory compliance reporting
- **User Activity**: Track individual user actions
- **IP Logging**: Security audit trail

## Security Features

- **JWT Authentication**: Stateless token-based authentication with 30-minute timeout
- **BCrypt Password Hashing**: Industry-standard password encryption
- **Role-Based Authorization**: Endpoint-level access control
- **XSS Prevention**: OWASP HTML sanitization for all user inputs
- **SQL Injection Protection**: JPA parameterized queries
- **Single Session Enforcement**: Automatic logout on new login

## System Architecture

### Technology Stack

**Backend:**
- Java 17
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- MySQL 8.0+
- OWASP HTML Sanitizer

**Frontend:**
- React 18
- React Router v6
- Axios for API calls
- Recharts for data visualization
- Lucide React for icons

**Build Tools:**
- Maven 3.6+ (Backend)
- npm/Vite (Frontend)

### Project Structure

```
HEALTH_CONNECT_BETA/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/example/app/
│   │   ├── config/            # Security & app configuration
│   │   ├── controller/        # REST API endpoints
│   │   ├── dto/               # Data transfer objects
│   │   ├── entity/            # JPA entities
│   │   ├── repository/        # Data access layer
│   │   ├── security/          # JWT & authentication
│   │   ├── service/           # Business logic
│   │   └── util/              # Utilities
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service layer
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   └── package.json
├── .amazonq/rules/            # Development guidelines
└── README.md                  # This file
```

## Getting Started

### Prerequisites

- JDK 17 or higher
- Maven 3.6+
- Node.js 16+ and npm
- MySQL 8.0+

### Backend Setup

1. **Create MySQL Database:**
```sql
CREATE DATABASE healthconnect;
```

2. **Configure Database Connection:**
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/healthconnect
spring.datasource.username=your_username
spring.datasource.password=your_password
jwt.secret=your_secret_key_here
jwt.expiration=1800000
```

3. **Build and Run:**
```bash
cd backend
mvn clean package
java -jar target/health-connect-1.0.0.jar
```

Backend runs on `http://localhost:8080`

### Frontend Setup

1. **Install Dependencies:**
```bash
cd frontend
npm install
```

2. **Configure API Endpoint:**
Edit `frontend/src/services/api.js` if needed (default: `http://localhost:8080`)

3. **Run Development Server:**
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### Sample Credentials

The system seeds sample users on first startup:

| Role | Email | Password | Specialization |
|------|-------|----------|----------------|
| Patient | patient@example.com | password123 | - |
| Doctor | physician@example.com | password123 | Cardiology |
| Dietitian | dietitian@example.com | password123 | Clinical Nutrition |
| Support Staff | support@example.com | password123 | - |
| System Admin | admin@example.com | password123 | - |
| Super Admin | superadmin@example.com | password123 | - |

## User Workflows

### Patient Journey

1. **Registration & Login**
   - Register with email, password, name, role, and specialization (optional)
   - Login to receive JWT token
   - Token expires after 30 minutes
   - Use refresh endpoint to get new token

2. **Health Tracking**
   - Navigate to Dashboard
   - Log daily metrics: calories, exercise, weight, sleep, water, symptoms
   - View automated health score (0-100)
   - Analyze trends with visual charts
   - One entry per day (updates existing if already logged)

3. **Request Diet Plan**
   - Go to Diet Requests section
   - Fill form: age, weight, height, dietary restrictions, health goals, activity level
   - Submit request (max 3 open requests)
   - Track status: PENDING → ACCEPTED → COMPLETED or CANCELLED
   - Update or delete pending requests

4. **View Care Plans**
   - Access Care Plans section
   - View assigned meal plans (from dietitian)
   - View treatment plans (from doctor)
   - Track adherence percentage
   - Follow plan instructions

5. **Book Appointments**
   - Browse available doctors/dietitians
   - Select date and time
   - System checks for conflicts
   - Receive confirmation
   - View upcoming and past appointments
   - Cancel appointments if needed

6. **Get Support**
   - Create support ticket with issue description (available to PATIENT, DOCTOR, DIETITIAN)
   - Track ticket status
   - Chat with assigned support staff
   - Receive resolution

7. **Secure Messaging (Ticket-Based)**
   - Send messages within support tickets
   - View ticket conversation history
   - Access control: only ticket creator and assigned staff

### Dietitian Workflow

1. **Login & Dashboard**
   - Login with dietitian credentials
   - View dashboard overview

2. **Manage Diet Requests**
   - View pending diet request queue
   - Review patient details (age, weight, height, goals, restrictions)
   - Accept requests from queue
   - View assigned requests

3. **Create Meal Plans**
   - Navigate to Care Plans
   - Create new MEAL_PLAN for patient
   - Set title, description, instructions
   - Update adherence percentage as patient progresses

4. **Monitor Patient Health**
   - View patient health metrics
   - Analyze trends and progress
   - Adjust meal plans accordingly

5. **Manage Appointments**
   - View scheduled appointments
   - Update appointment status to COMPLETED or CANCELLED
   - Reschedule if needed (conflict detection active)

6. **Communication**
   - Chat within support tickets if involved

### Doctor Workflow

1. **Login & Dashboard**
   - Login with doctor credentials
   - View dashboard overview

2. **Create Treatment Plans**
   - Navigate to Care Plans
   - Create new TREATMENT_PLAN for patient
   - Set medical protocols and instructions
   - Update adherence tracking

3. **Review Patient Health**
   - Access patient health metrics
   - View historical data and trends
   - Make informed treatment decisions

4. **Manage Appointments**
   - View scheduled appointments
   - Update status to COMPLETED or CANCELLED after consultation

5. **Collaborate with Dietitians**
   - View meal plans created by dietitians
   - Coordinate comprehensive care

### Support Staff Workflow

1. **Login & Dashboard**
   - Login with support staff credentials
   - View dashboard

2. **Handle Support Tickets**
   - View open ticket queue
   - Accept tickets from queue (status changes to ASSIGNED)
   - Chat with patients to resolve issues
   - Update status: OPEN → ASSIGNED → RESOLVED

3. **Communication**
   - Access ticket-specific chat
   - Send/receive messages within assigned tickets
   - Provide timely support

### System Admin Workflow

1. **Login & Dashboard**
   - Login with admin credentials
   - Access admin panel

2. **User Management**
   - View all users (paginated)
   - Search by ID, name, email, role
   - Update user details (name, email, specialization)
   - Delete users if needed
   - **Cannot update roles** (SUPER_ADMIN only)

3. **Compliance Reporting**
   - View access logs with date filters
   - View user-specific activity logs
   - Export logs to CSV for regulatory compliance
   - Monitor system usage

### Super Admin Workflow

1. **Full System Access**
   - All System Admin capabilities
   - **Role Management**: Update user roles
   - Complete user CRUD operations
   - System configuration

## Data Flow Examples

### Health Metrics Logging Flow

```
Patient Dashboard → Log Metrics Form
  ↓
Enter: Calories, Exercise, Weight, Sleep, Water, Symptoms
  ↓
Frontend Validation (all fields required)
  ↓
API: POST /api/health-metrics
  ↓
Backend: Check if entry exists for (userId, date)
  ↓
If exists: Update existing entry
If not: Create new entry
  ↓
Calculate Health Score (O(1) algorithm)
  ↓
Save to Database
  ↓
Return HealthMetricDTO
  ↓
Update UI with new score and trends
```

### Diet Plan Request Flow

```
Patient → Diet Requests → Create New Request
  ↓
Fill Form: Age, Weight, Height, Goals, Restrictions, Activity
  ↓
Frontend Validation (age: 1-120, weight: 20-300kg, height: 50-250cm)
  ↓
API: POST /api/diet-requests
  ↓
Backend: Check open request count (max 3)
  ↓
Create DietPlanRequest (status: PENDING)
  ↓
Save to Database
  ↓
---
Dietitian → Diet Requests → View Queue
  ↓
See pending requests
  ↓
Click "Accept Request"
  ↓
API: POST /api/diet-requests/{id}/accept
  ↓
Backend: Update status to ACCEPTED, assign dietitianId
  ↓
---
Dietitian → Care Plans → Create Meal Plan
  ↓
Create MEAL_PLAN for patient
  ↓
API: POST /api/care-plans
  ↓
Backend: Save CarePlan (type: MEAL_PLAN)
  ↓
---
Dietitian → Diet Requests → Update to COMPLETED
  ↓
API: PUT /api/diet-requests/{id} (status: COMPLETED)
  ↓
Patient can now view meal plan in Care Plans section
```

### Appointment Booking Flow

```
Patient → Appointments → View Doctors
  ↓
API: GET /api/appointments/doctors
  ↓
Select Doctor/Dietitian
  ↓
Choose Date and Time
  ↓
API: GET /api/appointments/check-conflict?clinicianId=X&scheduledTime=Y
  ↓
Backend: Check for existing appointments at same time
  ↓
If conflict: Show error, choose different time
If no conflict: Proceed
  ↓
API: POST /api/appointments
  ↓
Backend: Create Appointment (status: SCHEDULED)
  ↓
Save to Database
  ↓
Confirmation shown to patient
  ↓
---
Doctor → Appointments → View Pending
  ↓
See scheduled appointments
  ↓
After consultation: Update Status
  ↓
API: PUT /api/appointments/{id}/status (status: COMPLETED)
  ↓
Backend: Update appointment status
  ↓
Patient sees appointment in Past Appointments (COMPLETED)
```

### Support Ticket Flow

```
Patient → Support → Create Ticket
  ↓
Enter Subject and Description
  ↓
API: POST /api/support-tickets
  ↓
Backend: Create SupportTicket (status: OPEN)
  ↓
---
Support Staff → Support → View Queue
  ↓
See open tickets
  ↓
Click "Accept Ticket"
  ↓
API: POST /api/support-tickets/{id}/accept
  ↓
Backend: Update status to ASSIGNED, assign staffId
  ↓
---
Patient/Staff → Ticket Chat
  ↓
API: GET /api/support-tickets/{id}/chat-access
  ↓
Backend: Verify access (creator or assigned staff only)
  ↓
If authorized: Load chat interface
  ↓
Send Message
  ↓
API: POST /api/messages/ticket/{ticketId}
  ↓
Backend: Create Message linked to ticket
  ↓
Chat updates
  ↓
---
Support Staff → Resolve Ticket
  ↓
API: PUT /api/support-tickets/{id}/resolve
  ↓
Backend: Update status to RESOLVED
  ↓
Ticket closed, chat preserved for audit
```

## Health Score Algorithm

The system calculates a health score (0-100) using an O(1) time complexity algorithm:

**Scoring Factors:**
- **Calories**: 1800-2500 optimal (100 pts), 1500-3000 good (75 pts), 1200-3500 fair (50 pts), else poor (25 pts)
- **Exercise**: 30-90 min optimal (100 pts), 15-120 min good (75 pts), 5-150 min fair (50 pts), else poor (25 pts)
- **Sleep**: 7-9 hrs optimal (100 pts), 6-10 hrs good (75 pts), 5-11 hrs fair (50 pts), else poor (25 pts)
- **Water**: 2000-3000ml optimal (100 pts), 1500-3500ml good (75 pts), 1000-4000ml fair (50 pts), else poor (25 pts)
- **Symptoms**: Present = -20 pts penalty

**Calculation:**
```
Final Score = Average of all factor scores (clamped to 0-100)
Default Score = 50 (if no data)
```

## Database Schema

### Core Entities

- **users** - User accounts with roles
- **health_metrics** - Daily health data (unique constraint on userId + date)
- **care_plans** - Meal plans and treatment plans
- **appointments** - Scheduled consultations
- **diet_plan_requests** - Diet plan request queue
- **support_tickets** - Support ticket system
- **messages** - Secure messaging
- **access_logs** - Audit trail
- **user_sessions** - JWT session tracking

### Key Relationships

- User → HealthMetric (1:many)
- User → CarePlan (1:many as patient, 1:many as creator)
- User → Appointment (many:1 as patient, many:1 as clinician)
- User → DietPlanRequest (1:many as patient, many:1 as dietitian)
- User → SupportTicket (1:many as patient, many:1 as staff)
- SupportTicket → Message (1:many for chat)

## Security Best Practices

1. **Authentication**: JWT tokens with 30-minute expiration
2. **Authorization**: Role-based endpoint protection
3. **Password Security**: BCrypt hashing (never plaintext)
4. **Input Sanitization**: OWASP HTML sanitizer for XSS prevention
5. **SQL Injection**: JPA parameterized queries
6. **Session Management**: Single session enforcement
7. **Audit Trail**: Immutable access logs for compliance
8. **Data Integrity**: Unique constraints and validation

## Testing

### Backend Tests

```bash
cd backend
mvn test
```

Test coverage includes:
- Unit tests with JUnit 5 and Mockito
- Service layer tests
- Repository tests
- Security tests

### Frontend Tests

```bash
cd frontend
npm test
```

## Performance Optimizations

- **O(1) Health Score Calculation**: Constant time complexity
- **Database Indexing**: Foreign keys and email fields
- **Pagination**: Large dataset support
- **Stateless JWT**: No server-side session storage
- **Connection Pooling**: HikariCP for database connections

## Known Limitations

- No offline mode (internet required)
- Manual data entry only (no wearable device integration)
- English-only interface
- No real-time emergency support features
- No AI/predictive analytics (rule-based only)

## Future Enhancements

- [ ] Wearable device integration (Fitbit, Apple Watch)
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Real-time notifications and chat (WebSocket)
- [ ] AI-powered health predictions
- [ ] Telemedicine video consultations
- [ ] Prescription management
- [ ] Lab report integration
- [ ] Insurance claim processing
- [ ] Redis caching for performance
- [ ] Docker containerization
- [ ] Kubernetes deployment
- [ ] HTTPS/TLS configuration
- [ ] Rate limiting
- [ ] Swagger/OpenAPI documentation

## API Documentation

### Authentication Endpoints

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh (Authenticated users)
GET  /api/auth/validate (Check token validity)
```

### User Management (Admin Only)

```
GET    /api/users?page=0&size=10 (System Admin/Super Admin)
GET    /api/users/me (Authenticated users)
PUT    /api/users/me (Authenticated users)
GET    /api/users/{id} (System Admin/Super Admin)
PUT    /api/users/{id} (System Admin/Super Admin)
DELETE /api/users/{id} (System Admin/Super Admin)
GET    /api/users/active-count (System Admin/Super Admin)
PUT    /api/users/{id}/role (Super Admin only)
```

### Health Metrics

```
POST   /api/health-metrics (Patient only)
GET    /api/health-metrics/user/{userId} (Patient/Doctor/Dietitian)
GET    /api/health-metrics/user/{userId}/range?startDate=...&endDate=... (Patient/Doctor/Dietitian)
GET    /api/health-metrics/user/{userId}/trends/weekly?startDate=...&endDate=... (Patient/Doctor/Dietitian)
DELETE /api/health-metrics/{id} (Patient only)
```

### Care Plans

```
POST   /api/care-plans (Dietitian/Doctor)
PUT    /api/care-plans/{id} (Dietitian/Doctor)
PUT    /api/care-plans/{id}/adherence (Dietitian/Doctor/Patient)
GET    /api/care-plans/patient/{patientId} (Patient/Doctor/Dietitian)
GET    /api/care-plans/creator/{creatorId} (Doctor/Dietitian)
```

### Appointments

```
GET    /api/appointments/doctors (Patient only)
POST   /api/appointments (Patient only)
DELETE /api/appointments/{id} (Patient only)
PUT    /api/appointments/{id}/status (Doctor/Dietitian)
PUT    /api/appointments/{id} (Patient only - update time)
GET    /api/appointments/my-appointments (Patient/Doctor/Dietitian)
GET    /api/appointments/check-conflict?clinicianId=...&scheduledTime=... (Patient only)
```

### Diet Plan Requests

```
POST   /api/diet-requests (Patient only)
PUT    /api/diet-requests/{id} (Patient only)
DELETE /api/diet-requests/{id} (Patient only)
GET    /api/diet-requests/queue (Dietitian only)
POST   /api/diet-requests/{id}/accept (Dietitian only)
GET    /api/diet-requests/my-requests (Patient/Dietitian)
GET    /api/diet-requests/accepted-patients (Dietitian only)
```

### Support Tickets

```
POST   /api/support-tickets (Patient/Doctor/Dietitian)
GET    /api/support-tickets/queue (Support Staff only)
POST   /api/support-tickets/{id}/accept (Support Staff only)
PUT    /api/support-tickets/{id}/resolve (Support Staff only)
GET    /api/support-tickets/my-tickets (Patient/Doctor/Dietitian/Support Staff)
GET    /api/support-tickets/{id}/chat-access (Patient/Doctor/Dietitian/Support Staff)
```

### Messages

```
POST   /api/messages/ticket/{ticketId} (Patient/Doctor/Dietitian/Support Staff)
GET    /api/messages/ticket/{ticketId} (Patient/Doctor/Dietitian/Support Staff)
```

### Compliance (Admin Only)

```
GET    /api/compliance/logs?startDate=...&endDate=... (System Admin/Super Admin)
GET    /api/compliance/logs/user/{userId}?startDate=...&endDate=... (System Admin/Super Admin)
GET    /api/compliance/export/csv?startDate=...&endDate=... (System Admin/Super Admin)
```

## Contributing

This is a proprietary project. For development guidelines, see:
- `.amazonq/rules/BestPractices.md`
- `.amazonq/rules/memory-bank/guidelines.md`

## License

Proprietary - Health Connect Platform

## Support

For technical support or questions, create a support ticket within the application or contact the development team.

---

**Built with care for better healthcare management**

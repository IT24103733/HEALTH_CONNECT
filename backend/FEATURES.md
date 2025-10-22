# Health Connect Backend - Feature Documentation

This document provides a comprehensive overview of the backend implementation for each major feature in the Health Connect platform.

---

## 1. RBAC and Security

### Overview
Role-Based Access Control (RBAC) with JWT authentication, password hashing, input sanitization, and method-level security.

### Roles
- **PATIENT** - Access personal health records, appointments, diet requests
- **DOCTOR** - Create treatment plans, manage appointments, view patient data
- **DIETITIAN** - Create meal plans, manage diet requests, view patient nutrition data
- **SUPPORT_STAFF** - Manage support tickets, no medical data access
- **SYSTEM_ADMIN** - User management, compliance reports
- **SUPER_ADMIN** - Full system access

### Backend Code Files

#### Configuration
- `config/SecurityConfig.java` - Spring Security configuration with JWT filter chain, CORS, role-based endpoint authorization
- `config/AccessLogInterceptor.java` - HTTP request/response logging for compliance auditing

#### Security Layer
- `security/JwtUtil.java` - JWT token generation, validation, claims extraction (30-minute expiration)
- `security/JwtAuthenticationFilter.java` - Request filter for token validation and SecurityContext population
- `security/CustomUserDetailsService.java` - Spring Security UserDetailsService implementation
- `security/SecurityUtil.java` - Security context utilities for current user retrieval

#### Utilities
- `util/HtmlSanitizer.java` - OWASP-based XSS prevention for all user inputs
- `util/SqlEscapeUtil.java` - SQL injection prevention (emergency use only, JPA preferred)

#### Controllers
- `controller/AuthController.java` - Registration, login, JWT token generation
  - `POST /api/auth/register` - User registration with password hashing
  - `POST /api/auth/login` - Authentication and JWT token issuance

#### Services
- `service/UserService.java` - User management with BCrypt password hashing
- `service/SessionService.java` - JWT session tracking, single-session enforcement, active user counting

#### Entities
- `entity/User.java` - User entity with role enum and password field
- `entity/UserSession.java` - JWT session tracking with lastActivity timestamp

#### Repositories
- `repository/UserRepository.java` - User queries with email lookup
- `repository/UserSessionRepository.java` - Session queries with active user counting

### Key Security Features
- **JWT Authentication** - Stateless token-based auth with 30-minute expiration
- **Password Hashing** - BCrypt with strength 10
- **Input Sanitization** - OWASP HTML Sanitizer for all user inputs
- **Method Security** - @PreAuthorize annotations on controller methods
- **Session Management** - Single-session enforcement, automatic logout on token expiry
- **SQL Injection Prevention** - JPA parameterized queries throughout

### Security Annotations Used
```java
@PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'DIETITIAN')")
@PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'SUPER_ADMIN')")
@PreAuthorize("hasRole('DIETITIAN')")
```

---

## 2. Health Metrics

### Overview
Daily health data logging with automated health score calculation (0-100 range), trend analysis, and date range filtering.

### Backend Code Files

#### Controllers
- `controller/HealthMetricController.java` - Health metrics CRUD and trend analysis
  - `POST /api/health-metrics` - Log daily health metric (authenticated users)
  - `GET /api/health-metrics/user/{userId}` - Get user's metrics ordered by date
  - `GET /api/health-metrics/user/{userId}/range` - Get metrics in date range
  - `GET /api/health-metrics/user/{userId}/trends` - Get weekly aggregated trends

#### Services
- `service/HealthMetricService.java` - Business logic for metric logging, trend calculation, health score prediction
  - `logMetric()` - Sanitize inputs, calculate health score, save metric
  - `getUserMetrics()` - Retrieve user metrics with DTO conversion
  - `getMetricsInRange()` - Date-filtered metric retrieval
  - `getWeeklyTrends()` - Aggregate metrics by week with averages

#### Utilities
- `util/HealthScoreCalculator.java` - O(1) health score algorithm
  - Calorie scoring (1800-2500 optimal)
  - Exercise scoring (30-90 minutes optimal)
  - Sleep scoring (7-9 hours optimal)
  - Water intake scoring (2000-3000ml optimal)
  - Symptom penalty calculation

#### Entities
- `entity/HealthMetric.java` - JPA entity for daily health data
  - Fields: userId, date, caloriesIntake, exerciseMinutes, sleepHours, waterIntake, symptoms, energyLevel, healthScore

#### Repositories
- `repository/HealthMetricRepository.java` - Data access with custom queries
  - `findByUserIdOrderByDateDesc()` - Get user metrics sorted by date
  - `findByUserIdAndDateBetween()` - Date range filtering

#### DTOs
- `dto/HealthMetricDTO.java` - Data transfer object with fromEntity() factory method
- `dto/HealthTrendDTO.java` - Weekly aggregated trend data

### Health Score Algorithm
- **Time Complexity**: O(1)
- **Score Range**: 0-100 (higher is better)
- **Factors**: Calories, exercise, sleep, water, symptoms
- **Default Score**: 50 (when no data available)

---

## 3. Care Plan Coordination

### Overview
Collaborative care management with dietitian-created meal plans and physician treatment protocols, adherence tracking, and role-based access.

### Backend Code Files

#### Controllers
- `controller/CarePlanController.java` - Care plan CRUD and adherence management
  - `POST /api/care-plans` - Create care plan (DOCTOR for treatment, DIETITIAN for meal plans)
  - `PUT /api/care-plans/{id}` - Update care plan content (creator only)
  - `PUT /api/care-plans/{id}/adherence` - Update adherence percentage (creator only)
  - `GET /api/care-plans/patient/{patientId}` - Get patient's care plans (patient or creator)
  - `GET /api/care-plans/creator/{creatorId}` - Get creator's care plans (creator only)

#### Services
- `service/CarePlanService.java` - Business logic for care plan management
  - `createCarePlan()` - Validate plan type vs creator role, sanitize content
  - `updateCarePlanContent()` - Update plan details with ownership validation
  - `updateAdherence()` - Update adherence percentage (0-100)
  - `getPatientCarePlans()` - Retrieve patient's active care plans
  - `getCreatorCarePlans()` - Retrieve creator's managed care plans

#### Entities
- `entity/CarePlan.java` - JPA entity for care plans
  - Fields: patientId, creatorId, planType (MEAL_PLAN/TREATMENT_PLAN), title, description, content, adherencePercentage, createdAt
  - Nested enum: PlanType (MEAL_PLAN, TREATMENT_PLAN)

#### Repositories
- `repository/CarePlanRepository.java` - Data access with custom queries
  - `findByPatientIdOrderByCreatedAtDesc()` - Get patient's care plans
  - `findByCreatorIdOrderByCreatedAtDesc()` - Get creator's care plans

#### DTOs
- `dto/CarePlanDTO.java` - Data transfer object with fromEntity() factory method
- `dto/CreateCarePlanRequest.java` - Request DTO for care plan creation
- `dto/UpdateCarePlanContentRequest.java` - Request DTO for content updates
- `dto/UpdateAdherenceRequest.java` - Request DTO for adherence updates

### Care Plan Types
- **MEAL_PLAN** - Created by DIETITIAN only
- **TREATMENT_PLAN** - Created by DOCTOR only

### Adherence Tracking
- Percentage-based (0-100)
- Updated by care plan creator
- Displayed to patient for progress monitoring

---

## 4. Appointment Management

### Overview
Calendar-based scheduling with real-time conflict detection, role-specific views, and status tracking.

### Backend Code Files

#### Controllers
- `controller/AppointmentController.java` - Appointment scheduling and management
  - `GET /api/appointments/doctors` - Get all doctors/dietitians (PATIENT only)
  - `POST /api/appointments` - Book appointment with conflict detection (PATIENT only)
  - `PUT /api/appointments/{id}` - Update appointment time (PATIENT only, SCHEDULED appointments)
  - `DELETE /api/appointments/{id}` - Cancel appointment (PATIENT only)
  - `PUT /api/appointments/{id}/status` - Update status to DONE/CANCELLED (DOCTOR/DIETITIAN only)
  - `GET /api/appointments/my-appointments` - Get own appointments (PATIENT/DOCTOR/DIETITIAN)
  - `GET /api/appointments/check-conflict` - Check time slot availability

#### Services
- `service/AppointmentService.java` - Business logic for appointment management
  - `scheduleAppointment()` - Create appointment with conflict detection, sanitize notes
  - `updateAppointmentTime()` - Update scheduled time with conflict validation
  - `cancelAppointment()` - Cancel appointment with ownership validation
  - `updateAppointmentStatus()` - Update status with clinician validation
  - `hasConflict()` - Check for time slot conflicts (±30 minutes)
  - `getPatientAppointments()` - Retrieve patient's appointments
  - `getClinicianAppointments()` - Retrieve clinician's appointments

#### Entities
- `entity/Appointment.java` - JPA entity for appointments
  - Fields: patientId, clinicianId, scheduledTime, status, notes
  - Nested enum: AppointmentStatus (SCHEDULED, DONE, CANCELLED)

#### Repositories
- `repository/AppointmentRepository.java` - Data access with custom queries
  - `findByPatientIdOrderByScheduledTimeDesc()` - Get patient's appointments
  - `findByClinicianIdOrderByScheduledTimeDesc()` - Get clinician's appointments
  - `findByClinicianIdAndScheduledTimeBetween()` - Conflict detection query

#### DTOs
- `dto/AppointmentDTO.java` - Data transfer object with fromEntity() factory method

### Conflict Detection
- **Time Window**: ±30 minutes from requested time
- **Status Check**: Only SCHEDULED appointments cause conflicts
- **Real-time Validation**: Checked on booking and time updates

### Status Workflow
1. **SCHEDULED** - Initial state after booking
2. **DONE** - Completed by clinician
3. **CANCELLED** - Cancelled by patient or clinician

---

## 5. Communication Hub

### Overview
Ticket-based secure messaging system for patient-support staff communication with access control and chat history.

### Backend Code Files

#### Controllers
- `controller/SupportTicketController.java` - Support ticket lifecycle management
  - `POST /api/support-tickets` - Create support ticket (PATIENT/DOCTOR/DIETITIAN)
  - `GET /api/support-tickets/queue` - View open tickets (SUPPORT_STAFF only)
  - `POST /api/support-tickets/{id}/accept` - Accept ticket from queue (SUPPORT_STAFF only)
  - `PUT /api/support-tickets/{id}/resolve` - Resolve ticket (assigned staff only)
  - `GET /api/support-tickets/my-tickets` - Get own tickets (PATIENT/DOCTOR/DIETITIAN/SUPPORT_STAFF)
  - `GET /api/support-tickets/{id}/chat-access` - Check chat access permissions

- `controller/MessageController.java` - Ticket-based messaging
  - `POST /api/messages/ticket/{ticketId}` - Send message in ticket chat (ticket creator or assigned staff)
  - `GET /api/messages/ticket/{ticketId}` - Get ticket chat history (ticket creator or assigned staff)

#### Services
- `service/SupportTicketService.java` - Business logic for ticket management
  - `createTicket()` - Create ticket with sanitized subject/description
  - `acceptTicket()` - Assign ticket to support staff (status: OPEN → ASSIGNED)
  - `resolveTicket()` - Mark ticket as resolved (assigned staff only)
  - `getOpenTickets()` - Retrieve unassigned tickets for queue
  - `getUserTickets()` - Retrieve user's created or assigned tickets
  - `canAccessTicketChat()` - Validate chat access permissions

- `service/MessageService.java` - Business logic for ticket messaging
  - `sendTicketMessage()` - Send message with ticketId, sanitize content
  - `getTicketMessages()` - Retrieve chat history ordered by timestamp

#### Entities
- `entity/SupportTicket.java` - JPA entity for support tickets
  - Fields: patientId, assignedStaffId, subject, description, status, createdAt
  - Nested enum: TicketStatus (OPEN, ASSIGNED, RESOLVED, CLOSED)

- `entity/Message.java` - JPA entity for ticket messages
  - Fields: senderId, ticketId (NOT NULL), content, sentAt, isRead

#### Repositories
- `repository/SupportTicketRepository.java` - Data access with custom queries
  - `findByStatus()` - Get tickets by status (for queue)
  - `findByPatientIdOrderByCreatedAtDesc()` - Get user's created tickets
  - `findByAssignedStaffIdOrderByCreatedAtDesc()` - Get staff's assigned tickets

- `repository/MessageRepository.java` - Data access with custom queries
  - `findByTicketIdOrderBySentAtAsc()` - Get ticket chat history

#### DTOs
- `dto/SupportTicketDTO.java` - Data transfer object with fromEntity() factory method
- `dto/MessageDTO.java` - Data transfer object with fromEntity() factory method

### Ticket Status Workflow
1. **OPEN** - Created, waiting for staff assignment
2. **ASSIGNED** - Accepted by support staff, chat enabled
3. **RESOLVED** - Issue resolved by staff
4. **CLOSED** - Ticket archived

### Chat Access Control
- **Ticket Creator** - Can send/view messages on their tickets
- **Assigned Staff** - Can send/view messages on assigned tickets
- **Other Users** - No access (403 Forbidden)

---

## 6. Compliance Documentation

### Overview
Comprehensive audit logging with date-range filtering, user-specific tracking, and CSV export for regulatory compliance.

### Backend Code Files

#### Controllers
- `controller/ComplianceController.java` - Audit log management and export
  - `GET /api/compliance/logs` - Get all access logs with optional date filtering (SYSTEM_ADMIN/SUPER_ADMIN)
  - `GET /api/compliance/logs/user/{userId}` - Get user-specific access logs (SYSTEM_ADMIN/SUPER_ADMIN)
  - `GET /api/compliance/export/csv` - Export logs to CSV with date filtering (SYSTEM_ADMIN/SUPER_ADMIN)

#### Services
- `service/AccessLogService.java` - Business logic for audit logging
  - `logAccess()` - Create access log entry with timestamp, IP, user agent
  - `getAccessLogs()` - Retrieve all logs with optional date filtering
  - `getUserAccessLogs()` - Retrieve user-specific logs
  - `exportToCsv()` - Generate CSV report with date filtering

#### Configuration
- `config/AccessLogInterceptor.java` - HTTP interceptor for automatic logging
  - Logs all HTTP requests (method, URI, user ID, IP address, user agent)
  - Integrated with Spring MVC interceptor chain

#### Entities
- `entity/AccessLog.java` - JPA entity for audit trail
  - Fields: userId, action, timestamp, ipAddress, userAgent

#### Repositories
- `repository/AccessLogRepository.java` - Data access with custom queries
  - `findByTimestampBetweenOrderByTimestampDesc()` - Date range filtering
  - `findByUserIdAndTimestampBetweenOrderByTimestampDesc()` - User-specific date filtering
  - `findAllByOrderByTimestampDesc()` - All logs sorted by timestamp

#### DTOs
- `dto/AccessLogDTO.java` - Data transfer object with fromEntity() factory method

### Logged Information
- **User ID** - Who performed the action
- **Action** - HTTP method and URI (e.g., "GET /api/health-metrics/user/1")
- **Timestamp** - When the action occurred
- **IP Address** - Client IP address
- **User Agent** - Browser/client information

### CSV Export Format
```csv
User ID,Action,Timestamp,IP Address,User Agent
1,GET /api/health-metrics/user/1,2024-01-15T10:30:00,192.168.1.100,Mozilla/5.0...
```

### Compliance Features
- **Automatic Logging** - All HTTP requests logged via interceptor
- **Date Filtering** - Query logs by date range for audits
- **User Tracking** - Trace all actions by specific user
- **CSV Export** - Generate reports for regulatory review
- **Admin-Only Access** - Restricted to SYSTEM_ADMIN and SUPER_ADMIN roles

---

## Cross-Cutting Concerns

### Exception Handling
All controllers use custom exceptions handled by `GlobalExceptionHandler`:
- `ResourceNotFoundException` - 404 Not Found
- `UnauthorizedException` - 403 Forbidden
- `BadRequestException` - 400 Bad Request
- `ConflictException` - 409 Conflict

### Input Validation
- **JSR-380 Annotations** - @Valid, @NotNull, @Size on DTOs
- **HTML Sanitization** - All user inputs sanitized via HtmlSanitizer
- **SQL Injection Prevention** - JPA parameterized queries throughout

### Transaction Management
- **@Transactional** - All state-modifying service methods
- **Rollback on Exception** - Automatic rollback on unchecked exceptions

### Dependency Injection
- **Constructor Injection** - All dependencies injected via constructor
- **Private Final Fields** - Immutable dependency references
- **No Field Injection** - Consistent with best practices

---

## Testing

### Test Files
- `service/UserServiceTest.java` - User management tests
- `service/HealthMetricServiceTest.java` - Health metrics tests
- `service/CarePlanServiceTest.java` - Care plan tests
- `service/AppointmentServiceTest.java` - Appointment tests
- `service/SupportTicketServiceTest.java` - Support ticket tests
- `service/MessageServiceTest.java` - Messaging tests

### Testing Patterns
- **Mockito** - Mock dependencies (@Mock, @InjectMocks)
- **JUnit 5** - Test framework (@Test, @BeforeEach)
- **Arrange-Act-Assert** - Consistent test structure
- **Verification** - Confirm interactions with verify()

---

## Configuration

### application.properties
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/health_connect
spring.datasource.username=your_username
spring.datasource.password=your_password

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=your_secret_key_here
jwt.expiration=1800000

# Server
server.port=8080
```

### Dependencies (pom.xml)
- Spring Boot 3.2.0
- Spring Data JPA
- Spring Security
- MySQL Connector
- JWT (JJWT 0.12.3)
- OWASP HTML Sanitizer
- Lombok
- JUnit 5 & Mockito

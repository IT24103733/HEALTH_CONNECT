# Health Connect - Project Structure

## Directory Organization

```
HEALTH_CONNECT_BETA/
├── .amazonq/rules/              # Amazon Q configuration and rules
│   ├── memory-bank/             # Project documentation
│   └── BestPractices.md         # Coding standards
├── backend/                     # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/app/
│   │   │   │   ├── config/      # Security & app configuration
│   │   │   │   ├── controller/  # REST API endpoints
│   │   │   │   ├── dto/         # Data transfer objects
│   │   │   │   ├── entity/      # JPA entities
│   │   │   │   ├── repository/  # Data access layer
│   │   │   │   ├── security/    # JWT & authentication
│   │   │   │   ├── service/     # Business logic
│   │   │   │   ├── util/        # Utilities
│   │   │   │   └── Application.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                # Unit and integration tests
│   ├── pom.xml                  # Maven dependencies
│   └── README.md                # Backend documentation
├── proposal.md                  # Project proposal
└── SPRINT_PLAN.md              # Development timeline
```

## Core Components

### 1. Configuration Layer (`config/`)
- **SecurityConfig**: Spring Security configuration with JWT, CORS, role-based authorization
- **WebConfig**: Web MVC configuration and interceptor registration
- **AccessLogInterceptor**: HTTP request/response logging for compliance auditing

### 2. Controller Layer (`controller/`)
REST API endpoints organized by domain:
- **AuthController**: Registration, login, JWT token generation
- **UserController**: User CRUD operations (admin only)
- **HealthMetricController**: Health data logging and retrieval
- **CarePlanController**: Care plan management
- **AppointmentController**: Appointment scheduling and conflict detection
- **DietPlanRequestController**: Diet plan request lifecycle
- **SupportTicketController**: Support ticket and chat management
- **MessageController**: Secure messaging between users
- **ComplianceController**: Audit logs and CSV export

### 3. Service Layer (`service/`)
Business logic with transactional operations:
- **UserService**: User management, password hashing, role assignment
- **HealthMetricService**: Metric logging, trend calculation, health score prediction
- **CarePlanService**: Care plan CRUD, adherence tracking
- **AppointmentService**: Scheduling, conflict detection, status updates
- **DietPlanRequestService**: Request queue management, assignment logic
- **SupportTicketService**: Ticket lifecycle, chat access control
- **MessageService**: Message sending, inbox/sent retrieval
- **AccessLogService**: Audit log creation and querying
- **SessionService**: JWT session management, single-session enforcement

### 4. Repository Layer (`repository/`)
JPA repositories extending JpaRepository:
- **UserRepository**: User queries with email lookup
- **HealthMetricRepository**: Metric queries with date range filtering
- **CarePlanRepository**: Care plan queries by patient/creator
- **AppointmentRepository**: Appointment queries with conflict detection
- **DietPlanRequestRepository**: Request queries by status and user
- **SupportTicketRepository**: Ticket queries by status and assignment
- **MessageRepository**: Message queries for inbox/sent
- **AccessLogRepository**: Audit log queries with date filtering
- **UserSessionRepository**: Session queries by user and token

### 5. Entity Layer (`entity/`)
JPA entities with relationships:
- **User**: Core user entity with role enum (PATIENT, DOCTOR, DIETITIAN, SUPPORT_STAFF, SYSTEM_ADMIN, SUPER_ADMIN)
- **HealthMetric**: Daily health data (calories, exercise, sleep, water, symptoms)
- **CarePlan**: Treatment/meal plans with adherence percentage
- **Appointment**: Scheduled appointments with conflict detection
- **DietPlanRequest**: Diet plan requests with status workflow
- **SupportTicket**: Support tickets with chat integration
- **Message**: Secure messages between users
- **AccessLog**: Audit trail for compliance
- **UserSession**: JWT session tracking

### 6. DTO Layer (`dto/`)
Request/response objects decoupling API from persistence:
- **UserDTO**: User data without password
- **HealthMetricDTO**: Health metric data transfer
- **HealthTrendDTO**: Aggregated trend data
- **CarePlanDTO**: Care plan data transfer
- **AppointmentDTO**: Appointment data transfer
- **DietPlanRequestDTO**: Diet request data transfer
- **SupportTicketDTO**: Support ticket data transfer
- **MessageDTO**: Message data transfer

### 7. Security Layer (`security/`)
Authentication and authorization:
- **JwtUtil**: JWT token generation, validation, claims extraction
- **JwtAuthenticationFilter**: Request filter for token validation
- **CustomUserDetailsService**: Spring Security user details loading
- **SecurityUtil**: Security context utilities

### 8. Utility Layer (`util/`)
Cross-cutting concerns:
- **HealthScoreCalculator**: O(1) health score algorithm (0-100 range)
- **HtmlSanitizer**: OWASP-based XSS prevention
- **SqlEscapeUtil**: SQL injection prevention (emergency use only)

## Architectural Patterns

### Layered Architecture
- **Presentation**: Controllers handle HTTP requests/responses
- **Business Logic**: Services contain transactional operations
- **Data Access**: Repositories abstract database operations
- **Domain Model**: Entities represent database tables

### Dependency Flow
```
Controller → Service → Repository → Entity
     ↓          ↓
    DTO      Utility
```

### Key Design Principles
- **Single Responsibility**: Each class has one clear purpose
- **Dependency Inversion**: Depend on interfaces (JpaRepository)
- **Constructor Injection**: All dependencies injected via constructor (private final)
- **DTO Pattern**: Decouple API contracts from persistence models
- **Repository Pattern**: Abstract data access through JPA repositories

## Database Schema Relationships

### User-Centric Relationships
- User → HealthMetric (one-to-many)
- User → CarePlan (one-to-many as patient, one-to-many as creator)
- User → Appointment (many-to-one as patient, many-to-one as clinician)
- User → DietPlanRequest (one-to-many as patient, many-to-one as dietitian)
- User → SupportTicket (one-to-many as patient, many-to-one as assigned staff)
- User → Message (one-to-many as sender, one-to-many as recipient)
- User → AccessLog (one-to-many)
- User → UserSession (one-to-many)

### Workflow Relationships
- SupportTicket → Message (one-to-many for chat)

## Configuration Files

### application.properties
- Database connection (MySQL)
- JPA/Hibernate settings
- JWT secret and expiration
- Server port configuration

### pom.xml
- Spring Boot 3.2.0 parent
- Dependencies: Web, JPA, Security, MySQL, JWT, OWASP Sanitizer, Lombok
- Maven compiler plugin (Java 17)
- Spring Boot Maven plugin

## Entry Point

### Application.java
- Main class with @SpringBootApplication
- CommandLineRunner bean for data seeding
- Seeds sample users: patient, physician, dietitian, admin
- Seeds sample messages for demonstration

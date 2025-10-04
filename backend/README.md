# Health Connect Backend

Production-ready Spring Boot 3.x backend for the Health Connect platform with role-based access control, health metrics tracking, care plan management, appointment scheduling, and secure messaging.

## Technology Stack

- **Java 17+**
- **Spring Boot 3.2.0**
- **Spring Data JPA** with MySQL
- **Spring Security** with JWT authentication
- **OWASP HTML Sanitizer** for XSS prevention
- **JUnit 5 & Mockito** for testing

## Prerequisites

- JDK 17 or higher
- Maven 3.6+
- MySQL 8.0+

## Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE health_connect;
```

2. Update `src/main/resources/application.properties` with your MySQL credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/health_connect
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## Build & Run

### Build the project:
```bash
mvn clean package
```

### Run the application:
```bash
java -jar target/health-connect-1.0.0.jar
```

Or use Maven:
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## Testing

Run all tests:
```bash
mvn test
```

Run specific test class:
```bash
mvn test -Dtest=UserServiceTest
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Users (Admin only)
- `GET /api/users?page=0&size=10` - Get all users (paginated)
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Health Metrics
- `POST /api/health-metrics` - Log health metric
- `GET /api/health-metrics/user/{userId}` - Get user's metrics
- `GET /api/health-metrics/user/{userId}/range?startDate=2024-01-01&endDate=2024-12-31` - Get metrics in date range

### Care Plans
- `POST /api/care-plans` - Create care plan
- `PUT /api/care-plans/{id}` - Update care plan
- `PUT /api/care-plans/{id}/adherence` - Update adherence percentage
- `GET /api/care-plans/patient/{patientId}` - Get patient's care plans
- `GET /api/care-plans/creator/{creatorId}` - Get creator's care plans

### Appointments
- `GET /api/appointments/doctors` - Get all doctors (Patient only)
- `POST /api/appointments` - Book appointment (Patient only)
- `DELETE /api/appointments/{id}` - Cancel appointment (Patient only)
- `PUT /api/appointments/{id}/status` - Update status to Done/Cancelled (Doctor only)
- `GET /api/appointments/my-appointments` - Get own appointments (Patient/Doctor)
- `GET /api/appointments/check-conflict?clinicianId=1&scheduledTime=2024-01-15T10:00:00` - Check time slot conflict

### Diet Plan Requests
- `POST /api/diet-requests` - Create diet plan request (Patient only, max 3 open)
- `PUT /api/diet-requests/{id}` - Update own request (Patient only)
- `DELETE /api/diet-requests/{id}` - Delete own request (Patient only)
- `GET /api/diet-requests/queue` - View pending requests (Dietitian only)
- `POST /api/diet-requests/{id}/accept` - Accept request (Dietitian only)
- `GET /api/diet-requests/my-requests` - Get own requests (Patient/Dietitian)

### Support Tickets
- `POST /api/support-tickets` - Create support ticket (Patient only)
- `GET /api/support-tickets/queue` - View open tickets (Support Staff only)
- `POST /api/support-tickets/{id}/accept` - Accept ticket (Support Staff only)
- `PUT /api/support-tickets/{id}/resolve` - Resolve ticket (Assigned Staff only)
- `GET /api/support-tickets/my-tickets` - Get own tickets (Patient/Support Staff)
- `GET /api/support-tickets/{id}/chat-access` - Check chat access
- `POST /api/messages/ticket/{ticketId}` - Send message in ticket chat (Patient/Assigned Staff only)

### Compliance (Admin/Super Admin Only)
- `GET /api/compliance/logs?startDate=...&endDate=...` - Get access logs
- `GET /api/compliance/logs/user/{userId}` - Get user-specific logs
- `GET /api/compliance/export/csv?startDate=...&endDate=...` - Export logs to CSV

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/inbox/{userId}` - Get inbox
- `GET /api/messages/sent/{userId}` - Get sent messages
- `PUT /api/messages/{messageId}/read` - Mark as read

## Sample Data

The application seeds sample data on startup:
- Patient: `patient@example.com` / `password123`
- Physician: `physician@example.com` / `password123`
- Dietitian: `dietitian@example.com` / `password123`
- Admin: `admin@example.com` / `password123`

## Authentication

Include JWT token in request headers:
```
Authorization: Bearer <your_jwt_token>
```

## Role-Based Access

- **PATIENT** - Access personal health records, messages, appointments
- **DIETITIAN** - Create meal plans, view assigned patients
- **PHYSICIAN** - Create treatment plans, view medical records
- **SUPPORT_STAFF** - Manage appointments, no medical access
- **SYSTEM_ADMIN** - User management, system configuration
- **SUPER_ADMIN** - Full system access

## Health Score Algorithm

The health score prediction uses O(1) time complexity, calculating scores based on:
- Calorie intake (1800-2500 optimal)
- Exercise minutes (30-90 optimal)
- Sleep hours (7-9 optimal)
- Water intake (2000-3000ml optimal)
- Symptom presence (penalty)

Score range: 0-100 (higher is better)

## Security Features

- JWT-based stateless authentication
- BCrypt password hashing
- OWASP HTML sanitization for all user inputs
- SQL injection prevention via JPA
- Role-based endpoint authorization
- 30-minute session timeout (configurable)

## Watch-Out Tips

### 1. Never mix field injection with constructor injection
❌ **Wrong:**
```java
@Autowired
private UserRepository userRepository;

public UserService(HtmlSanitizer sanitizer) { ... }
```

✅ **Correct:**
```java
private final UserRepository userRepository;
private final HtmlSanitizer sanitizer;

public UserService(UserRepository userRepository, HtmlSanitizer sanitizer) {
    this.userRepository = userRepository;
    this.sanitizer = sanitizer;
}
```

### 2. Avoid circular dependencies between services and repositories
❌ **Wrong:**
```java
@Service
class ServiceA {
    private final ServiceB serviceB;
    // ServiceA depends on ServiceB
}

@Service
class ServiceB {
    private final ServiceA serviceA;
    // ServiceB depends on ServiceA - CIRCULAR!
}
```

✅ **Correct:**
- Extract common logic to a separate service
- Use events/messaging for decoupling
- Refactor dependencies to be unidirectional

### 3. Don't mix static utilities with beans when you need to mock behavior
❌ **Wrong:**
```java
public class HtmlSanitizer {
    public static String sanitize(String input) { ... }
}
// Cannot mock in tests!
```

✅ **Correct:**
```java
@Component
public class HtmlSanitizer {
    public String sanitize(String input) { ... }
}
// Can be mocked with @Mock
```

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/example/app/
│   │   │   ├── config/          # Security & app configuration
│   │   │   ├── controller/      # REST endpoints
│   │   │   ├── dto/             # Data transfer objects
│   │   │   ├── entity/          # JPA entities
│   │   │   ├── repository/      # Data access layer
│   │   │   ├── security/        # JWT & authentication
│   │   │   ├── service/         # Business logic
│   │   │   ├── util/            # Utilities (sanitizer, calculator)
│   │   │   └── Application.java # Main entry point
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/com/example/app/
│           └── service/         # Unit tests
└── pom.xml
```

## Performance Optimizations

- Health score calculation: O(1) time complexity
- Database indexing on foreign keys and email
- Pagination support for large datasets
- Stateless JWT authentication (no session storage)

## Future Enhancements

- Redis caching for frequently accessed data
- MongoDB for unstructured health data
- Docker containerization
- HTTPS/TLS configuration
- Rate limiting
- API documentation with Swagger/OpenAPI

## License

Proprietary - Health Connect Platform

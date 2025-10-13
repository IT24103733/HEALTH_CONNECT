# Health Connect - Technology Stack

## Programming Languages
- **Java 17** - Primary backend language
- **SQL** - Database queries via JPA/Hibernate

## Frameworks & Libraries

### Core Framework
- **Spring Boot 3.2.0** - Application framework
- **Spring Web** - REST API development
- **Spring Data JPA** - Database abstraction
- **Spring Security** - Authentication and authorization

### Security
- **JWT (JJWT 0.12.3)** - Token-based authentication
  - jjwt-api (compile)
  - jjwt-impl (runtime)
  - jjwt-jackson (runtime)
- **OWASP HTML Sanitizer 20220608.1** - XSS prevention
- **BCrypt** - Password hashing (via Spring Security)

### Database
- **MySQL 8.0+** - Primary database
- **Hibernate** - ORM (via Spring Data JPA)
- **MySQL Connector/J** - JDBC driver (runtime)

### Development Tools
- **Lombok** - Boilerplate reduction (@Getter, @Setter, @Entity annotations)
- **Maven 3.6+** - Build and dependency management

### Testing
- **JUnit 5** - Unit testing framework
- **Mockito** - Mocking framework
- **Spring Boot Test** - Integration testing
- **Spring Security Test** - Security testing

## Build System

### Maven Configuration
- **Group ID**: com.example
- **Artifact ID**: health-connect
- **Version**: 1.0.0
- **Packaging**: JAR
- **Java Version**: 17 (source and target)

### Maven Plugins
- **maven-compiler-plugin 3.11.0** - Java compilation
- **spring-boot-maven-plugin** - Executable JAR packaging

## Development Commands

### Build
```bash
# Clean and build project
mvn clean package

# Build without tests
mvn clean package -DskipTests

# Compile only
mvn compile
```

### Run
```bash
# Run as JAR
java -jar target/health-connect-1.0.0.jar

# Run with Maven
mvn spring-boot:run

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Test
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=UserServiceTest

# Run with coverage
mvn test jacoco:report
```

### Clean
```bash
# Remove target directory
mvn clean
```

## Database Setup

### MySQL Database Creation
```sql
CREATE DATABASE health_connect;
```

### Configuration (application.properties)
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/health_connect
spring.datasource.username=your_username
spring.datasource.password=your_password

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# JWT
jwt.secret=your_secret_key_here
jwt.expiration=1800000

# Server
server.port=8080
```

## Runtime Environment

### Prerequisites
- **JDK 17+** - Java Development Kit
- **Maven 3.6+** - Build tool
- **MySQL 8.0+** - Database server

### Application Startup
- Default port: **8080**
- Base URL: `http://localhost:8080`
- API prefix: `/api`

### Sample Credentials (Seeded on Startup)
- Patient: `patient@example.com` / `password123`
- Physician: `physician@example.com` / `password123`
- Dietitian: `dietitian@example.com` / `password123`
- Admin: `admin@example.com` / `password123`

## API Authentication

### JWT Token Flow
1. POST `/api/auth/login` with credentials
2. Receive JWT token in response
3. Include token in subsequent requests:
   ```
   Authorization: Bearer <jwt_token>
   ```
4. Token expires after 30 minutes (configurable)

## Performance Characteristics

### Algorithm Complexity
- **Health Score Calculation**: O(1) time complexity
- **Pagination**: Supported via Spring Data Pageable
- **Database Indexing**: Foreign keys and email fields

### Scalability Features
- Stateless JWT authentication (no session storage)
- Paginated list endpoints
- Connection pooling (via HikariCP)

## Security Features

### Authentication
- JWT-based stateless authentication
- BCrypt password hashing (strength 10)
- 30-minute session timeout
- Single-session enforcement

### Authorization
- Role-based access control (RBAC)
- Method-level security (@PreAuthorize)
- Endpoint-level authorization

### Input Validation
- JSR-380 validation annotations (@Valid, @NotNull, @Size)
- OWASP HTML sanitization
- SQL injection prevention via JPA

### Compliance
- Access logging for all requests
- Audit trail with timestamps
- CSV export for regulatory reporting

## Development Workflow

### Project Structure
```
backend/
├── src/main/java/com/example/app/  # Source code
├── src/main/resources/             # Configuration
├── src/test/java/                  # Tests
├── target/                         # Build output
└── pom.xml                         # Maven config
```

### Code Organization
- Package: `com.example.app`
- Layers: config, controller, dto, entity, repository, security, service, util
- Entry point: `Application.java`

## Future Enhancements
- Redis caching for session management
- MongoDB for unstructured health data
- Docker containerization
- HTTPS/TLS configuration
- Rate limiting
- Swagger/OpenAPI documentation

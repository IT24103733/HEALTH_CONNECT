# Health Connect - Design Patterns Implementation

This document identifies and explains all design patterns implemented in the Health Connect backend application.

---

## 1. Layered Architecture Pattern

### Description
Separation of concerns through distinct architectural layers with clear responsibilities and dependencies flowing in one direction.

### Implementation
```
Presentation Layer (Controllers)
        ↓
Business Logic Layer (Services)
        ↓
Data Access Layer (Repositories)
        ↓
Domain Model Layer (Entities)
```

### Code Examples
- **Controllers**: `UserController`, `HealthMetricController`, `CarePlanController`
- **Services**: `UserService`, `HealthMetricService`, `CarePlanService`
- **Repositories**: `UserRepository`, `HealthMetricRepository`, `CarePlanRepository`
- **Entities**: `User`, `HealthMetric`, `CarePlan`

### Benefits
- Clear separation of concerns
- Easy to test each layer independently
- Maintainable and scalable architecture
- Reduced coupling between layers

---

## 2. Repository Pattern

### Description
Abstraction layer between business logic and data access, providing a collection-like interface for domain objects.

### Implementation
All repositories extend `JpaRepository<Entity, ID>` interface:

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(User.Role role);
}
```

### Code Examples
- `UserRepository` - User data access
- `HealthMetricRepository` - Health metrics data access
- `CarePlanRepository` - Care plan data access
- `AppointmentRepository` - Appointment data access
- `SupportTicketRepository` - Support ticket data access
- `MessageRepository` - Message data access
- `AccessLogRepository` - Audit log data access
- `UserSessionRepository` - Session data access

### Benefits
- Decouples business logic from data access
- Centralized data access logic
- Easy to mock for testing
- Supports query method naming conventions

---

## 3. Data Transfer Object (DTO) Pattern

### Description
Objects that carry data between processes, decoupling API contracts from domain models.

### Implementation
```java
public class UserDTO {
    private final Long id;
    private final String name;
    private final String email;
    private final String role;
    
    public static UserDTO fromEntity(User user) {
        return new UserDTO(user.getId(), user.getName(), 
                          user.getEmail(), user.getRole().name());
    }
}
```

### Code Examples
- `UserDTO` - User data transfer
- `HealthMetricDTO` - Health metric data transfer
- `CarePlanDTO` - Care plan data transfer
- `AppointmentDTO` - Appointment data transfer
- `SupportTicketDTO` - Support ticket data transfer
- `MessageDTO` - Message data transfer
- `CreateCarePlanRequest` - Care plan creation request
- `UpdateCarePlanContentRequest` - Care plan update request
- `UpdateAdherenceRequest` - Adherence update request

### Benefits
- Hides internal domain model structure
- Prevents over-fetching/under-fetching
- Enables API versioning
- Reduces network payload

---

## 4. Dependency Injection Pattern

### Description
Inversion of control where dependencies are provided to a class rather than created by the class.

### Implementation
Constructor injection with private final fields:

```java
@Service
public class UserService {
    private final UserRepository userRepository;
    private final HtmlSanitizer htmlSanitizer;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, 
                      HtmlSanitizer htmlSanitizer,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.htmlSanitizer = htmlSanitizer;
        this.passwordEncoder = passwordEncoder;
    }
}
```

### Code Examples
- All `@Service` classes use constructor injection
- All `@Controller` classes use constructor injection
- All `@Configuration` classes use constructor injection
- `SecurityConfig` injects `JwtAuthenticationFilter`

### Benefits
- Loose coupling between components
- Easy to test with mocks
- Immutable dependencies (final fields)
- Clear dependency requirements

---

## 5. Strategy Pattern

### Description
Defines a family of algorithms, encapsulates each one, and makes them interchangeable.

### Implementation
Health score calculation with different scoring strategies:

```java
@Component
public class HealthScoreCalculator {
    public int predictScore(List<HealthMetric> metrics) {
        // Delegates to specific scoring strategies
        score += calculateCalorieScore(latest.getCaloriesIntake());
        score += calculateExerciseScore(latest.getExerciseMinutes());
        score += calculateSleepScore(latest.getSleepHours());
        score += calculateWaterScore(latest.getWaterIntake());
    }
    
    private int calculateCalorieScore(int calories) { /* strategy */ }
    private int calculateExerciseScore(int minutes) { /* strategy */ }
    private int calculateSleepScore(int hours) { /* strategy */ }
    private int calculateWaterScore(int ml) { /* strategy */ }
}
```

### Code Examples
- `HealthScoreCalculator` - Different scoring algorithms for each health metric

### Benefits
- Easy to add new scoring algorithms
- Each strategy is independently testable
- Encapsulates algorithm complexity
- O(1) time complexity maintained

---

## 6. Factory Method Pattern

### Description
Defines an interface for creating objects, letting subclasses decide which class to instantiate.

### Implementation
Static factory methods in DTOs:

```java
public class UserDTO {
    public static UserDTO fromEntity(User user) {
        return new UserDTO(user.getId(), user.getName(), 
                          user.getEmail(), user.getRole().name());
    }
}
```

### Code Examples
- `UserDTO.fromEntity(User)` - Create DTO from entity
- `HealthMetricDTO.fromEntity(HealthMetric)` - Create DTO from entity
- `CarePlanDTO.fromEntity(CarePlan)` - Create DTO from entity
- `AppointmentDTO.fromEntity(Appointment)` - Create DTO from entity
- All DTOs implement `fromEntity()` factory method

### Benefits
- Centralized object creation logic
- Consistent conversion from entity to DTO
- Easy to modify creation logic
- Encapsulates construction complexity

---

## 7. Singleton Pattern

### Description
Ensures a class has only one instance and provides global access to it.

### Implementation
Spring-managed beans are singletons by default:

```java
@Service
public class UserService { /* singleton */ }

@Component
public class HealthScoreCalculator { /* singleton */ }

@Configuration
public class SecurityConfig { /* singleton */ }
```

### Code Examples
- All `@Service` annotated classes
- All `@Component` annotated classes
- All `@Configuration` annotated classes
- All `@Repository` interfaces (proxied as singletons)

### Benefits
- Single instance per application context
- Reduced memory footprint
- Consistent state across application
- Thread-safe (Spring manages lifecycle)

---

## 8. Chain of Responsibility Pattern

### Description
Passes requests along a chain of handlers, where each handler decides to process or pass to the next.

### Implementation
Spring Security filter chain:

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) {
    http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth.requestMatchers(...))
        .sessionManagement(session -> session.sessionCreationPolicy(...))
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
}
```

Filter chain execution:
1. `JwtAuthenticationFilter` - Validates JWT token
2. `UsernamePasswordAuthenticationFilter` - Spring Security default
3. Authorization filters - Check role-based access
4. Controller method execution

### Code Examples
- `JwtAuthenticationFilter` - First in chain, validates JWT
- `SecurityFilterChain` - Configures filter chain order
- `AccessLogInterceptor` - Logs requests after authentication

### Benefits
- Flexible request processing pipeline
- Easy to add/remove filters
- Each filter has single responsibility
- Decoupled filter logic

---

## 9. Template Method Pattern

### Description
Defines skeleton of algorithm in base class, letting subclasses override specific steps.

### Implementation
Spring's `OncePerRequestFilter`:

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain) {
        // Custom JWT validation logic
        String token = securityUtil.extractToken(request);
        if (token != null && jwtUtil.validateToken(token, userDetails)) {
            // Set authentication
        }
        filterChain.doFilter(request, response);
    }
}
```

### Code Examples
- `JwtAuthenticationFilter extends OncePerRequestFilter` - Overrides `doFilterInternal()`

### Benefits
- Reuses common filter logic from Spring
- Guarantees single execution per request
- Consistent filter behavior
- Easy to customize specific steps

---

## 10. Facade Pattern

### Description
Provides simplified interface to complex subsystem.

### Implementation
Service layer facades complex operations:

```java
@Service
public class HealthMetricService {
    // Facades complex operations involving multiple components
    @Transactional
    public HealthMetric logMetric(Long userId, LocalDate date, ...) {
        String sanitizedSymptoms = htmlSanitizer.sanitize(symptoms);
        int healthScore = healthScoreCalculator.predictScore(
            healthMetricRepository.findByUserIdOrderByDateDesc(userId)
        );
        HealthMetric metric = new HealthMetric(..., healthScore);
        return healthMetricRepository.save(metric);
    }
}
```

### Code Examples
- `HealthMetricService.logMetric()` - Facades sanitization, calculation, persistence
- `AppointmentService.scheduleAppointment()` - Facades conflict detection, sanitization, persistence
- `CarePlanService.createCarePlan()` - Facades validation, sanitization, persistence

### Benefits
- Simplifies complex operations
- Hides subsystem complexity
- Single entry point for business logic
- Reduces client coupling to subsystems

---

## 11. Decorator Pattern

### Description
Adds behavior to objects dynamically without affecting other objects.

### Implementation
Spring Security's authentication wrapping:

```java
UsernamePasswordAuthenticationToken authToken = 
    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
SecurityContextHolder.getContext().setAuthentication(authToken);
```

### Code Examples
- `UsernamePasswordAuthenticationToken` - Decorates user details with authentication
- `WebAuthenticationDetailsSource` - Decorates authentication with request details

### Benefits
- Adds authentication details dynamically
- Flexible authentication enhancement
- Maintains original object interface
- Composable authentication details

---

## 12. Observer Pattern

### Description
Defines one-to-many dependency where observers are notified of state changes.

### Implementation
Spring's event-driven architecture (implicit):

```java
@Transactional
public HealthMetric logMetric(...) {
    HealthMetric metric = healthMetricRepository.save(metric);
    // Transaction commit triggers JPA listeners
    return metric;
}
```

### Code Examples
- JPA entity lifecycle callbacks (implicit)
- Spring transaction management (implicit)
- `@Transactional` annotation triggers commit/rollback observers

### Benefits
- Automatic persistence synchronization
- Decoupled event handling
- Consistent transaction management
- Automatic rollback on exceptions

---

## 13. Proxy Pattern

### Description
Provides surrogate or placeholder to control access to an object.

### Implementation
Spring Data JPA repository proxies:

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    // Spring creates proxy implementation at runtime
}
```

Spring AOP proxies for transactions:

```java
@Service
public class UserService {
    @Transactional  // Spring creates proxy to manage transactions
    public User createUser(...) { }
}
```

### Code Examples
- All `JpaRepository` interfaces - Spring creates proxy implementations
- All `@Transactional` methods - Spring creates proxy for transaction management
- All `@PreAuthorize` methods - Spring creates proxy for security checks

### Benefits
- Automatic transaction management
- Automatic security enforcement
- No boilerplate data access code
- Lazy loading support

---

## 14. Builder Pattern (Implicit)

### Description
Separates construction of complex object from its representation.

### Implementation
Entity constructors with all-args pattern:

```java
public class User {
    protected User() { /* JPA */ }
    
    public User(Long id, String name, String email, String passwordHash, 
                Role role, String specialization, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.specialization = specialization;
        this.createdAt = createdAt;
    }
}
```

### Code Examples
- All entity classes have protected no-arg constructor (JPA) and all-args constructor
- `User`, `HealthMetric`, `CarePlan`, `Appointment`, `SupportTicket`, `Message`

### Benefits
- Clear object construction
- Immutable object creation
- JPA compatibility
- Explicit field initialization

---

## 15. Adapter Pattern

### Description
Converts interface of a class into another interface clients expect.

### Implementation
Spring Security's `UserDetailsService` adapter:

```java
@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        return org.springframework.security.core.userdetails.User
            .withUsername(user.getEmail())
            .password(user.getPasswordHash())
            .roles(user.getRole().name())
            .build();
    }
}
```

### Code Examples
- `CustomUserDetailsService` - Adapts `User` entity to Spring Security's `UserDetails`

### Benefits
- Integrates custom User entity with Spring Security
- Maintains separation between domain and security
- Reuses Spring Security infrastructure
- Type-safe role conversion

---

## 16. Exception Handling Pattern (Centralized)

### Description
Centralized exception handling across all controllers.

### Implementation
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFoundException(NotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }
    
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Map<String, String>> handleUnauthorizedException(UnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", ex.getMessage()));
    }
}
```

### Code Examples
- `GlobalExceptionHandler` - Centralized exception handling
- Custom exceptions: `NotFoundException`, `UnauthorizedException`, `ValidationException`

### Benefits
- Consistent error responses
- Reduced boilerplate in controllers
- Single source of truth for error handling
- Easy to modify error format

---

## 17. Interceptor Pattern

### Description
Intercepts requests/responses to add cross-cutting concerns.

### Implementation
```java
@Component
public class AccessLogInterceptor implements HandlerInterceptor {
    @Override
    public void afterCompletion(HttpServletRequest request, 
                               HttpServletResponse response, 
                               Object handler, Exception ex) {
        String action = request.getMethod() + " " + request.getRequestURI();
        accessLogService.logAccess(userId, action, ipAddress, userAgent);
    }
}
```

### Code Examples
- `AccessLogInterceptor` - Logs all HTTP requests for compliance

### Benefits
- Automatic audit logging
- Decoupled from business logic
- Consistent logging across all endpoints
- Easy to enable/disable

---

## 18. Specification Pattern (Implicit)

### Description
Encapsulates business rules in reusable specifications.

### Implementation
Spring Data JPA query methods:

```java
public interface HealthMetricRepository extends JpaRepository<HealthMetric, Long> {
    List<HealthMetric> findByUserIdOrderByDateDesc(Long userId);
    List<HealthMetric> findByUserIdAndDateBetween(Long userId, LocalDate start, LocalDate end);
}
```

### Code Examples
- All repository query methods encapsulate query specifications
- Method names define query criteria (specification)

### Benefits
- Reusable query logic
- Type-safe queries
- No SQL in business logic
- Easy to compose complex queries

---

## 19. Service Locator Pattern (Implicit)

### Description
Provides central registry for locating services.

### Implementation
Spring's ApplicationContext acts as service locator:

```java
@Service
public class UserService {
    // Spring locates and injects dependencies
    private final UserRepository userRepository;
    private final HtmlSanitizer htmlSanitizer;
    private final PasswordEncoder passwordEncoder;
}
```

### Code Examples
- Spring ApplicationContext - Manages and locates all beans
- Constructor injection - Spring locates dependencies automatically

### Benefits
- Automatic dependency resolution
- Centralized bean management
- Lifecycle management
- Lazy initialization support

---

## 20. Immutable Object Pattern

### Description
Objects whose state cannot be modified after construction.

### Implementation
DTOs with final fields:

```java
public class UserDTO {
    private final Long id;
    private final String name;
    private final String email;
    private final String role;
    
    public UserDTO(Long id, String name, String email, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }
    
    // Only getters, no setters
}
```

### Code Examples
- All DTO classes use final fields with no setters
- `UserDTO`, `HealthMetricDTO`, `CarePlanDTO`, `AppointmentDTO`

### Benefits
- Thread-safe by design
- Prevents accidental modification
- Easier to reason about
- Safe to share across threads

---

## Summary Table

| Pattern | Implementation | Primary Benefit |
|---------|---------------|-----------------|
| Layered Architecture | Controllers → Services → Repositories → Entities | Separation of concerns |
| Repository | JpaRepository interfaces | Data access abstraction |
| DTO | UserDTO, HealthMetricDTO, etc. | API/domain decoupling |
| Dependency Injection | Constructor injection | Loose coupling |
| Strategy | HealthScoreCalculator | Interchangeable algorithms |
| Factory Method | DTO.fromEntity() | Centralized object creation |
| Singleton | Spring beans | Single instance |
| Chain of Responsibility | Security filter chain | Request processing pipeline |
| Template Method | OncePerRequestFilter | Reusable algorithm skeleton |
| Facade | Service layer methods | Simplified interface |
| Decorator | Authentication wrapping | Dynamic behavior addition |
| Observer | JPA lifecycle, @Transactional | Event-driven architecture |
| Proxy | JPA repositories, @Transactional | Access control |
| Builder | Entity constructors | Complex object construction |
| Adapter | CustomUserDetailsService | Interface conversion |
| Exception Handling | @ControllerAdvice | Centralized error handling |
| Interceptor | AccessLogInterceptor | Cross-cutting concerns |
| Specification | Query methods | Reusable business rules |
| Service Locator | Spring ApplicationContext | Service discovery |
| Immutable Object | DTO final fields | Thread safety |

---

## Design Principles Applied

### SOLID Principles

1. **Single Responsibility Principle (SRP)**
   - Each class has one clear purpose
   - Controllers handle HTTP, Services handle business logic, Repositories handle data access

2. **Open/Closed Principle (OCP)**
   - Open for extension (new services, repositories)
   - Closed for modification (interfaces remain stable)

3. **Liskov Substitution Principle (LSP)**
   - All repositories can substitute JpaRepository
   - All filters can substitute OncePerRequestFilter

4. **Interface Segregation Principle (ISP)**
   - Small, focused interfaces (JpaRepository methods)
   - Clients depend only on methods they use

5. **Dependency Inversion Principle (DIP)**
   - Depend on abstractions (JpaRepository interface)
   - High-level modules don't depend on low-level modules

### Additional Principles

- **DRY (Don't Repeat Yourself)** - Reusable components (HtmlSanitizer, HealthScoreCalculator)
- **KISS (Keep It Simple, Stupid)** - Simple, focused methods (3-5 lines preferred)
- **YAGNI (You Aren't Gonna Need It)** - No speculative features
- **Composition over Inheritance** - Constructor injection, not inheritance hierarchies

---

## Anti-Patterns Avoided

✅ **No God Objects** - No single class doing everything  
✅ **No Circular Dependencies** - Clear unidirectional dependencies  
✅ **No Field Injection** - Constructor injection only  
✅ **No Static Utilities with State** - Stateless utilities as Spring beans  
✅ **No Anemic Domain Model** - Entities have behavior (setters with validation)  
✅ **No Magic Numbers** - Constants for health score ranges  
✅ **No Deep Nesting** - Guard clauses, early returns  
✅ **No Long Methods** - Methods kept short (3-5 lines preferred)  

---

## Conclusion

The Health Connect backend implements 20+ design patterns following SOLID principles and industry best practices. The architecture is maintainable, testable, scalable, and secure, with clear separation of concerns and minimal coupling between components.

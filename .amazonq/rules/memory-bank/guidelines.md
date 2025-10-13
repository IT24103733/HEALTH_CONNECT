# Health Connect - Development Guidelines

## Code Quality Standards

### Naming Conventions
- **Classes**: PascalCase (e.g., `DietPlanRequest`, `HealthScoreCalculator`, `SecurityConfig`)
- **Methods**: camelCase (e.g., `predictScore`, `logMetric`, `getUserMetrics`)
- **Variables**: camelCase (e.g., `healthMetricRepository`, `jwtAuthenticationFilter`)
- **Constants**: UPPER_SNAKE_CASE for enum values (e.g., `PENDING`, `ACCEPTED`, `COMPLETED`)
- **Packages**: lowercase (e.g., `com.example.app.service`, `com.example.app.entity`)

### File Organization
- One public class per file
- File name matches class name exactly
- Package declaration first, then imports, then class definition
- Imports organized: Jakarta/Spring, then third-party, then java/javax

### Code Formatting
- **Indentation**: 4 spaces (no tabs)
- **Line length**: Keep methods short (3-5 lines preferred)
- **Braces**: Opening brace on same line, closing brace on new line
- **Spacing**: Space after keywords (if, for, while), no space before method parentheses

## Dependency Injection Pattern

### Constructor Injection (MANDATORY)
All dependencies MUST use constructor injection with private final fields:

```java
@Service
public class HealthMetricService {
    private final HealthMetricRepository healthMetricRepository;
    private final HealthScoreCalculator healthScoreCalculator;
    private final HtmlSanitizer htmlSanitizer;

    public HealthMetricService(HealthMetricRepository healthMetricRepository,
                              HealthScoreCalculator healthScoreCalculator,
                              HtmlSanitizer htmlSanitizer) {
        this.healthMetricRepository = healthMetricRepository;
        this.healthScoreCalculator = healthScoreCalculator;
        this.htmlSanitizer = htmlSanitizer;
    }
}
```

### Bean Declaration
Use @Component, @Service, @Configuration annotations for Spring-managed beans:

```java
@Component
public class HealthScoreCalculator {
    // Utility logic
}

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }
}
```

## Entity Design Patterns

### JPA Entity Structure
```java
@Entity
@Table(name = "diet_plan_requests")
public class DietPlanRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long patientId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // Protected no-arg constructor for JPA
    protected DietPlanRequest() {
        this.createdAt = LocalDateTime.now();
        this.status = RequestStatus.PENDING;
    }

    // All-args constructor for manual creation
    public DietPlanRequest(Long id, Long patientId, ...) {
        this.id = id;
        this.patientId = patientId;
        // ...
    }

    // Getters for all fields
    public Long getId() { return id; }
    
    // Setters only for mutable fields
    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    // Nested enum for status
    public enum RequestStatus {
        PENDING, ACCEPTED, COMPLETED, CANCELLED
    }
}
```

### Entity Conventions
- Use @Entity and @Table annotations
- ID field with @GeneratedValue(strategy = GenerationType.IDENTITY)
- @Column(nullable = false) for required fields
- Protected no-arg constructor for JPA
- All-args constructor for manual instantiation
- Getters for all fields, setters only for mutable fields
- Nested enums for status fields with @Enumerated(EnumType.STRING)
- Initialize timestamps in no-arg constructor (e.g., LocalDateTime.now())

## Service Layer Patterns

### Transactional Methods
Use @Transactional for methods that modify state:

```java
@Service
public class HealthMetricService {
    @Transactional
    public HealthMetric logMetric(Long userId, LocalDate date, ...) {
        String sanitizedSymptoms = htmlSanitizer.sanitize(symptoms);
        HealthMetric metric = new HealthMetric(...);
        return healthMetricRepository.save(metric);
    }
}
```

### Input Sanitization
Always sanitize user input using HtmlSanitizer:

```java
String sanitizedSymptoms = htmlSanitizer.sanitize(symptoms);
```

### Stream Processing
Use Java Streams for collection transformations:

```java
public List<HealthMetricDTO> getUserMetrics(Long userId) {
    return healthMetricRepository.findByUserIdOrderByDateDesc(userId).stream()
            .map(HealthMetricDTO::fromEntity)
            .collect(Collectors.toList());
}
```

## Security Configuration Patterns

### SecurityFilterChain Bean
```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()
            .requestMatchers("/api/users/**").hasAnyRole("SYSTEM_ADMIN", "SUPER_ADMIN")
            .requestMatchers("/api/health-metrics/**").authenticated()
            .anyRequest().authenticated()
        )
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    
    return http.build();
}
```

### Bean Definitions
```java
@Bean
public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
}

@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

## Testing Patterns

### Test Class Structure
```java
class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private HtmlSanitizer htmlSanitizer;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateUser() {
        // Arrange
        when(htmlSanitizer.sanitize(name)).thenReturn(name);
        when(passwordEncoder.encode(password)).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);
        
        // Act
        User result = userService.createUser(name, email, password, role);
        
        // Assert
        assertNotNull(result);
        assertEquals(name, result.getName());
        verify(htmlSanitizer).sanitize(name);
        verify(userRepository).save(any(User.class));
    }
}
```

### Testing Conventions
- Use @Mock for dependencies
- Use @InjectMocks for class under test
- Initialize mocks in @BeforeEach with MockitoAnnotations.openMocks(this)
- Follow Arrange-Act-Assert pattern
- Use when().thenReturn() for stubbing
- Use verify() to confirm interactions
- Use assertNotNull(), assertEquals(), assertTrue() for assertions

## Algorithm Design

### O(1) Complexity Pattern
Health score calculation demonstrates O(1) time complexity:

```java
public int predictScore(List<HealthMetric> metrics) {
    if (metrics == null || metrics.isEmpty()) {
        return 50;
    }
    
    HealthMetric latest = metrics.get(0);
    int score = 0;
    int factors = 0;
    
    if (latest.getCaloriesIntake() != null) {
        score += calculateCalorieScore(latest.getCaloriesIntake());
        factors++;
    }
    
    // ... more factors
    
    return factors > 0 ? Math.max(0, Math.min(100, score / factors)) : 50;
}

private int calculateCalorieScore(int calories) {
    if (calories >= 1800 && calories <= 2500) return 100;
    if (calories >= 1500 && calories <= 3000) return 75;
    if (calories >= 1200 && calories <= 3500) return 50;
    return 25;
}
```

### Algorithm Conventions
- Check null/empty inputs first
- Use early returns for edge cases
- Extract helper methods for scoring logic
- Use Math.max/Math.min for boundary enforcement
- Return default values for missing data

## Common Annotations

### Spring Framework
- **@SpringBootApplication** - Main application class
- **@Configuration** - Configuration classes
- **@Bean** - Bean factory methods
- **@Component** - Generic Spring-managed component
- **@Service** - Service layer classes
- **@Repository** - Data access layer (auto-applied by JpaRepository)

### Spring Security
- **@EnableWebSecurity** - Enable Spring Security
- **@PreAuthorize** - Method-level security (not used in this codebase, using SecurityFilterChain instead)

### JPA/Hibernate
- **@Entity** - JPA entity class
- **@Table(name = "...")** - Database table mapping
- **@Id** - Primary key field
- **@GeneratedValue(strategy = GenerationType.IDENTITY)** - Auto-increment ID
- **@Column(nullable = false)** - Required field
- **@Enumerated(EnumType.STRING)** - Enum stored as string

### Transaction Management
- **@Transactional** - Transactional method (service layer)

### Testing
- **@Mock** - Mockito mock object
- **@InjectMocks** - Class under test with mocked dependencies
- **@BeforeEach** - Setup method before each test
- **@Test** - Test method

## Repository Patterns

### JPA Repository Interface
```java
public interface HealthMetricRepository extends JpaRepository<HealthMetric, Long> {
    List<HealthMetric> findByUserIdOrderByDateDesc(Long userId);
    List<HealthMetric> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
}
```

### Repository Conventions
- Extend JpaRepository<Entity, IdType>
- Use Spring Data JPA query methods (findBy, OrderBy, Between)
- Return List or Optional for query methods
- No @Repository annotation needed (auto-applied)

## Error Handling

### Null Checks
Always check for null/empty collections:

```java
if (metrics == null || metrics.isEmpty()) {
    return 50; // default value
}
```

### Optional Handling
Use Optional for nullable returns:

```java
public Optional<User> findByEmail(String email) {
    return userRepository.findByEmail(email);
}
```

## Data Transfer Patterns

### DTO Conversion
Use static factory methods in DTOs:

```java
public static HealthMetricDTO fromEntity(HealthMetric metric) {
    return new HealthMetricDTO(
        metric.getId(),
        metric.getUserId(),
        metric.getDate(),
        // ...
    );
}
```

### Stream Mapping
```java
return healthMetricRepository.findByUserIdOrderByDateDesc(userId).stream()
        .map(HealthMetricDTO::fromEntity)
        .collect(Collectors.toList());
```

## Performance Patterns

### Pagination Support
Use Spring Data Pageable for large datasets (not shown in analyzed files but mentioned in README)

### Efficient Queries
- Use specific query methods (findByUserIdOrderByDateDesc)
- Filter at database level, not in Java
- Use date range queries (findByUserIdAndDateBetween)

### Stream Operations
- Use filter() before map() to reduce processing
- Use mapToDouble() for numeric aggregations
- Use average().orElse(0) for safe averaging

## Security Best Practices

### Password Handling
- Use PasswordEncoder (BCrypt) for hashing
- Never store plaintext passwords
- Encode passwords before saving

### Input Sanitization
- Sanitize all user input with HtmlSanitizer
- Apply sanitization in service layer before persistence

### Stateless Authentication
- Use JWT tokens (SessionCreationPolicy.STATELESS)
- No server-side session storage
- Add JWT filter before UsernamePasswordAuthenticationFilter

## Code Documentation

### JavaDoc (Minimal)
This codebase uses minimal comments, relying on self-documenting code:
- Clear method names (predictScore, logMetric, getUserMetrics)
- Descriptive variable names (healthMetricRepository, sanitizedSymptoms)
- Short, focused methods

### When to Comment
- Complex algorithms (health score calculation logic)
- Non-obvious business rules
- Public API contracts

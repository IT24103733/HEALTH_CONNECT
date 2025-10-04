Best Practices for AI-Generated Code in This Spring Boot Project
1. Architectural & Design Principles
- Organize by layer under com.example.app:
- config, security, controller, service, repository, entity, dto, util
- Enforce Single Responsibility Principle: one class, one clear purpose
- Follow Dependency Inversion: always depend on abstractions (interfaces)
- Use constructor injection only; declare injected dependencies as private final
- Avoid circular dependencies by clear layering and interface boundaries
2. Coding Standards & Readability
- Apply consistent naming conventions (PascalCase for classes, camelCase for methods/fields)
- Keep methods short (3–5 lines) and focused; extract helpers when logic grows
- Use meaningful variable and parameter names—no single-letter identifiers
- Limit nesting depth; prefer guard clauses over deep if/else chains
- Include JavaDoc comments on public APIs and nonobvious implementation details
3. Security & Validation
- Enforce role-based access with Spring Security annotations (@PreAuthorize, @RolesAllowed)
- Hash passwords securely (e.g., BCrypt via PasswordEncoder) and never store plaintext
- Validate all incoming data with JSR-380 annotations (@Valid, @NotNull, @Size)
- Sanitize user input using the injected HtmlSanitizer; avoid SQL injection by using JPA and SqlEscapeUtil only for emergencies
- Implement JWT sliding timeout and single-session invalidation in JwtUtil and JwtAuthenticatorFilter
4. Persistence & Transactions
- Define all repositories as public interface extending JpaRepository<…>
- Annotate service methods that modify state with @Transactional
- Use DTOs for requests and responses to decouple persistence models from API contracts
- Paginate and sort large queries at the repository level to prevent OOM issues
5. Performance & Scalability
- Optimize algorithms (e.g., health-score prediction) for O(n) or better
- Leverage pagination for list endpoints (Pageable)
- Avoid N+1 selects by configuring fetch strategies or using @EntityGraph
- Keep entity graphs shallow; load only what you need
6. Exception Handling & Logging
- Centralize error handling via @ControllerAdvice and custom error DTOs
- Log at appropriate levels:
- DEBUG for internal flows
- INFO for high-level events (user created, login successful)
- WARN/ERROR for unexpected failures
- Never log sensitive data (passwords, tokens, PII)
7. Testing & Quality Assurance
- Write unit tests with JUnit 5 and Mockito for services, utils, and controllers
- Mock external dependencies (repositories, utilities) rather than hitting the real database
- Include at least one integration test against an in-memory or test MySQL instance for critical flows
- Aim for branch coverage on all security checks and business rules
8. Configuration & Documentation
- Keep all environment-specific settings in application.properties; avoid hard-coding
- Document build (mvn clean package), run (java -jar), and test commands in README.md
- Provide API documentation snippets or examples (cURL, HTTPie) for each endpoint
- Include a diagram or overview of authentication flow and major use cases
By adhering to these practices, the generated code will be clean, secure, maintainable, and performant—ready for rapid delivery and future enhancements.

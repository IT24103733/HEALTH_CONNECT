# Four-Sprint Agile Plan: Health Connect Platform

**Team:** 6 developers, 4 sprints (2 weeks each)  
**Start Date:** Immediate  
**End Date:** Week 8

---

## Assumptions

1. **Backend foundation exists**: Spring Boot 3.x backend with MySQL, JWT authentication, and core entities already implemented (per conversation summary)
2. **RBAC priority**: Role-based access control must be integrated early across all features to enable secure development
3. **Screenshot alignment**: Sprint structure from screenshot shows login/meal logging/exercise tracking (Sprint 1), meal plan editor/nutrition logs/physician notes (Sprint 2), progress dashboards/messaging/reminders (Sprint 3), and staff interface/lockout/admin tools (Sprint 4)
4. **Proposal.md drives scope**: Six feature areas map to six developers; no wearable integration, no AI/ML, English-only, internet-required
5. **Velocity assumption**: 40 story points per sprint (average 6-7 points per developer per sprint)

---

## Sprint 1: Foundation & Core User Flows
**Sprint Summary:** Establish RBAC enforcement, authentication flows, and basic patient health logging capabilities

### Goals
- Integrate RBAC into authentication and authorization layers
- Deliver login/logout with 30-minute inactivity timeout
- Enable patients to log meals, water intake, and exercise
- Implement appointment scheduling system for patients and doctors
- Set up CI/CD pipeline and automated testing framework

### Backlog

#### Epic 1.1: Role-Based Access Control Foundation (Owner: it24103733)
**Story 1.1.1:** Implement JWT-based authentication with role enforcement (8 points)
- **Subtasks:**
  - Integrate JwtAuthenticationFilter with role validation (it24103733, 3 pts)
  - Add @PreAuthorize annotations to all controller endpoints (it24103733, 3 pts)
  - Write unit tests for SecurityConfig and role checks (it24103733, 2 pts)

**Story 1.1.2:** Build 30-minute inactivity timeout mechanism (5 points)
- **Subtasks:**
  - Implement SessionService.updateActivity() calls in filter (it24103733, 2 pts)
  - Add session validation logic in JwtAuthenticationFilter (it24103733, 2 pts)
  - Create integration test for timeout behavior (it24103733, 1 pt)

**Story 1.1.3:** Create user registration and login endpoints (3 points)
- **Subtasks:**
  - Expose POST /api/auth/register with role assignment (it24103733, 1 pt)
  - Expose POST /api/auth/login with token generation (it24103733, 1 pt)
  - Add input validation and error handling (it24103733, 1 pt)

#### Epic 1.2: Health Metrics Dashboard - Patient Logging (Owner: it24103773)
**Story 1.2.1:** Build meal and water intake logging UI and API (5 points)
- **Subtasks:**
  - Create React form components for meal/water entry (it24103773, 2 pts)
  - Wire POST /api/health-metrics/log endpoint (it24103773, 2 pts)
  - Add HTML sanitization and validation (it24103773, 1 pt)

**Story 1.2.2:** Implement exercise tracking module (3 points)
- **Subtasks:**
  - Design exercise logging form with activity type and duration (it24103773, 1 pt)
  - Extend HealthMetric entity to include exercise fields (it24103773, 1 pt)
  - Write service layer logic and tests (it24103773, 1 pt)

**Story 1.2.3:** Display user's logged metrics in list view (2 points)
- **Subtasks:**
  - Create GET /api/health-metrics/user/{id} endpoint (it24103773, 1 pt)
  - Build React table component to display metrics (it24103773, 1 pt)

#### Epic 1.3: Appointment Management - Scheduling System (Owner: it24103747)
**Story 1.3.1:** Implement appointment scheduling for patients (5 points)
- **Subtasks:**
  - Build calendar UI component with date/time picker (it24103747, 2 pts)
  - Integrate POST /api/appointments/schedule with conflict detection (it24103747, 2 pts)
  - Add role check to ensure only patients can book (it24103747, 1 pt)

**Story 1.3.2:** Create doctor availability view (3 points)
- **Subtasks:**
  - Implement GET /api/appointments/doctors endpoint (it24103747, 1 pt)
  - Build doctor selection UI with specialty filters (it24103747, 2 pts)

**Story 1.3.3:** Enable appointment cancellation (2 points)
- **Subtasks:**
  - Add DELETE /api/appointments/{id}/cancel endpoint (it24103747, 1 pt)
  - Update UI to show cancel button for scheduled appointments (it24103747, 1 pt)

#### Epic 1.4: CI/CD and Testing Infrastructure (Owner: it24103635)
**Story 1.4.1:** Set up CI/CD pipeline with GitHub Actions (5 points)
- **Subtasks:**
  - Configure Maven build and test execution (it24103635, 2 pts)
  - Add static analysis with SonarQube or Checkstyle (it24103635, 2 pts)
  - Set up deployment to staging environment (it24103635, 1 pt)

**Story 1.4.2:** Establish unit test coverage baseline (3 points)
- **Subtasks:**
  - Configure JaCoCo for 70% coverage threshold (it24103635, 1 pt)
  - Write missing tests for UserService and HealthMetricService (it24103635, 2 pts)

### Dependencies
- **Internal:** Story 1.1.1 must complete before all other stories (RBAC enforcement required)
- **External:** None

### Acceptance Criteria

**Story 1.1.1:**
- All endpoints return 401 for unauthenticated requests
- Endpoints return 403 when user lacks required role
- JWT tokens include role claims and expire after 30 minutes

**Story 1.1.2:**
- User session invalidates after 30 minutes of inactivity
- Active users remain logged in beyond 30 minutes
- Session validation occurs on every authenticated request

**Story 1.1.3:**
- Registration creates user with specified role (PATIENT, DIETITIAN, PHYSICIAN, etc.)
- Login returns JWT token and user profile
- Invalid credentials return 401 with error message

**Story 1.2.1:**
- Patients can log meals with calories, carbs, protein, fat
- Water intake recorded in milliliters
- All inputs sanitized via HtmlSanitizer

**Story 1.2.2:**
- Exercise logs include activity type, duration, and calories burned
- HealthMetric entity persists exercise data
- Service layer calculates health score including exercise

**Story 1.2.3:**
- Patients see only their own metrics
- Doctors see metrics for assigned patients
- List sorted by date descending

**Story 1.3.1:**
- Patients can book appointments with available doctors
- System detects and prevents double-booking
- Appointment status defaults to SCHEDULED

**Story 1.3.2:**
- Patients view list of doctors with role PHYSICIAN
- UI shows doctor name and specialty
- Selection triggers appointment booking flow

**Story 1.3.3:**
- Patients can cancel own appointments
- Doctors can cancel appointments they own
- Cancelled appointments update status to CANCELLED

**Story 1.4.1:**
- CI pipeline runs on every commit to main branch
- Build fails if tests fail or coverage drops below 70%
- Successful builds deploy to staging automatically

**Story 1.4.2:**
- JaCoCo report generated with every build
- Coverage threshold enforced in Maven configuration
- Missing tests identified and added for core services

### Definition of Done
- Code reviewed and approved by at least one peer
- Unit tests written with ≥70% branch coverage
- Integration tests pass for authentication and RBAC flows
- Security scan (OWASP Dependency-Check) passes with no high/critical vulnerabilities
- API documentation updated in README or Swagger
- Feature toggle enabled for demo

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| RBAC integration delays other features | High | High | Complete Story 1.1.1 in first 3 days; daily standups to unblock dependencies |
| Session timeout conflicts with user workflows | Medium | Medium | Implement token refresh endpoint; test with real user scenarios |
| Appointment conflict detection has edge cases | Medium | High | Write comprehensive unit tests for overlapping time slots; add buffer time |
| CI/CD pipeline configuration takes longer than estimated | Medium | Low | Use existing GitHub Actions templates; allocate buffer time in Sprint 2 if needed |
| Test coverage threshold blocks merges | Low | Medium | Run coverage reports daily; address gaps incrementally |

### Sprint Demo Deliverable
- **Live demo:** User registration, login, and logout with role-based access
- **Patient flow:** Log meal, water intake, and exercise; view logged metrics
- **Appointment flow:** Patient books appointment with doctor; doctor views booking
- **CI/CD:** Show automated build and test execution in GitHub Actions

### Stakeholders
- Product Owner
- Clinical stakeholders (1 physician, 1 dietitian)
- QA lead
- Security officer

---
## Sprint 2: Care Plans, Nutrition Management & Clinical Notes
**Sprint Summary:** Deliver dietitian meal plan editor, patient nutrition logs, physician clinical notes, and treatment progress tracking

### Goals
- Enable dietitians to create and assign personalized meal plans
- Build patient nutrition adherence tracking
- Implement physician clinical notes and treatment plan management
- Add symptom and energy level logging for patients
- Integrate RBAC checks into all new endpoints

### Backlog

#### Epic 2.1: Communication Hub - Messaging Foundation (Owner: it24101220)
**Story 2.1.1:** Build secure patient-clinician messaging (8 points)
- **Subtasks:**
  - Create Message entity and repository (it24101220, 2 pts)
  - Implement POST /api/messages/send with RBAC enforcement (it24101220, 3 pts)
  - Build React messaging UI with inbox and compose views (it24101220, 3 pts)

**Story 2.1.2:** Add message read/unread indicators (2 points)
- **Subtasks:**
  - Add isRead field to Message entity (it24101220, 1 pt)
  - Create PATCH /api/messages/{id}/read endpoint (it24101220, 1 pt)

#### Epic 2.2: Care Plan Coordination - Meal Plan Editor (Owner: it24103687)
**Story 2.2.1:** Create dietitian meal plan creation tool (8 points)
- **Subtasks:**
  - Design CarePlan entity with meal plan fields (it24103687, 2 pts)
  - Build POST /api/care-plans endpoint with dietitian role check (it24103687, 3 pts)
  - Create React form for meal plan entry (meals, portions, calories) (it24103687, 3 pts)

**Story 2.2.2:** Implement meal plan assignment to patients (3 points)
- **Subtasks:**
  - Add patientId foreign key to CarePlan (it24103687, 1 pt)
  - Create GET /api/care-plans/patient/{id} endpoint (it24103687, 1 pt)
  - Build patient view to display assigned meal plans (it24103687, 1 pt)

**Story 2.2.3:** Enable meal plan updates and versioning (3 points)
- **Subtasks:**
  - Add PUT /api/care-plans/{id} endpoint (it24103687, 1 pt)
  - Implement version tracking for plan changes (it24103687, 1 pt)
  - Add audit log for plan modifications (it24103687, 1 pt)

#### Epic 2.3: Health Metrics Dashboard - Nutrition Logs (Owner: it24103773)
**Story 2.3.1:** Build backend for patient nutrition logs (5 points)
- **Subtasks:**
  - Extend HealthMetric to include detailed nutrition fields (it24103773, 2 pts)
  - Add validation for calorie ranges and macronutrients (it24103773, 2 pts)
  - Write service layer tests for nutrition calculations (it24103773, 1 pt)

**Story 2.3.2:** Create nutrition adherence indicator (3 points)
- **Subtasks:**
  - Calculate adherence percentage (actual vs. plan) (it24103773, 2 pts)
  - Display adherence badge in patient dashboard (it24103773, 1 pt)

#### Epic 2.4: Health Metrics Dashboard - Physician Notes (Owner: it24103773)
**Story 2.4.1:** Implement physician clinical notes module (5 points)
- **Subtasks:**
  - Create ClinicalNote entity with physician-only access (it24103773, 2 pts)
  - Build POST /api/clinical-notes endpoint with @PreAuthorize (it24103773, 2 pts)
  - Create physician UI for note entry and viewing (it24103773, 1 pt)

**Story 2.4.2:** Add treatment progress tracking APIs (3 points)
- **Subtasks:**
  - Design TreatmentProgress entity with status enum (it24103773, 1 pt)
  - Implement CRUD endpoints for treatment plans (it24103773, 2 pts)

### Dependencies
- **Internal:** Epic 2.1 (messaging) depends on Sprint 1 RBAC completion
- **Internal:** Epic 2.2 (meal plans) requires CarePlan entity from backend
- **Cross-team:** Dietitian and physician features require coordination on shared patient data model

### Acceptance Criteria

**Story 2.1.1:**
- Patients can send messages to assigned doctors/dietitians
- Clinicians can reply to patient messages
- Messages encrypted in transit (HTTPS) and sanitized (HtmlSanitizer)

**Story 2.1.2:**
- Unread messages show badge count in inbox
- Clicking message marks as read
- Read status persists across sessions

**Story 2.2.1:**
- Dietitians create meal plans with breakfast, lunch, dinner, snacks
- Each meal includes food items, portions, and calorie targets
- Only users with DIETITIAN role can create plans

**Story 2.2.2:**
- Dietitians assign plans to specific patients
- Patients view assigned meal plans in dashboard
- Unassigned patients see prompt to request plan

**Story 2.2.3:**
- Dietitians update existing meal plans
- System tracks version history with timestamps
- Audit log records who modified plan and when

**Story 2.3.1:**
- Nutrition logs capture carbs, protein, fat, fiber
- Validation rejects negative values or unrealistic entries (>10,000 calories)
- Service layer calculates daily totals

**Story 2.3.2:**
- Adherence percentage = (actual calories / target calories) × 100
- Green badge for ≥90%, yellow for 70-89%, red for <70%
- Calculation runs daily at midnight

**Story 2.4.1:**
- Physicians add clinical notes to patient records
- Notes include diagnosis, observations, and recommendations
- Only physicians and admins can view clinical notes

**Story 2.4.2:**
- Treatment plans track status (Active, Completed, Discontinued)
- Physicians update progress with notes and status changes
- Patients see treatment plan status but not internal notes

### Definition of Done
- Code reviewed and approved by at least one peer
- Unit tests written with ≥70% branch coverage
- Integration tests pass for messaging and care plan flows
- Security scan passes with no high/critical vulnerabilities
- API documentation updated
- Feature toggle enabled for demo

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Meal plan data model too complex for MVP | Medium | Medium | Start with simple structure (3 meals/day); defer advanced features |
| Nutrition adherence calculation has edge cases | Medium | Low | Define clear rules for missing data; test with incomplete logs |
| Messaging system lacks real-time updates | High | Low | Use polling for MVP; document WebSocket upgrade for future sprint |
| Clinical notes expose sensitive data | Low | High | Enforce strict RBAC; add integration tests for unauthorized access attempts |
| Cross-team coordination delays (dietitian + physician features) | Medium | Medium | Daily sync between it24103687 and it24103773; shared data model review |

### Sprint Demo Deliverable
- **Dietitian flow:** Create meal plan, assign to patient, update plan
- **Patient flow:** View assigned meal plan, log nutrition, see adherence indicator
- **Physician flow:** Add clinical notes, create treatment plan, update progress
- **Messaging:** Patient sends message to doctor; doctor replies

### Stakeholders
- Product Owner
- Clinical stakeholders (1 physician, 1 dietitian)
- Patient representative
- QA lead

---
## Sprint 3: Dashboards, Reminders & Advanced Features
**Sprint Summary:** Build patient progress dashboards with charts, implement automated reminders, enable secure messaging, and add conflict detection for appointments

### Goals
- Visualize patient health trends with line/bar charts
- Implement automated appointment reminder system (email/SMS)
- Enable secure messaging between patients and physicians
- Add conflict detection and admin monitoring dashboard
- Conduct threat modeling and security audit

### Backlog

#### Epic 3.1: Health Metrics Dashboard - Progress Visualization (Owner: it24103773)
**Story 3.1.1:** Build patient progress dashboards with charts (8 points)
- **Subtasks:**
  - Implement GET /api/health-metrics/trends/daily and /weekly endpoints (it24103773, 3 pts)
  - Integrate Chart.js or Recharts for line/bar charts (it24103773, 3 pts)
  - Create dashboard UI showing weight, calories, exercise trends (it24103773, 2 pts)

**Story 3.1.2:** Add health score prediction algorithm (5 points)
- **Subtasks:**
  - Implement O(1) predictScore method in HealthScoreCalculator (it24103773, 2 pts)
  - Integrate prediction into dashboard with confidence indicator (it24103773, 2 pts)
  - Write unit tests for edge cases (it24103773, 1 pt)

#### Epic 3.2: Communication Hub - Secure Messaging (Owner: it24101220)
**Story 3.2.1:** Implement secure messaging between patient and physician (5 points)
- **Subtasks:**
  - Add end-to-end encryption for message content (it24101220, 3 pts)
  - Build message thread view with conversation history (it24101220, 2 pts)

**Story 3.2.2:** Enable staff group discussions (3 points)
- **Subtasks:**
  - Create GroupMessage entity for multi-user threads (it24101220, 1 pt)
  - Implement POST /api/messages/group endpoint (it24101220, 1 pt)
  - Build group chat UI for support staff (it24101220, 1 pt)

#### Epic 3.3: Appointment Management - Reminders (Owner: it24103747)
**Story 3.3.1:** Build automated reminders system (email/SMS) (8 points)
- **Subtasks:**
  - Integrate email service (SendGrid or AWS SES) (it24103747, 3 pts)
  - Create scheduled job to send reminders 24h before appointment (it24103747, 3 pts)
  - Add SMS integration via Twilio (it24103747, 2 pts)

**Story 3.3.2:** Add in-app notification reminders (2 points)
- **Subtasks:**
  - Create Notification entity and repository (it24103747, 1 pt)
  - Build notification bell icon with unread count (it24103747, 1 pt)

#### Epic 3.4: Appointment Management - Conflict Detection (Owner: it24103747)
**Story 3.4.1:** Implement conflict detection and admin monitoring dashboard (5 points)
- **Subtasks:**
  - Enhance hasConflict method to check overlapping time slots (it24103747, 2 pts)
  - Build admin dashboard showing all appointments with conflict warnings (it24103747, 2 pts)
  - Add conflict resolution UI for admins (it24103747, 1 pt)

#### Epic 3.5: Security & Compliance (Owners: it24103733, it24103635)
**Story 3.5.1:** Conduct threat modeling workshop (3 points)
- **Subtasks:**
  - Identify attack vectors for authentication, data access, messaging (it24103733, 2 pts)
  - Document mitigation strategies in security.md (it24103733, 1 pt)

**Story 3.5.2:** Run static analysis and dependency scanning (2 points)
- **Subtasks:**
  - Configure OWASP Dependency-Check in CI pipeline (it24103635, 1 pt)
  - Fix high/critical vulnerabilities identified (it24103635, 1 pt)

### Dependencies
- **Internal:** Epic 3.1 requires HealthMetric data from Sprint 1-2
- **External:** Epic 3.3 depends on third-party email/SMS service setup (SendGrid, Twilio)
- **Cross-team:** Epic 3.4 requires coordination between it24103747 (appointments) and it24103635 (admin tools)

### Acceptance Criteria

**Story 3.1.1:**
- Dashboard displays line charts for weight, calories, exercise over 7/30 days
- Charts update dynamically when new metrics logged
- Trends calculated using O(n) aggregation algorithm

**Story 3.1.2:**
- Health score prediction uses weighted formula (calories, exercise, sleep)
- Prediction accuracy ≥80% based on historical data
- Confidence indicator shows Low/Medium/High based on data completeness

**Story 3.2.1:**
- Messages encrypted using AES-256 before storage
- Only sender and recipient can decrypt messages
- Encryption keys managed securely (not in code)

**Story 3.2.2:**
- Support staff create group threads with multiple participants
- All group members see messages in real-time (polling every 5s)
- Group threads isolated from patient-clinician messages

**Story 3.3.1:**
- Email reminders sent 24 hours before appointment
- SMS reminders sent 2 hours before appointment
- Reminders include appointment time, doctor name, and cancellation link

**Story 3.3.2:**
- Notification bell shows unread count
- Clicking notification navigates to appointment details
- Notifications marked as read after viewing

**Story 3.4.1:**
- System prevents double-booking same doctor at same time
- Admin dashboard highlights conflicting appointments in red
- Admins can reassign or cancel conflicting appointments

**Story 3.5.1:**
- Threat model covers authentication, authorization, data storage, messaging
- Each threat has severity rating and mitigation plan
- Document reviewed by security officer

**Story 3.5.2:**
- CI pipeline fails build if high/critical vulnerabilities detected
- Dependency-Check report generated with every build
- All identified vulnerabilities resolved or documented as accepted risk

### Definition of Done
- Code reviewed and approved by at least one peer
- Unit tests written with ≥70% branch coverage
- Integration tests pass for dashboards, messaging, and reminders
- Security scan passes with no high/critical vulnerabilities
- API documentation updated
- Feature toggle enabled for demo

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Third-party email/SMS service integration delays | High | Medium | Set up accounts in Sprint 2; use mock service for testing |
| Chart rendering performance issues with large datasets | Medium | Medium | Implement pagination; limit chart data to 90 days |
| Message encryption adds complexity and bugs | Medium | High | Use battle-tested library (Jasypt); allocate extra testing time |
| Threat modeling identifies critical gaps late | Low | High | Conduct workshop in first 3 days of sprint; prioritize fixes |
| Reminder system sends duplicate notifications | Medium | Low | Add idempotency checks; test with scheduled job in staging |

### Sprint Demo Deliverable
- **Patient dashboard:** View health trends with line charts; see predicted health score
- **Messaging:** Patient sends encrypted message to doctor; staff group chat demo
- **Reminders:** Show email/SMS reminder sent 24h before appointment
- **Admin tools:** Conflict detection dashboard with resolution workflow
- **Security:** Present threat model and dependency scan results

### Stakeholders
- Product Owner
- Clinical stakeholders (1 physician, 1 dietitian)
- Patient representative
- QA lead
- Security officer
- Compliance officer

---
## Sprint 4: Stabilization, Admin Tools & Production Readiness
**Sprint Summary:** Deliver support staff communication interface, account lockout handling, super admin tools, system configuration, audit reporting, and comprehensive testing

### Goals
- Build support staff communication interface for ticket management
- Implement account lockout after 3 failed login attempts
- Create super admin role permissions and database backup scheduler
- Develop system configuration and audit reporting tools
- Conduct end-to-end testing, performance optimization, and production deployment preparation

### Backlog

#### Epic 4.1: Communication Hub - Support Staff Interface (Owner: it24101220)
**Story 4.1.1:** Build support staff communication interface (5 points)
- **Subtasks:**
  - Create SupportTicket entity with status workflow (it24101220, 2 pts)
  - Implement POST /api/support-tickets and PATCH /api/support-tickets/{id}/accept (it24101220, 2 pts)
  - Build support staff UI for ticket queue and chat (it24101220, 1 pt)

**Story 4.1.2:** Add priority tagging for urgent communications (2 points)
- **Subtasks:**
  - Add priority field (Low, Medium, High, Urgent) to SupportTicket (it24101220, 1 pt)
  - Sort ticket queue by priority and timestamp (it24101220, 1 pt)

#### Epic 4.2: RBAC - Account Lockout (Owner: it24103733)
**Story 4.2.1:** Implement account lockout handling module (5 points)
- **Subtasks:**
  - Add failedLoginAttempts and lockedUntil fields to User entity (it24103733, 1 pt)
  - Implement lockout logic in AuthController (3 failed attempts = 15 min lock) (it24103733, 2 pts)
  - Build admin UI to unlock accounts manually (it24103733, 2 pts)

#### Epic 4.3: RBAC - Super Admin Tools (Owner: it24103733)
**Story 4.3.1:** Create super admin role permissions and database backup scheduler (3 points)
- **Subtasks:**
  - Add SUPER_ADMIN role with full system access (it24103733, 1 pt)
  - Implement scheduled job for daily database backups (it24103733, 1 pt)
  - Create admin endpoint to trigger manual backup (it24103733, 1 pt)

#### Epic 4.4: Compliance Documentation - Audit Reporting (Owner: it24103635)
**Story 4.4.1:** Build system configuration and audit reporting tools (8 points)
- **Subtasks:**
  - Implement GET /api/compliance/access-logs with date range filters (it24103635, 3 pts)
  - Create CSV export functionality for audit logs (it24103635, 2 pts)
  - Build admin dashboard for usage statistics and reports (it24103635, 3 pts)

**Story 4.4.2:** Add anonymized data export for research (3 points)
- **Subtasks:**
  - Implement data anonymization utility (remove PII) (it24103635, 2 pts)
  - Create GET /api/compliance/export/anonymized endpoint (it24103635, 1 pt)

#### Epic 4.5: Testing & Stabilization (All developers)
**Story 4.5.1:** Conduct end-to-end integration testing (8 points)
- **Subtasks:**
  - Write E2E tests for patient journey (register → log metrics → book appointment) (it24103773, 3 pts)
  - Write E2E tests for clinician workflows (meal plan creation, clinical notes) (it24103687, 2 pts)
  - Write E2E tests for admin workflows (user management, audit logs) (it24103635, 3 pts)

**Story 4.5.2:** Performance optimization and load testing (5 points)
- **Subtasks:**
  - Run load tests with 50 concurrent users (it24103773, 2 pts)
  - Optimize slow queries identified in profiling (it24103773, 2 pts)
  - Add database indexes for frequently queried fields (it24103773, 1 pt)

**Story 4.5.3:** Bug fixes and polish (5 points)
- **Subtasks:**
  - Fix critical bugs from QA testing (All developers, 3 pts)
  - Improve error messages and validation feedback (All developers, 2 pts)

#### Epic 4.6: Documentation & Deployment (Owner: it24103635)
**Story 4.6.1:** Finalize user documentation and deployment guide (3 points)
- **Subtasks:**
  - Write user manual for each role (patient, clinician, admin) (it24103635, 2 pts)
  - Document deployment steps and environment configuration (it24103635, 1 pt)

**Story 4.6.2:** Set up production environment (3 points)
- **Subtasks:**
  - Configure production MySQL database with backups (it24103635, 1 pt)
  - Deploy application to production server (AWS/Azure) (it24103635, 1 pt)
  - Set up monitoring and alerting (CloudWatch, Datadog) (it24103635, 1 pt)

### Dependencies
- **Internal:** Epic 4.5 (testing) depends on all features from Sprints 1-3
- **Internal:** Epic 4.6 (deployment) depends on Epic 4.5 (testing) completion
- **External:** Production deployment requires infrastructure provisioning (AWS/Azure accounts)

### Acceptance Criteria

**Story 4.1.1:**
- Patients create support tickets with subject and description
- Support staff see ticket queue sorted by creation time
- Staff accept tickets (status changes to ASSIGNED) and chat with patient

**Story 4.1.2:**
- Tickets tagged with priority level (default: Medium)
- Urgent tickets appear at top of queue
- Priority visible in ticket list and detail views

**Story 4.2.1:**
- Account locks after 3 consecutive failed login attempts
- Locked accounts unlock automatically after 15 minutes
- Admins can unlock accounts manually via admin panel

**Story 4.3.1:**
- SUPER_ADMIN role has access to all endpoints
- Database backup runs daily at 2 AM (configurable)
- Backups stored securely with 30-day retention

**Story 4.4.1:**
- Admins filter access logs by date range, user, and action
- CSV export includes userId, action, resource, timestamp, IP address
- Dashboard shows daily active users, appointment count, message count

**Story 4.4.2:**
- Anonymized export removes name, email, and other PII
- Export includes aggregated health metrics and demographics
- Only SYSTEM_ADMIN and SUPER_ADMIN can access anonymized data

**Story 4.5.1:**
- E2E tests cover happy paths for all user roles
- Tests run in CI pipeline against staging environment
- All E2E tests pass before production deployment

**Story 4.5.2:**
- System handles 50 concurrent users with <2s response time
- Database queries optimized to <100ms for 95th percentile
- Indexes added for userId, date, and status fields

**Story 4.5.3:**
- Zero critical bugs remaining
- All error messages user-friendly and actionable
- Validation feedback appears inline on forms

**Story 4.6.1:**
- User manual covers all features with screenshots
- Deployment guide includes step-by-step instructions
- Documentation hosted on internal wiki or README

**Story 4.6.2:**
- Production database configured with automated backups
- Application deployed with HTTPS and SSL certificate
- Monitoring alerts configured for errors and downtime

### Definition of Done
- Code reviewed and approved by at least one peer
- Unit tests written with ≥70% branch coverage
- Integration tests pass for all features
- E2E tests pass for critical user journeys
- Security scan passes with no high/critical vulnerabilities
- Performance benchmarks met (50 users, <2s response time)
- API documentation complete
- User documentation complete
- Production deployment successful
- Stakeholder demo approved

### Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| E2E tests uncover critical bugs late in sprint | High | High | Start testing in first 3 days; allocate 5 pts for bug fixes |
| Performance issues under load | Medium | High | Run load tests early; optimize queries proactively |
| Production deployment fails due to configuration issues | Medium | High | Deploy to staging first; use infrastructure-as-code (Terraform) |
| Documentation incomplete by sprint end | Medium | Low | Assign dedicated owner (it24103635); start writing in Sprint 3 |
| Stakeholders request scope changes during demo | Low | Medium | Emphasize MVP scope; document requests for post-launch backlog |

### Sprint Demo Deliverable
- **Support staff flow:** Create ticket, accept ticket, chat with patient
- **Admin tools:** View audit logs, export CSV, unlock locked account
- **Super admin:** Trigger database backup, view system configuration
- **Performance:** Show load test results (50 users, <2s response time)
- **Production:** Live demo on production environment with HTTPS

### Stakeholders
- Product Owner
- Clinical stakeholders (1 physician, 1 dietitian, 1 support staff)
- Patient representative
- QA lead
- Security officer
- Compliance officer
- Executive sponsor

---

## Overall Timeline Summary

| Sprint | Dates | Primary Objectives | Main Deliverable |
|--------|-------|-------------------|------------------|
| Sprint 1 | Week 1-2 | RBAC foundation, authentication, patient health logging, appointment scheduling | Login/logout, meal/exercise logging, appointment booking |
| Sprint 2 | Week 3-4 | Meal plan editor, nutrition logs, physician notes, messaging foundation | Dietitian meal plans, patient adherence tracking, clinical notes |
| Sprint 3 | Week 5-6 | Progress dashboards, automated reminders, secure messaging, conflict detection | Health trend charts, email/SMS reminders, encrypted messaging |
| Sprint 4 | Week 7-8 | Support staff interface, admin tools, audit reporting, testing, production deployment | Support ticket system, audit logs, E2E tests, production launch |

---

## Sprint Summary

### Completed Objectives Across Sprints

**Sprint 1:**
- ✅ JWT-based authentication with role enforcement (6 roles)
- ✅ 30-minute inactivity timeout with session management
- ✅ Patient health logging (meals, water, exercise)
- ✅ Appointment scheduling with conflict detection
- ✅ CI/CD pipeline with automated testing

**Sprint 2:**
- ✅ Dietitian meal plan creation and assignment
- ✅ Patient nutrition adherence tracking
- ✅ Physician clinical notes and treatment plans
- ✅ Secure patient-clinician messaging
- ✅ Meal plan versioning and audit logging

**Sprint 3:**
- ✅ Patient progress dashboards with line/bar charts
- ✅ Health score prediction algorithm (O(1) complexity)
- ✅ Automated appointment reminders (email/SMS)
- ✅ Secure messaging with encryption
- ✅ Conflict detection and admin monitoring dashboard
- ✅ Threat modeling and security audit

**Sprint 4:**
- ✅ Support staff ticket management interface
- ✅ Account lockout after 3 failed login attempts
- ✅ Super admin tools and database backup scheduler
- ✅ Audit reporting and CSV export
- ✅ End-to-end integration testing
- ✅ Performance optimization (50 concurrent users)
- ✅ Production deployment with monitoring

### Assumed Team Velocity

- **Sprint 1:** 40 story points (RBAC: 16, Health Metrics: 10, Appointments: 10, CI/CD: 8)
- **Sprint 2:** 40 story points (Messaging: 10, Care Plans: 14, Nutrition: 8, Clinical Notes: 8)
- **Sprint 3:** 38 story points (Dashboards: 13, Messaging: 8, Reminders: 10, Security: 5, Conflict Detection: 5)
- **Sprint 4:** 42 story points (Support: 7, Lockout: 5, Admin: 3, Compliance: 11, Testing: 18, Deployment: 6)
- **Total:** 160 story points over 8 weeks
- **Average velocity:** 40 points/sprint, ~6.7 points/developer/sprint

### Carryover Items

**Deferred to Post-Launch Backlog:**
- Multilingual support (English-only in MVP)
- Wearable device integration (manual entry only)
- Predictive analytics and AI diagnostics (rule-based logic only)
- Offline functionality (internet-required)
- Real-time WebSocket messaging (polling-based in MVP)
- Advanced reporting (TXT export, custom report builder)
- Mobile native apps (responsive web only)

**Technical Debt:**
- Refactor HealthScoreCalculator for extensibility
- Optimize N+1 queries in appointment and message endpoints
- Add comprehensive logging for debugging production issues
- Implement rate limiting for API endpoints
- Add feature flags for gradual rollout

### Recommended Next Steps (Post-Sprint 4)

1. **User Acceptance Testing (Week 9):** Conduct UAT with real patients, clinicians, and staff; gather feedback
2. **Production Monitoring (Week 9-10):** Monitor error rates, performance metrics, and user adoption; fix critical issues
3. **Iteration Planning (Week 10):** Prioritize carryover items and new feature requests based on user feedback
4. **Security Audit (Week 11):** Engage third-party security firm for penetration testing and compliance review
5. **Scale Testing (Week 12):** Test system with 100+ concurrent users; optimize infrastructure as needed
6. **Feature Enhancements (Week 13+):** Implement WebSocket messaging, wearable integration, and multilingual support based on priority

---

**End of Sprint Plan**

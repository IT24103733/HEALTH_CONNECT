# Health Connect - Product Overview

## Purpose
Health Connect is a secure, role-based web platform for coordinated health management. It centralizes health tracking, care plan management, appointment scheduling, and secure communication between patients and healthcare providers.

## Value Proposition
- **For Patients**: Track nutrition, exercise, symptoms, and follow personalized care plans with visual progress monitoring
- **For Healthcare Providers**: Monitor patient health remotely, create collaborative treatment protocols, and maintain coordinated care delivery
- **For Administrators**: Ensure compliance, generate audit reports, and manage system operations with role-based governance

## Key Features

### 1. Role-Based Access Control
- Six distinct user roles: PATIENT, DIETITIAN, DOCTOR, SUPPORT_STAFF, SYSTEM_ADMIN, SUPER_ADMIN
- Tiered permissions with data segregation
- JWT-based authentication with 30-minute session timeout
- Single-session enforcement and automatic logout

### 2. Health Metrics Tracking
- Daily logging: meals, water intake, exercise, symptoms, energy levels
- Automated health score calculation (0-100) based on optimal ranges
- Visual progress charts and trend analysis
- Weekly trend aggregation with averages
- Date range filtering for historical data

### 3. Care Plan Management
- Dietitian-created meal plans and physician treatment protocols
- Real-time adherence tracking with percentage indicators
- Collaborative care coordination between clinicians
- Plan types: MEAL_PLAN and TREATMENT_PLAN

### 4. Appointment Scheduling
- Calendar-based booking interface
- Real-time conflict detection for time slots
- Role-specific views (patients book, doctors manage)
- Status tracking (SCHEDULED, DONE, CANCELLED)
- Appointment notes and clinician assignment

### 5. Diet Plan Request System
- Patient-initiated requests (max 3 open per patient)
- Queue-based assignment to dietitians
- Request lifecycle management (PENDING, ACCEPTED, COMPLETED, CANCELLED)
- Includes age, weight, height, dietary restrictions, health goals, activity level

### 6. Support Ticket System
- Patient issue reporting with subject and description
- Queue-based assignment to support staff
- Integrated chat for ticket resolution
- Status tracking (OPEN, IN_PROGRESS, RESOLVED)
- Access control for ticket-specific messaging

### 7. Secure Messaging
- Private user-to-user communication
- Inbox/sent message management
- Read/unread status tracking
- HTML sanitization for XSS prevention
- Ticket-based chat for support resolution

### 8. Compliance & Auditing
- Access log repository for all user actions
- Date-range filtered audit reports
- CSV export for regulatory compliance
- User-specific activity tracking
- IP address logging

## Role-Based Capabilities

### PATIENT
**Can Access:**
- Health Metrics: Log and view own metrics, view trends
- Care Plans: View assigned meal plans and treatment protocols
- Appointments: View doctors/dietitians list, book appointments, cancel own appointments, view own appointments
- Diet Requests: Create requests (max 3 open), update own requests, delete own requests, view own requests
- Support Tickets: Create tickets, view own tickets, chat on assigned tickets
- Messages: Send/receive messages, view inbox/sent, mark as read

**Cannot Access:**
- User management
- Compliance reports
- Other patients' data
- Queue management

### DIETITIAN
**Can Access:**
- Health Metrics: Log and view metrics (authenticated access)
- Care Plans: Create meal plans, update plans, view patient/creator plans
- Appointments: Book appointments, update appointment status, view own appointments
- Diet Requests: View pending queue, accept requests, view assigned requests
- Messages: Send/receive messages, view inbox/sent

**Cannot Access:**
- User management
- Compliance reports
- Support ticket queue
- Treatment plan creation (doctor-only)

### DOCTOR
**Can Access:**
- Health Metrics: Log and view metrics (authenticated access)
- Care Plans: Create treatment plans, update plans, view patient/creator plans
- Appointments: Update appointment status, view own appointments
- Messages: Send/receive messages, view inbox/sent

**Cannot Access:**
- User management
- Compliance reports
- Diet request queue
- Support ticket queue
- Meal plan creation (dietitian-only)

### SUPPORT_STAFF
**Can Access:**
- Support Tickets: View open queue, accept tickets, resolve tickets, view assigned tickets, chat on assigned tickets
- Messages: Send/receive messages, view inbox/sent

**Cannot Access:**
- Health metrics
- Care plans
- Appointments
- Diet requests
- User management
- Compliance reports

### SYSTEM_ADMIN
**Can Access:**
- User Management: View all users (paginated), view user by ID, update users, delete users
- Compliance: View access logs (all or date-filtered), view user-specific logs, export logs to CSV
- Messages: Send/receive messages, view inbox/sent

**Cannot Access:**
- Health metrics (no authenticated access)
- Care plans (no role permission)
- Appointments (no role permission)
- Diet requests (no role permission)
- Support tickets (no role permission)

### SUPER_ADMIN
**Can Access:**
- User Management: View all users (paginated), view user by ID, update users, delete users
- Compliance: View access logs (all or date-filtered), view user-specific logs, export logs to CSV
- Messages: Send/receive messages, view inbox/sent

**Cannot Access:**
- Health metrics (no authenticated access)
- Care plans (no role permission)
- Appointments (no role permission)
- Diet requests (no role permission)
- Support tickets (no role permission)

## Target Users

### Primary Users
- **Patients**: Individuals managing personal health, logging daily metrics, following care plans
- **Dietitians**: Nutrition specialists creating meal plans and monitoring adherence
- **Physicians**: Healthcare providers managing treatment protocols and medical records

### Secondary Users
- **Support Staff**: Operational personnel handling patient support tickets (no medical access)
- **System Administrators**: Technical maintainers managing users, roles, and compliance
- **Super Administrators**: Highest-tier roles for core system configuration and oversight

## Use Cases

### Patient Journey
1. Register and log in with secure credentials
2. Log daily health metrics (nutrition, exercise, symptoms)
3. View personalized care plans from dietitian/physician
4. Track progress through visual dashboards and weekly trends
5. Book appointments with doctors or dietitians
6. Request diet plan consultations (up to 3 open requests)
7. Create support tickets for assistance
8. Communicate securely with care team via messages
9. Chat with assigned support staff on tickets

### Clinician Workflow (Dietitian/Doctor)
1. Access assigned patient health records
2. Review logged metrics and trends
3. Create/update care plans (meal plans for dietitians, treatment plans for doctors)
4. Monitor patient adherence percentages
5. Manage appointment schedules and update status
6. Accept diet plan requests (dietitians only)
7. Communicate with patients via secure messaging

### Support Staff Workflow
1. View open support ticket queue
2. Accept tickets from queue
3. Chat with patients on assigned tickets
4. Resolve tickets when issues are addressed
5. View all assigned tickets

### Administrative Operations
1. Manage user accounts and role assignments
2. Generate compliance reports with date filters
3. Export audit logs to CSV for regulatory review
4. Monitor system usage and user activity
5. View user-specific access logs

## System Constraints
- Internet connection required (no offline mode)
- Manual data entry only (no wearable device integration)
- English-only interface
- Rule-based automation (no AI/predictive analytics)
- No real-time emergency support features
- Maximum 3 open diet plan requests per patient
- Appointment conflict detection prevents double-booking

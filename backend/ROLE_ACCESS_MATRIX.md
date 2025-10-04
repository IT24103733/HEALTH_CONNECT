# Role-Based Access Control Matrix

## Quick Reference Guide

| Feature | Patient | Dietitian | Physician | Support Staff | System Admin | Super Admin |
|---------|---------|-----------|-----------|---------------|--------------|-------------|
| **Authentication** |
| Register/Login | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **User Management** |
| View all users | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Create/Update/Delete users | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Appointments** |
| View doctors list | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Book appointment | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cancel own appointment | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View own appointments | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Mark appointment Done/Cancelled | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Diet Plan Requests** |
| Create request (max 3) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update own request | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delete own request | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View request queue | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Accept request from queue | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View assigned requests | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Support Tickets** |
| Create ticket | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View ticket queue | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Accept ticket from queue | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Resolve assigned ticket | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Chat on own ticket | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Chat on assigned ticket | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Health Metrics** |
| Log own metrics | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View own metrics | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Care Plans** |
| View own care plans | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create care plan | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Update care plan | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Messages** |
| Send/receive messages | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Compliance** |
| View access logs | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Export logs to CSV | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

## Role Descriptions

### Patient
- Manage personal health data
- Book and cancel appointments with doctors
- Submit diet plan requests (max 3 open)
- Create support tickets
- Chat with assigned support staff
- View own care plans

### Dietitian
- View shared queue of diet plan requests
- Accept and work on diet requests
- Create meal plans for patients
- View assigned patients' nutritional data

### Physician (Doctor)
- View own appointment schedule
- Mark appointments as Done or Cancelled
- Create treatment protocols
- View assigned patients' medical data
- Document clinical observations

### Support Staff
- View shared queue of open support tickets
- Accept and resolve tickets
- Chat with patients on assigned tickets
- Manage appointment scheduling conflicts

### System Admin
- User provisioning and management
- Role assignment
- View access logs
- Export compliance reports
- System configuration

### Super Admin
- All System Admin privileges
- Database operations
- Emergency protocols
- Core system configuration

## Security Enforcement Layers

1. **Spring Security** - Endpoint-level role restrictions
2. **Controller Layer** - Authentication object validation
3. **Service Layer** - Ownership and role checks
4. **Database Layer** - Foreign key constraints

## Example Access Scenarios

### ✅ Allowed
- Patient books appointment with Doctor Smith
- Dietitian accepts diet request from shared queue
- Support Staff chats with patient on assigned ticket
- System Admin exports access logs to CSV

### ❌ Denied
- Patient tries to view another patient's appointments
- Dietitian tries to accept already-assigned request
- Support Staff tries to chat on unassigned ticket
- Patient tries to access compliance logs
- Doctor tries to cancel another doctor's appointment

## API Response Codes

- `200 OK` - Successful operation
- `401 Unauthorized` - Not authenticated (no/invalid JWT)
- `403 Forbidden` - Authenticated but wrong role
- `404 Not Found` - Resource doesn't exist
- `500 Internal Server Error` - Ownership validation failed or other error

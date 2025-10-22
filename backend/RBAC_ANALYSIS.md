# Role-Based Access Control (RBAC) Analysis

## Summary: ✅ RBAC is correctly implemented with minor issues

---

## Role Definitions
- **PATIENT** - End users tracking health
- **DOCTOR** - Physicians creating treatment plans
- **DIETITIAN** - Nutritionists creating meal plans
- **SUPPORT_STAFF** - Support personnel handling tickets
- **SYSTEM_ADMIN** - System administrators
- **SUPER_ADMIN** - Highest privilege administrators

---

## Controller-by-Controller Analysis

### 1. AuthController ✅ CORRECT
| Endpoint | Roles | Status |
|----------|-------|--------|
| POST /api/auth/login | Public | ✅ Correct |
| POST /api/auth/register | Public | ✅ Correct |
| POST /api/auth/refresh | Authenticated | ✅ Correct |
| GET /api/auth/validate | Public (header check) | ✅ Correct |

**Notes**: No @PreAuthorize needed - authentication endpoints are public by design.

---

### 2. UserController ✅ CORRECT
| Endpoint | Roles | Status |
|----------|-------|--------|
| GET /api/users | SYSTEM_ADMIN, SUPER_ADMIN | ✅ Correct |
| GET /api/users/{id} | SYSTEM_ADMIN, SUPER_ADMIN | ✅ Correct |
| PUT /api/users/{id} | SYSTEM_ADMIN, SUPER_ADMIN | ✅ Correct |
| DELETE /api/users/{id} | SYSTEM_ADMIN, SUPER_ADMIN | ✅ Correct |

**Notes**: Admin-only access is correctly enforced.

---

### 3. HealthMetricController ⚠️ ISSUE FOUND
| Endpoint | Current Roles | Expected Roles | Status |
|----------|--------------|----------------|--------|
| POST /api/health-metrics | isAuthenticated() | PATIENT only | ⚠️ **TOO PERMISSIVE** |
| GET /api/health-metrics/user/{userId} | isAuthenticated() + manual check | PATIENT, DOCTOR, DIETITIAN | ✅ Correct (manual check) |
| GET /api/health-metrics/user/{userId}/range | isAuthenticated() + manual check | PATIENT, DOCTOR, DIETITIAN | ✅ Correct (manual check) |
| GET /api/health-metrics/user/{userId}/trends/weekly | isAuthenticated() + manual check | PATIENT, DOCTOR, DIETITIAN | ✅ Correct (manual check) |

**ISSUE**: 
- `POST /api/health-metrics` uses `@PreAuthorize("isAuthenticated()")` 
- This allows SYSTEM_ADMIN, SUPER_ADMIN, SUPPORT_STAFF to log health metrics
- **Should be**: `@PreAuthorize("hasRole('PATIENT')")`
- Manual validation exists (`if (!currentUser.getId().equals(request.getUserId()))`) but role check is missing

**Recommendation**: Change to `@PreAuthorize("hasRole('PATIENT')")` for clarity and security.

---

### 4. CarePlanController ✅ CORRECT
| Endpoint | Roles | Status |
|----------|-------|--------|
| POST /api/care-plans | DIETITIAN, DOCTOR | ✅ Correct |
| PUT /api/care-plans/{id} | DIETITIAN, DOCTOR | ✅ Correct |
| PUT /api/care-plans/{id}/adherence | DIETITIAN, DOCTOR, PATIENT | ✅ Correct |
| GET /api/care-plans/patient/{patientId} | PATIENT, DOCTOR, DIETITIAN | ✅ Correct |
| GET /api/care-plans/creator/{creatorId} | DOCTOR, DIETITIAN | ✅ Correct |

**Notes**: 
- Proper role segregation (DIETITIAN → MEAL_PLAN, DOCTOR → TREATMENT_PLAN)
- Manual ownership checks in place

---

### 5. AppointmentController ✅ CORRECT
| Endpoint | Roles | Status |
|----------|-------|--------|
| GET /api/appointments/doctors | PATIENT | ✅ Correct |
| POST /api/appointments | PATIENT | ✅ Correct |
| DELETE /api/appointments/{id} | PATIENT | ✅ Correct |
| PUT /api/appointments/{id}/status | DOCTOR, DIETITIAN | ✅ Correct |
| GET /api/appointments/my-appointments | PATIENT, DOCTOR, DIETITIAN | ✅ Correct |
| GET /api/appointments/check-conflict | PATIENT | ✅ Correct |

**Notes**: Clear separation between patient booking and clinician management.

---

### 6. DietPlanRequestController ✅ CORRECT
| Endpoint | Roles | Status |
|----------|-------|--------|
| POST /api/diet-requests | PATIENT | ✅ Correct |
| PUT /api/diet-requests/{id} | PATIENT | ✅ Correct |
| DELETE /api/diet-requests/{id} | PATIENT | ✅ Correct |
| POST /api/diet-requests/{id}/accept | DIETITIAN | ✅ Correct |
| GET /api/diet-requests/queue | DIETITIAN | ✅ Correct |
| GET /api/diet-requests/my-requests | PATIENT, DIETITIAN | ✅ Correct |

**Notes**: Proper queue-based workflow between patients and dietitians.

---

### 7. SupportTicketController ✅ CORRECT
| Endpoint | Roles | Status |
|----------|-------|--------|
| POST /api/support-tickets | PATIENT, DOCTOR, DIETITIAN | ✅ Correct |
| POST /api/support-tickets/{id}/accept | SUPPORT_STAFF | ✅ Correct |
| PUT /api/support-tickets/{id}/resolve | SUPPORT_STAFF | ✅ Correct |
| GET /api/support-tickets/queue | SUPPORT_STAFF | ✅ Correct |
| GET /api/support-tickets/my-tickets | PATIENT, DOCTOR, DIETITIAN, SUPPORT_STAFF | ✅ Correct |
| GET /api/support-tickets/{id}/chat-access | PATIENT, DOCTOR, DIETITIAN, SUPPORT_STAFF | ✅ Correct |

**Notes**: 
- Correctly allows PATIENT, DOCTOR, DIETITIAN to create tickets
- SUPPORT_STAFF can only accept/resolve, not create

---

### 8. MessageController ✅ CORRECT
| Endpoint | Roles | Status |
|----------|-------|--------|
| POST /api/messages/ticket/{ticketId} | PATIENT, DOCTOR, DIETITIAN, SUPPORT_STAFF | ✅ Correct |
| GET /api/messages/ticket/{ticketId} | PATIENT, DOCTOR, DIETITIAN, SUPPORT_STAFF | ✅ Correct |

**Notes**: 
- Ticket-based messaging only
- Access control enforced via ticket ownership check

---

### 9. ComplianceController ✅ CORRECT
| Endpoint | Roles | Status |
|----------|-------|--------|
| GET /api/compliance/logs | SYSTEM_ADMIN, SUPER_ADMIN | ✅ Correct |
| GET /api/compliance/logs/user/{userId} | SYSTEM_ADMIN, SUPER_ADMIN | ✅ Correct |
| GET /api/compliance/export/csv | SYSTEM_ADMIN, SUPER_ADMIN | ✅ Correct |

**Notes**: Admin-only access for compliance data.

---

## Issues Summary

### ⚠️ Issue 1: HealthMetricController - POST endpoint too permissive

**Location**: `HealthMetricController.logMetric()`

**Current**:
```java
@PostMapping
@PreAuthorize("isAuthenticated()")
public ResponseEntity<HealthMetricDTO> logMetric(...)
```

**Problem**: 
- Any authenticated user can attempt to log health metrics
- SYSTEM_ADMIN, SUPER_ADMIN, SUPPORT_STAFF shouldn't log health metrics
- Manual check exists but role-based check is clearer

**Recommendation**:
```java
@PostMapping
@PreAuthorize("hasRole('PATIENT')")
public ResponseEntity<HealthMetricDTO> logMetric(...)
```

**Impact**: Low (manual validation prevents abuse, but role check is best practice)

---

## Security Patterns Used

### ✅ Declarative Security (@PreAuthorize)
- Used consistently across all controllers
- Clear and maintainable
- Enforced at method level

### ✅ Manual Ownership Checks
- Used where needed (e.g., "can only access own data")
- Prevents horizontal privilege escalation
- Examples:
  - `if (!currentUser.getId().equals(userId))`
  - `if (!currentUser.getId().equals(patientId))`

### ✅ Role-Specific Business Logic
- DIETITIAN can only create MEAL_PLAN
- DOCTOR can only create TREATMENT_PLAN
- Enforced in service layer

### ✅ Ticket-Based Access Control
- Messages require ticket ownership
- Support tickets link creator and assigned staff
- Access verified before allowing chat

---

## Role Capability Matrix

| Feature | PATIENT | DOCTOR | DIETITIAN | SUPPORT_STAFF | SYSTEM_ADMIN | SUPER_ADMIN |
|---------|---------|--------|-----------|---------------|--------------|-------------|
| **Authentication** |
| Login/Register | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Health Metrics** |
| Log metrics | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View own metrics | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View patient metrics | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Care Plans** |
| View own plans | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create meal plans | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Create treatment plans | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update adherence | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Appointments** |
| Book appointments | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cancel appointments | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update status | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| View own appointments | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Diet Requests** |
| Create requests | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Accept requests | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| View queue | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Support Tickets** |
| Create tickets | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Accept tickets | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Resolve tickets | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| View queue | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Messages** |
| Send ticket messages | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| View ticket chat | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **User Management** |
| View all users | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Update users | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Delete users | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Compliance** |
| View access logs | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Export logs | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

---

## Recommendations

### Priority 1: Fix HealthMetricController
Change `@PreAuthorize("isAuthenticated()")` to `@PreAuthorize("hasRole('PATIENT')")` on POST endpoint.

### Priority 2: Consider Adding
- Rate limiting for public endpoints (login, register)
- IP-based access restrictions for admin endpoints
- Audit logging for sensitive operations

### Priority 3: Documentation
- Document role hierarchy in README
- Add API documentation with role requirements
- Create role-based testing scenarios

---

## Conclusion

**Overall Status**: ✅ **RBAC is well-implemented**

- 8 out of 9 controllers have correct RBAC
- 1 minor issue in HealthMetricController (low impact)
- Consistent use of @PreAuthorize annotations
- Proper manual ownership checks where needed
- Clear separation of concerns between roles

**Security Score**: 9.5/10

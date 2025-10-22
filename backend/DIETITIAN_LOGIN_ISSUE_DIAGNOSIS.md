# Dietitian Login Issue - Diagnosis & Fix

## Issue: Dietitian redirected to login when accessing "Meal Plans"

---

## Root Cause Analysis

### Issue 1: Support Tickets Security Mismatch ⚠️

**SecurityConfig.java** (Line 37):
```java
.requestMatchers("/api/support-tickets/**").hasAnyRole("PATIENT", "SUPPORT_STAFF")
```

**SupportTicketController.java**:
```java
@PostMapping
@PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'DIETITIAN')")
```

**Problem**: SecurityFilterChain blocks DOCTOR and DIETITIAN before reaching controller.

**Fix**: Update SecurityConfig to include DOCTOR and DIETITIAN:
```java
.requestMatchers("/api/support-tickets/**").hasAnyRole("PATIENT", "DOCTOR", "DIETITIAN", "SUPPORT_STAFF")
```

---

### Issue 2: Messages Security Mismatch ⚠️

**SecurityConfig.java** (Line 40):
```java
.requestMatchers("/api/messages/**").authenticated()
```

**MessageController.java**:
```java
@PostMapping("/ticket/{ticketId}")
@PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'DIETITIAN', 'SUPPORT_STAFF')")
```

**Problem**: `authenticated()` allows ALL authenticated users (including SYSTEM_ADMIN, SUPER_ADMIN).

**Fix**: Update SecurityConfig to be explicit:
```java
.requestMatchers("/api/messages/**").hasAnyRole("PATIENT", "DOCTOR", "DIETITIAN", "SUPPORT_STAFF")
```

---

## Possible Frontend Issues

### 1. JWT Token Expired
**Symptom**: Redirect to login page
**Check**: 
- JWT token expires after 30 minutes
- Frontend should refresh token or re-login

**Test**:
```javascript
// Check token in browser console
localStorage.getItem('token')
// or
sessionStorage.getItem('token')
```

### 2. Wrong Endpoint Called
**Symptom**: 403 Forbidden or redirect to login

**Check frontend code** - What endpoint is "Meal Plans" calling?

Possible endpoints:
- `GET /api/care-plans/creator/{creatorId}` ✅ Should work for DIETITIAN
- `GET /api/care-plans/patient/{patientId}` ✅ Should work for DIETITIAN
- `GET /api/care-plans` ❌ Does NOT exist (404)

### 3. Missing Authorization Header
**Symptom**: 401 Unauthorized → redirect to login

**Check frontend code**:
```javascript
// Should include:
headers: {
  'Authorization': `Bearer ${token}`
}
```

### 4. Role Name Mismatch
**Symptom**: 403 Forbidden → redirect to login

**Check**:
- Backend expects: `DIETITIAN` (uppercase)
- Frontend sends: `dietitian` (lowercase) ❌
- JWT token contains: `ROLE_DIETITIAN` ✅ (Spring Security adds ROLE_ prefix)

---

## Debugging Steps

### Step 1: Check Browser Console
Open browser DevTools (F12) and check:

1. **Network Tab**:
   - What endpoint is being called?
   - What's the HTTP status code? (401, 403, 404?)
   - Is Authorization header present?

2. **Console Tab**:
   - Any JavaScript errors?
   - Token present in localStorage/sessionStorage?

### Step 2: Check JWT Token

**Decode JWT token** at https://jwt.io/

Expected payload:
```json
{
  "sub": "dietitian@example.com",
  "role": "DIETITIAN",
  "iat": 1234567890,
  "exp": 1234569690
}
```

Check:
- ✅ `role` is `DIETITIAN`
- ✅ `exp` (expiration) is in the future
- ✅ Token is not expired

### Step 3: Test Backend Directly

**Login as Dietitian**:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dietitian@example.com","password":"password123"}'
```

**Copy the token** from response.

**Test Meal Plans Endpoint**:
```bash
# Get creator's care plans (dietitian's own meal plans)
curl -X GET http://localhost:8080/api/care-plans/creator/3 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected**: 200 OK with list of meal plans

**If you get**:
- `401 Unauthorized` → Token invalid or expired
- `403 Forbidden` → Role mismatch or SecurityConfig issue
- `404 Not Found` → Wrong endpoint
- Redirect to login → Frontend issue

### Step 4: Check Backend Logs

Start backend with debug logging:
```bash
# In application.properties, add:
logging.level.org.springframework.security=DEBUG
```

Look for:
```
Access is denied (user is not authenticated)
Access is denied (user lacks authority)
```

---

## Quick Fixes

### Fix 1: Update SecurityConfig (REQUIRED)

**File**: `SecurityConfig.java`

**Change**:
```java
// OLD (Line 37)
.requestMatchers("/api/support-tickets/**").hasAnyRole("PATIENT", "SUPPORT_STAFF")

// NEW
.requestMatchers("/api/support-tickets/**").hasAnyRole("PATIENT", "DOCTOR", "DIETITIAN", "SUPPORT_STAFF")
```

```java
// OLD (Line 40)
.requestMatchers("/api/messages/**").authenticated()

// NEW
.requestMatchers("/api/messages/**").hasAnyRole("PATIENT", "DOCTOR", "DIETITIAN", "SUPPORT_STAFF")
```

### Fix 2: Check Frontend Token Handling

**Ensure token is stored after login**:
```javascript
// After successful login
localStorage.setItem('token', response.data.token);
localStorage.setItem('role', response.data.role);
localStorage.setItem('userId', response.data.userId);
```

**Ensure token is sent with requests**:
```javascript
// In API calls
axios.get('/api/care-plans/creator/' + userId, {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
});
```

**Ensure token expiration is handled**:
```javascript
// Check token expiration
const token = localStorage.getItem('token');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  const isExpired = payload.exp * 1000 < Date.now();
  if (isExpired) {
    // Redirect to login
    window.location.href = '/login';
  }
}
```

---

## Testing After Fix

### Test 1: Login as Dietitian
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dietitian@example.com","password":"password123"}'
```

### Test 2: Access Meal Plans
```bash
curl -X GET http://localhost:8080/api/care-plans/creator/3 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 3: Access Support Tickets (if needed)
```bash
curl -X GET http://localhost:8080/api/support-tickets/my-tickets \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 4: Send Ticket Message (if needed)
```bash
curl -X POST http://localhost:8080/api/messages/ticket/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Test message"}'
```

---

## Summary

### Confirmed Issues:
1. ⚠️ **SecurityConfig** missing DOCTOR, DIETITIAN for `/api/support-tickets/**`
2. ⚠️ **SecurityConfig** too permissive for `/api/messages/**`

### Possible Issues:
3. ❓ JWT token expired (30-minute timeout)
4. ❓ Frontend not sending Authorization header
5. ❓ Frontend calling wrong endpoint
6. ❓ Role name mismatch in frontend

### Next Steps:
1. ✅ Apply SecurityConfig fixes (provided above)
2. ✅ Check browser console for errors
3. ✅ Test backend endpoints directly with cURL
4. ✅ Verify JWT token is valid and not expired
5. ✅ Check frontend code for correct endpoint and headers

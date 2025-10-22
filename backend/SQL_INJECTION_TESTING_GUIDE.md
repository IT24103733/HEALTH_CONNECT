# SQL Injection Testing Guide for Health Connect

## Current Security Status: ✅ SAFE

Your application is **inherently protected** from SQL injection because:
1. ✅ Uses **Spring Data JPA** with parameterized queries
2. ✅ No raw SQL queries or native queries found
3. ✅ All database operations use JPA repository methods
4. ✅ `SqlEscapeUtil` exists but is **NOT USED** (which is good - JPA handles it)

---

## Why Your Application is Safe

### 1. Spring Data JPA Protection
All your repositories extend `JpaRepository` and use method name queries:

```java
// SAFE - Parameterized by Spring Data JPA
Optional<User> findByEmail(String email);
List<HealthMetric> findByUserIdOrderByDateDesc(Long userId);
```

**Behind the scenes**, Spring Data JPA generates:
```sql
-- Parameterized query (SAFE)
SELECT * FROM users WHERE email = ?
-- NOT vulnerable to: ' OR '1'='1
```

### 2. No Raw SQL Queries
Your codebase has **ZERO** instances of:
- `@Query` with native SQL
- `createNativeQuery()`
- `executeQuery()` with string concatenation

---

## How to Test SQL Injection

### Test Environment Setup

1. **Start the application**:
```bash
cd c:\HEALTH_CONNECT_BETA\backend
mvn spring-boot:run
```

2. **Use a REST client** (Postman, cURL, or browser extension)

---

## Test Cases

### Test 1: Login Endpoint - Email Field

**Endpoint**: `POST /api/auth/login`

**Malicious Payloads**:
```json
{
  "email": "admin@example.com' OR '1'='1",
  "password": "anything"
}
```

```json
{
  "email": "admin@example.com'; DROP TABLE users; --",
  "password": "password123"
}
```

```json
{
  "email": "admin@example.com' UNION SELECT * FROM users --",
  "password": "password123"
}
```

**Expected Result**: ✅ **Login fails** - JPA treats entire string as email value
```
Authentication failed: User not found
```

**cURL Command**:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@example.com' OR '1'='1\",\"password\":\"anything\"}"
```

---

### Test 2: Registration Endpoint - Name Field

**Endpoint**: `POST /api/auth/register`

**Malicious Payloads**:
```json
{
  "name": "John'; DROP TABLE users; --",
  "email": "test@example.com",
  "password": "password123",
  "role": "PATIENT"
}
```

```json
{
  "name": "John' OR '1'='1",
  "email": "test2@example.com",
  "password": "password123",
  "role": "PATIENT"
}
```

**Expected Result**: ✅ **User created with literal name** - SQL injection fails
```
User registered successfully
Name stored as: "John'; DROP TABLE users; --"
```

**cURL Command**:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John'; DROP TABLE users; --\",\"email\":\"test@example.com\",\"password\":\"password123\",\"role\":\"PATIENT\"}"
```

---

### Test 3: Health Metrics - Symptoms Field

**Endpoint**: `POST /api/health-metrics`

**Malicious Payloads**:
```json
{
  "userId": 1,
  "date": "2024-01-15",
  "caloriesIntake": 2000,
  "symptoms": "Headache' OR '1'='1"
}
```

```json
{
  "userId": 1,
  "date": "2024-01-15",
  "caloriesIntake": 2000,
  "symptoms": "'; DELETE FROM health_metrics; --"
}
```

**Expected Result**: ✅ **Symptoms stored as-is** - SQL injection fails
```
Symptoms stored as: "Headache' OR '1'='1"
```

**Note**: HtmlSanitizer will clean XSS but not SQL (JPA handles SQL safety)

---

### Test 4: User Search by ID

**Endpoint**: `GET /api/users/{id}`

**Malicious Payloads**:
```
GET /api/users/1' OR '1'='1
GET /api/users/1; DROP TABLE users; --
GET /api/users/1 UNION SELECT * FROM users
```

**Expected Result**: ✅ **400 Bad Request** - Path variable type mismatch
```
Failed to convert value of type 'java.lang.String' to required type 'java.lang.Long'
```

**cURL Command**:
```bash
curl -X GET "http://localhost:8080/api/users/1' OR '1'='1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Test 5: Query Parameters - Date Range

**Endpoint**: `GET /api/health-metrics/user/{userId}/range?startDate=...&endDate=...`

**Malicious Payloads**:
```
GET /api/health-metrics/user/1/range?startDate=2024-01-01' OR '1'='1&endDate=2024-12-31
GET /api/health-metrics/user/1/range?startDate=2024-01-01; DROP TABLE health_metrics; --&endDate=2024-12-31
```

**Expected Result**: ✅ **400 Bad Request** - Date parsing fails
```
Failed to convert value of type 'java.lang.String' to required type 'java.time.LocalDate'
```

---

## Advanced Testing with SQLMap

### Install SQLMap
```bash
# Windows (using Python)
pip install sqlmap

# Or download from: https://sqlmap.org/
```

### Test Login Endpoint
```bash
sqlmap -u "http://localhost:8080/api/auth/login" \
  --method POST \
  --data '{"email":"test@example.com","password":"password123"}' \
  --headers="Content-Type: application/json" \
  --level=5 \
  --risk=3
```

**Expected Result**: ✅ **No SQL injection vulnerabilities found**

---

## Manual Database Verification

### Check if malicious data was executed

1. **Connect to MySQL**:
```bash
mysql -u your_username -p health_connect
```

2. **Verify tables exist**:
```sql
SHOW TABLES;
-- Should show all tables (users, health_metrics, etc.)
```

3. **Check for injected data**:
```sql
-- Check if malicious strings were stored as literal values
SELECT * FROM users WHERE name LIKE "%DROP TABLE%";
SELECT * FROM health_metrics WHERE symptoms LIKE "%OR '1'='1%";
```

**Expected Result**: ✅ **Malicious strings stored as literal text, not executed**

---

## Why SqlEscapeUtil is NOT Used

### Current Status
- `SqlEscapeUtil` exists in your codebase
- **NOT imported or used anywhere**
- This is **CORRECT** - you don't need it!

### Why?
```java
// BAD PRACTICE (vulnerable to SQL injection)
String sql = "SELECT * FROM users WHERE email = '" + email + "'";
// Need SqlEscapeUtil here

// GOOD PRACTICE (your current approach - SAFE)
userRepository.findByEmail(email);
// JPA handles parameterization automatically
```

### When to Use SqlEscapeUtil
**ONLY** if you ever add native SQL queries:
```java
@Query(value = "SELECT * FROM users WHERE email = :email", nativeQuery = true)
User findByEmailNative(@Param("email") String email);
// Still safe - uses named parameters
```

**Emergency use only** (NOT RECOMMENDED):
```java
// If you MUST concatenate SQL (DON'T DO THIS)
String sql = "SELECT * FROM users WHERE name = '" + SqlEscapeUtil.escapeSql(name) + "'";
```

---

## Testing Checklist

### ✅ Basic Tests (Manual)
- [ ] Test login with `' OR '1'='1`
- [ ] Test registration with SQL injection in name
- [ ] Test health metrics with SQL injection in symptoms
- [ ] Test path variables with SQL injection
- [ ] Test query parameters with SQL injection

### ✅ Advanced Tests (Automated)
- [ ] Run SQLMap against all POST endpoints
- [ ] Run SQLMap against all GET endpoints with parameters
- [ ] Use OWASP ZAP for automated scanning
- [ ] Use Burp Suite for penetration testing

### ✅ Verification
- [ ] Check database tables still exist
- [ ] Verify no data was deleted
- [ ] Confirm malicious strings stored as literals
- [ ] Review application logs for errors

---

## Recommended Security Tools

### 1. OWASP ZAP (Free)
```bash
# Download from: https://www.zaproxy.org/
# Point to: http://localhost:8080
# Run automated scan
```

### 2. Burp Suite Community (Free)
```bash
# Download from: https://portswigger.net/burp
# Configure proxy
# Intercept and modify requests
```

### 3. Postman (Free)
```bash
# Download from: https://www.postman.com/
# Import API collection
# Run SQL injection test suite
```

---

## Sample Test Script (PowerShell)

```powershell
# Save as: test-sql-injection.ps1

$baseUrl = "http://localhost:8080"

# Test 1: Login with SQL injection
Write-Host "Test 1: Login SQL Injection" -ForegroundColor Yellow
$body = @{
    email = "admin@example.com' OR '1'='1"
    password = "anything"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
    -Method Post `
    -Body $body `
    -ContentType "application/json" `
    -ErrorAction SilentlyContinue

if ($response) {
    Write-Host "FAIL: SQL Injection succeeded!" -ForegroundColor Red
} else {
    Write-Host "PASS: SQL Injection blocked" -ForegroundColor Green
}

# Test 2: Registration with SQL injection
Write-Host "`nTest 2: Registration SQL Injection" -ForegroundColor Yellow
$body = @{
    name = "John'; DROP TABLE users; --"
    email = "test@example.com"
    password = "password123"
    role = "PATIENT"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" `
    -Method Post `
    -Body $body `
    -ContentType "application/json" `
    -ErrorAction SilentlyContinue

if ($response.message -eq "User registered successfully") {
    Write-Host "PASS: User created but SQL not executed" -ForegroundColor Green
} else {
    Write-Host "FAIL: Unexpected response" -ForegroundColor Red
}

Write-Host "`nAll tests completed!" -ForegroundColor Cyan
```

**Run**:
```powershell
.\test-sql-injection.ps1
```

---

## Conclusion

### ✅ Your Application is SAFE from SQL Injection

**Reasons**:
1. Spring Data JPA uses parameterized queries
2. No raw SQL concatenation
3. Type-safe repository methods
4. Input validation at multiple layers

### 🔒 Additional Security Layers

1. **HtmlSanitizer** - Prevents XSS attacks
2. **JWT Authentication** - Prevents unauthorized access
3. **@PreAuthorize** - Role-based access control
4. **Input Validation** - Jakarta Bean Validation

### 📝 Best Practices Followed

✅ Use JPA repository methods (not raw SQL)
✅ Parameterized queries (automatic with JPA)
✅ Input validation with @Valid
✅ Type-safe path variables and query parameters
✅ No string concatenation in queries

---

## Need Help?

If you find any SQL injection vulnerabilities:
1. Document the exact payload
2. Note the endpoint and HTTP method
3. Check if it's a false positive
4. Report to security team

**Remember**: Testing for SQL injection is **ethical** when done on your own application!

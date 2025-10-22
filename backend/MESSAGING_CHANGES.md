# Messaging System Changes - Summary

## Overview
The messaging system has been refactored to work exclusively through support tickets. Direct user-to-user messaging has been removed.

## Database Reset Required

### Steps to Reset Database:
```bash
# Option 1: Using MySQL command line
mysql -u your_username -p < database_reset.sql

# Option 2: Manual commands
mysql -u your_username -p
DROP DATABASE IF EXISTS health_connect;
CREATE DATABASE health_connect;
exit;
```

After resetting the database, start the application and Hibernate will automatically create all tables based on the JPA entities.

## Changes Made

### 1. Message Entity
- ✅ Added `ticketId` field (NOT NULL)
- ✅ Updated constructor to accept `ticketId`
- ✅ Added `getTicketId()` getter

### 2. MessageDTO
- ✅ Added `ticketId` field
- ✅ Updated constructor and `fromEntity()` method

### 3. MessageRequest
- ✅ Removed `recipientId` field (now auto-determined from ticket)
- ✅ Only requires `content` field

### 4. MessageRepository
- ❌ Removed `findByRecipientIdOrderByTimestampDesc()`
- ❌ Removed `findBySenderIdOrderByTimestampDesc()`
- ✅ Added `findByTicketIdOrderByTimestampAsc()`

### 5. MessageService
- ❌ Removed `sendMessage()` (user-to-user)
- ❌ Removed `getInbox()`
- ❌ Removed `getSentMessages()`
- ❌ Removed `markAsRead()`
- ✅ Updated `sendTicketMessage()` to save `ticketId`
- ✅ Added `getTicketMessages()` for chat history

### 6. MessageController
- ❌ Removed `POST /api/messages` (user-to-user)
- ❌ Removed `GET /api/messages/inbox/{userId}`
- ❌ Removed `GET /api/messages/sent/{userId}`
- ❌ Removed `PUT /api/messages/{messageId}/read`
- ✅ Updated `POST /api/messages/ticket/{ticketId}` - Auto-determines recipient
- ✅ Added `GET /api/messages/ticket/{ticketId}` - Retrieve chat history

### 7. SupportTicketController
- ✅ Updated `POST /api/support-tickets` - Allows PATIENT, DOCTOR, DIETITIAN
- ✅ Updated `GET /api/support-tickets/my-tickets` - Supports all roles
- ✅ Updated `GET /api/support-tickets/{id}/chat-access` - Allows DOCTOR, DIETITIAN

### 8. Application.java (Data Seeder)
- ❌ Removed broken message seeding
- ✅ Added support staff user seeding
- ✅ Seeds: patient, physician, dietitian, admin, support staff

## New Communication Flow

### Creating a Support Ticket
```
POST /api/support-tickets
Roles: PATIENT, DOCTOR, DIETITIAN
Body: { "subject": "...", "description": "..." }
```

### Support Staff Accepts Ticket
```
POST /api/support-tickets/{id}/accept
Role: SUPPORT_STAFF
```

### Sending Messages in Ticket
```
POST /api/messages/ticket/{ticketId}
Roles: PATIENT, DOCTOR, DIETITIAN, SUPPORT_STAFF
Body: { "content": "..." }
Note: Recipient is automatically determined (ticket creator ↔ assigned staff)
```

### Viewing Ticket Chat History
```
GET /api/messages/ticket/{ticketId}
Roles: PATIENT, DOCTOR, DIETITIAN, SUPPORT_STAFF
Access: Only ticket creator and assigned staff
```

## Access Control

### Who Can Create Tickets?
- ✅ PATIENT
- ✅ DOCTOR
- ✅ DIETITIAN
- ❌ SUPPORT_STAFF (they only respond)
- ❌ SYSTEM_ADMIN
- ❌ SUPER_ADMIN

### Who Can Accept Tickets?
- ✅ SUPPORT_STAFF only

### Who Can Chat in Tickets?
- ✅ Ticket creator (patient/doctor/dietitian)
- ✅ Assigned support staff
- ❌ Other users (even with same role)

## Sample Users (After Seeding)

| Email | Password | Role |
|-------|----------|------|
| patient@example.com | password123 | PATIENT |
| physician@example.com | password123 | DOCTOR |
| dietitian@example.com | password123 | DIETITIAN |
| admin@example.com | password123 | SYSTEM_ADMIN |
| support@example.com | password123 | SUPPORT_STAFF |

## Testing the New Flow

1. **Create a ticket** (as patient/doctor/dietitian)
2. **View pending tickets** (as support staff): `GET /api/support-tickets/queue`
3. **Accept ticket** (as support staff): `POST /api/support-tickets/{id}/accept`
4. **Send messages** (both parties): `POST /api/messages/ticket/{ticketId}`
5. **View chat history**: `GET /api/messages/ticket/{ticketId}`
6. **Resolve ticket** (as support staff): `PUT /api/support-tickets/{id}/resolve`

## Potential Issues Resolved

### ✅ Issue 1: MessageRequest recipientId
- **Before**: Required `recipientId` in request body
- **After**: Automatically determined from ticket (sender → other party)
- **Benefit**: Simpler API, prevents sending to wrong recipient

### ✅ Issue 2: Message Entity ticketId NOT NULL
- **Before**: Would fail with existing messages
- **After**: Database reset ensures clean schema
- **Benefit**: Data integrity, all messages linked to tickets

### ✅ Issue 3: Database Migration
- **Solution**: Drop and recreate database
- **Impact**: All existing data deleted (acceptable for development)
- **Alternative**: For production, use nullable ticketId or manual migration

## Breaking Changes

### Removed Endpoints
- `POST /api/messages` - No longer supported
- `GET /api/messages/inbox/{userId}` - No longer supported
- `GET /api/messages/sent/{userId}` - No longer supported
- `PUT /api/messages/{messageId}/read` - No longer supported

### Changed Request Format
- `POST /api/messages/ticket/{ticketId}` now only requires `{ "content": "..." }`
- No longer needs `recipientId` in request body

## Notes

- All messages are now tied to support tickets
- No direct user-to-user messaging
- Recipient is automatically determined based on ticket participants
- Chat history is chronologically ordered (oldest first)
- Access control enforced at both controller and service levels

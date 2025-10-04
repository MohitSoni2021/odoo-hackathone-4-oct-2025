# 🏗️ API Structure Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Expense Management API                    │
│                   http://localhost:5000/api                  │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   ┌─────────┐          ┌─────────┐          ┌─────────┐
   │  Admin  │          │  Auth   │          │  Users  │
   │ Routes  │          │ Routes  │          │ Routes  │
   └─────────┘          └─────────┘          └─────────┘
        │                     │                     │
        ▼                     ▼                     ▼
   ┌─────────┐          ┌─────────┐          ┌─────────┐
   │Expenses │          │Notifica-│          │ Health  │
   │ Routes  │          │  tions  │          │  Check  │
   └─────────┘          └─────────┘          └─────────┘
```

---

## Database Models

```
┌──────────────────────────────────────────────────────────────┐
│                         MongoDB                              │
└──────────────────────────────────────────────────────────────┘
           │
           ├── Users Collection
           │   ├── _id
           │   ├── firstName, lastName
           │   ├── email (unique)
           │   ├── password (hashed)
           │   ├── role (admin/manager/employee)
           │   ├── company (ref: Company)
           │   ├── manager (ref: User)
           │   ├── country
           │   ├── isActive
           │   └── timestamps
           │
           ├── Companies Collection
           │   ├── _id
           │   ├── name
           │   ├── country
           │   ├── currency
           │   ├── admin (ref: User)
           │   ├── isActive
           │   └── timestamps
           │
           ├── Expenses Collection
           │   ├── _id
           │   ├── title, description
           │   ├── amount, currency
           │   ├── category
           │   ├── date
           │   ├── receipt (url, publicId)
           │   ├── status (pending/approved/rejected/reimbursed)
           │   ├── submittedBy (ref: User)
           │   ├── company (ref: Company)
           │   ├── approvedBy (ref: User)
           │   ├── approvedAt
           │   ├── rejectionReason
           │   └── timestamps
           │
           └── Notifications Collection
               ├── _id
               ├── recipient (ref: User)
               ├── sender (ref: User)
               ├── type
               ├── title, message
               ├── relatedExpense (ref: Expense)
               ├── isRead
               ├── readAt
               └── timestamps
```

---

## API Endpoints Tree

```
/api
│
├── /admin (Public - for initial setup)
│   ├── POST   /create-admin          → Create first admin user
│   └── POST   /create-test-data      → Create test environment
│
├── /auth
│   ├── POST   /signup                → Register new user (creates company)
│   ├── POST   /login                 → Login user
│   └── GET    /me                    → Get current user info [Protected]
│
├── /users [Protected]
│   ├── GET    /                      → Get all users [Admin]
│   ├── POST   /                      → Create new user [Admin]
│   ├── GET    /stats                 → Get user statistics [Admin]
│   ├── GET    /me                    → Get current user
│   ├── PATCH  /updateMe              → Update own profile
│   ├── GET    /my-employees          → Get employees under manager [Manager/Admin]
│   ├── GET    /:id                   → Get single user [Admin]
│   ├── PATCH  /:id                   → Update user [Admin]
│   └── DELETE /:id                   → Delete user [Admin]
│
├── /expenses [Protected]
│   ├── GET    /                      → Get all expenses (filtered by role)
│   ├── POST   /                      → Create new expense
│   ├── GET    /stats                 → Get expense statistics
│   ├── GET    /pending-count         → Get pending count [Manager/Admin]
│   ├── GET    /:id                   → Get single expense
│   ├── PATCH  /:id                   → Update expense (own pending only)
│   ├── DELETE /:id                   → Delete expense (own pending only)
│   ├── PATCH  /:id/approve           → Approve expense [Manager/Admin]
│   └── PATCH  /:id/reject            → Reject expense [Manager/Admin]
│
├── /notifications [Protected]
│   ├── GET    /                      → Get my notifications
│   ├── GET    /unread-count          → Get unread count
│   ├── PATCH  /mark-all-read         → Mark all as read
│   ├── PATCH  /:id/read              → Mark single as read
│   └── DELETE /:id                   → Delete notification
│
└── /health (Public)
    └── GET    /                      → Health check
```

---

## User Role Permissions

```
┌─────────────────────────────────────────────────────────────┐
│                         ADMIN                                │
├─────────────────────────────────────────────────────────────┤
│ ✓ Full access to all features                               │
│ ✓ Create/Update/Delete users                                │
│ ✓ View all expenses in company                              │
│ ✓ Approve/Reject any expense                                │
│ ✓ Access all analytics and reports                          │
│ ✓ Manage company settings                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        MANAGER                               │
├─────────────────────────────────────────────────────────────┤
│ ✓ View assigned employees                                   │
│ ✓ View employees' expenses                                  │
│ ✓ Approve/Reject employees' expenses                        │
│ ✓ Submit own expenses                                       │
│ ✓ View team analytics                                       │
│ ✗ Cannot manage users                                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       EMPLOYEE                               │
├─────────────────────────────────────────────────────────────┤
│ ✓ Submit expenses                                           │
│ ✓ View own expenses                                         │
│ ✓ Update/Delete own pending expenses                        │
│ ✓ Receive notifications                                     │
│ ✓ Update own profile                                        │
│ ✗ Cannot view others' expenses                              │
│ ✗ Cannot approve/reject expenses                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Expense Workflow

```
┌──────────────┐
│   Employee   │
│   Submits    │
│   Expense    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   PENDING    │◄─────────────┐
│    Status    │              │
└──────┬───────┘              │
       │                      │
       │ Notification sent    │
       │ to Manager/Admin     │
       │                      │
       ▼                      │
┌──────────────┐              │
│ Manager/Admin│              │
│   Reviews    │              │
└──────┬───────┘              │
       │                      │
       ├─────────┬────────────┤
       │         │            │
       ▼         ▼            │
  ┌─────────┐ ┌─────────┐    │
  │APPROVED │ │REJECTED │    │
  └────┬────┘ └────┬────┘    │
       │           │          │
       │           └──────────┘
       │           (Can resubmit)
       ▼
  ┌─────────┐
  │REIMBURSED│
  └─────────┘
```

---

## Notification Triggers

```
Event                          → Notification Sent To
─────────────────────────────────────────────────────
Expense Submitted              → Manager + All Admins
Expense Approved               → Employee (submitter)
Expense Rejected               → Employee (submitter)
Expense Reimbursed             → Employee (submitter)
User Added to System           → New User
User Role Changed              → Affected User
```

---

## Data Flow Example: Creating an Expense

```
1. Employee Login
   POST /api/auth/login
   ↓
   Receives JWT Token

2. Create Expense
   POST /api/expenses
   Headers: Authorization: Bearer <token>
   Body: { title, amount, category, ... }
   ↓
   ├─ Expense saved to database
   ├─ Status set to "pending"
   └─ Notifications created for:
      ├─ Employee's Manager
      └─ All Company Admins

3. Manager Reviews
   GET /api/expenses?status=pending
   ↓
   Views pending expenses

4. Manager Approves
   PATCH /api/expenses/:id/approve
   ↓
   ├─ Status changed to "approved"
   ├─ approvedBy and approvedAt set
   └─ Notification sent to Employee

5. Employee Receives Notification
   GET /api/notifications
   ↓
   Sees approval notification
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Authentication Flow                       │
└─────────────────────────────────────────────────────────────┘

1. User sends credentials
   POST /api/auth/login
   { email, password }
   
2. Server validates
   ├─ Check if user exists
   ├─ Compare password hash
   └─ Update lastLogin
   
3. Server generates JWT
   ├─ Payload: { id: user._id }
   ├─ Secret: JWT_SECRET
   └─ Expiry: 7 days
   
4. Client receives token
   { token: "eyJhbGc..." }
   
5. Client stores token
   localStorage / sessionStorage
   
6. Client includes token in requests
   Authorization: Bearer <token>
   
7. Server validates token
   ├─ Verify signature
   ├─ Check expiration
   ├─ Load user from database
   └─ Attach user to request
   
8. Request processed
   Access granted based on role
```

---

## Error Handling

```
HTTP Status Codes Used:

200 OK                  → Successful GET/PATCH request
201 Created             → Successful POST request
204 No Content          → Successful DELETE request
400 Bad Request         → Invalid input data
401 Unauthorized        → Missing or invalid token
403 Forbidden           → Insufficient permissions
404 Not Found           → Resource doesn't exist
500 Internal Error      → Server error

Error Response Format:
{
  "status": "fail",
  "message": "Descriptive error message"
}
```

---

## Security Features

```
✓ Password Hashing (bcrypt with cost 12)
✓ JWT Token Authentication
✓ Role-Based Access Control (RBAC)
✓ Input Validation
✓ Email Validation
✓ Protected Routes Middleware
✓ Company Isolation (users can only access their company data)
✓ Owner Verification (users can only edit their own resources)
```

---

## Database Indexes

```
Users Collection:
  - email (unique)
  - company + role
  - manager

Expenses Collection:
  - submittedBy + status
  - company + status
  - date (descending)

Notifications Collection:
  - recipient + isRead
  - createdAt (descending)
```

---

## API Response Patterns

### Success Response
```json
{
  "status": "success",
  "data": {
    "resource": { ... }
  }
}
```

### Success with Multiple Items
```json
{
  "status": "success",
  "results": 10,
  "data": {
    "resources": [ ... ]
  }
}
```

### Error Response
```json
{
  "status": "fail",
  "message": "Error description"
}
```

---

## Environment Configuration

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://...

# Authentication
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

# Optional: File Upload (for future)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## Testing Workflow

```
1. Create Admin
   POST /api/admin/create-admin
   
2. Login as Admin
   POST /api/auth/login
   
3. Create Manager
   POST /api/users (role: manager)
   
4. Create Employee
   POST /api/users (role: employee, manager: <manager_id>)
   
5. Login as Employee
   POST /api/auth/login
   
6. Submit Expense
   POST /api/expenses
   
7. Login as Manager
   POST /api/auth/login
   
8. View Pending Expenses
   GET /api/expenses?status=pending
   
9. Approve Expense
   PATCH /api/expenses/:id/approve
   
10. Login as Employee
    POST /api/auth/login
    
11. Check Notifications
    GET /api/notifications
```

---

## Next Steps for Frontend

1. **Admin Dashboard**
   - User management interface
   - Expense approval queue
   - Analytics and charts
   - Company settings

2. **Manager Dashboard**
   - Team overview
   - Pending approvals
   - Team expense analytics

3. **Employee Dashboard**
   - Expense submission form
   - Expense history
   - Notification center

4. **Shared Components**
   - Authentication forms
   - Navigation
   - Notification bell
   - Profile menu

---

**Backend is ready! Time to build the frontend! 🚀**
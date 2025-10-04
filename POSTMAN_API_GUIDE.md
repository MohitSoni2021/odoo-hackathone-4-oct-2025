# Expense Management API - Postman Guide

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require a Bearer token. After login/signup, include the token in the Authorization header:
```
Authorization: Bearer <your_token_here>
```

---

## 📋 Table of Contents
1. [Admin Routes](#admin-routes)
2. [Authentication Routes](#authentication-routes)
3. [User Management Routes](#user-management-routes)
4. [Expense Routes](#expense-routes)
5. [Notification Routes](#notification-routes)

---

## 🔐 Admin Routes

### 1. Create Admin User (Initial Setup)
**Endpoint:** `POST /api/admin/create-admin`

**Description:** Create the first admin user with a company. Use this to set up your system.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "admin@company.com",
  "password": "admin123456",
  "country": "United States",
  "companyName": "Acme Corporation"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Admin user and company created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "admin@company.com",
      "role": "admin",
      "country": "United States",
      "company": "..."
    },
    "company": {
      "_id": "...",
      "name": "Acme Corporation",
      "country": "United States",
      "currency": "USD",
      "admin": "..."
    }
  }
}
```

**Available Countries & Currencies:**
- United States → USD
- United Kingdom → GBP
- European Union → EUR
- Canada → CAD
- Australia → AUD
- Japan → JPY
- India → INR
- Germany → EUR
- France → EUR
- China → CNY
- Brazil → BRL
- Singapore → SGD
- Switzerland → CHF

---

### 2. Create Test Data (Development Only)
**Endpoint:** `POST /api/admin/create-test-data`

**Description:** Creates a complete test environment with admin, managers, and employees.

**Request Body:**
```json
{
  "companyName": "Test Company",
  "country": "United States"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Test data created successfully",
  "data": {
    "company": {...},
    "users": {
      "admin": {...},
      "managers": [...],
      "employees": [...]
    },
    "credentials": {
      "admin": { "email": "admin@test.com", "password": "admin123456" },
      "manager1": { "email": "manager1@test.com", "password": "manager123456" },
      "manager2": { "email": "manager2@test.com", "password": "manager123456" },
      "employee1": { "email": "employee1@test.com", "password": "employee123456" },
      "employee2": { "email": "employee2@test.com", "password": "employee123456" },
      "employee3": { "email": "employee3@test.com", "password": "employee123456" }
    }
  }
}
```

---

## 🔑 Authentication Routes

### 3. Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "admin@company.com",
  "password": "admin123456"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "admin@company.com",
      "role": "admin",
      "company": "...",
      "lastLogin": "2025-01-10T10:30:00.000Z"
    }
  }
}
```

---

### 4. Get Current User
**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "admin@company.com",
      "role": "admin",
      "company": {
        "_id": "...",
        "name": "Acme Corporation",
        "country": "United States",
        "currency": "USD"
      }
    }
  }
}
```

---

## 👥 User Management Routes (Admin Only)

### 5. Get All Users
**Endpoint:** `GET /api/users`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `role` (optional): Filter by role (admin, manager, employee)
- `search` (optional): Search by name or email
- `isActive` (optional): Filter by active status (true/false)

**Example:** `GET /api/users?role=employee&isActive=true`

**Response:**
```json
{
  "status": "success",
  "results": 5,
  "data": {
    "users": [
      {
        "_id": "...",
        "firstName": "Alice",
        "lastName": "Employee",
        "email": "alice@company.com",
        "role": "employee",
        "manager": {
          "_id": "...",
          "firstName": "John",
          "lastName": "Manager"
        },
        "isActive": true,
        "createdAt": "2025-01-10T10:00:00.000Z"
      }
    ]
  }
}
```

---

### 6. Create New User
**Endpoint:** `POST /api/users`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@company.com",
  "password": "password123456",
  "role": "employee",
  "manager": "manager_id_here",
  "country": "United States"
}
```

**Notes:**
- `role` can be: "admin", "manager", or "employee"
- `manager` is required if role is "employee"
- Password must be at least 8 characters

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "...",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@company.com",
      "role": "employee",
      "manager": "...",
      "company": "...",
      "isActive": true
    }
  }
}
```

---

### 7. Get Single User
**Endpoint:** `GET /api/users/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "...",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@company.com",
      "role": "employee",
      "manager": {
        "_id": "...",
        "firstName": "John",
        "lastName": "Manager"
      },
      "company": {...}
    }
  }
}
```

---

### 8. Update User
**Endpoint:** `PATCH /api/users/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith-Updated",
  "role": "manager",
  "isActive": true,
  "country": "Canada"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {...}
  }
}
```

---

### 9. Delete User
**Endpoint:** `DELETE /api/users/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "status": "success",
  "data": null
}
```

---

### 10. Get User Statistics
**Endpoint:** `GET /api/users/stats`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "roleStats": [
      { "_id": "admin", "count": 1 },
      { "_id": "manager", "count": 3 },
      { "_id": "employee", "count": 15 }
    ],
    "activeUsers": 18,
    "inactiveUsers": 1
  }
}
```

---

### 11. Get My Employees (Manager/Admin)
**Endpoint:** `GET /api/users/my-employees`

**Headers:**
```
Authorization: Bearer <manager_token>
```

**Response:**
```json
{
  "status": "success",
  "results": 5,
  "data": {
    "employees": [...]
  }
}
```

---

### 12. Update Own Profile
**Endpoint:** `PATCH /api/users/updateMe`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Updated",
  "country": "Canada"
}
```

---

## 💰 Expense Routes

### 13. Create Expense
**Endpoint:** `POST /api/expenses`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Client Dinner",
  "description": "Dinner with client at restaurant",
  "amount": 150.50,
  "currency": "USD",
  "category": "Food",
  "date": "2025-01-10",
  "receipt": {
    "url": "https://example.com/receipt.jpg",
    "publicId": "receipt_123"
  },
  "notes": "Discussed Q1 project requirements"
}
```

**Categories:**
- Travel
- Food
- Accommodation
- Transportation
- Office Supplies
- Entertainment
- Training
- Software
- Hardware
- Other

**Response:**
```json
{
  "status": "success",
  "data": {
    "expense": {
      "_id": "...",
      "title": "Client Dinner",
      "amount": 150.50,
      "currency": "USD",
      "category": "Food",
      "status": "pending",
      "submittedBy": {
        "_id": "...",
        "firstName": "John",
        "lastName": "Doe"
      },
      "createdAt": "2025-01-10T10:00:00.000Z"
    }
  }
}
```

---

### 14. Get All Expenses
**Endpoint:** `GET /api/expenses`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): pending, approved, rejected, reimbursed
- `category` (optional): Filter by category
- `startDate` (optional): Filter from date (YYYY-MM-DD)
- `endDate` (optional): Filter to date (YYYY-MM-DD)
- `submittedBy` (optional): Filter by user ID (admin/manager only)

**Example:** `GET /api/expenses?status=pending&category=Travel`

**Response:**
```json
{
  "status": "success",
  "results": 10,
  "data": {
    "expenses": [...]
  }
}
```

---

### 15. Get Single Expense
**Endpoint:** `GET /api/expenses/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "expense": {
      "_id": "...",
      "title": "Client Dinner",
      "description": "Dinner with client",
      "amount": 150.50,
      "currency": "USD",
      "category": "Food",
      "status": "pending",
      "submittedBy": {...},
      "company": {...}
    }
  }
}
```

---

### 16. Update Expense
**Endpoint:** `PATCH /api/expenses/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Note:** Can only update own pending expenses

**Request Body:**
```json
{
  "title": "Updated Title",
  "amount": 175.00,
  "description": "Updated description"
}
```

---

### 17. Delete Expense
**Endpoint:** `DELETE /api/expenses/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Note:** Can only delete own pending expenses

---

### 18. Approve Expense (Manager/Admin)
**Endpoint:** `PATCH /api/expenses/:id/approve`

**Headers:**
```
Authorization: Bearer <manager_or_admin_token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "expense": {
      "_id": "...",
      "status": "approved",
      "approvedBy": {...},
      "approvedAt": "2025-01-10T11:00:00.000Z"
    }
  }
}
```

---

### 19. Reject Expense (Manager/Admin)
**Endpoint:** `PATCH /api/expenses/:id/reject`

**Headers:**
```
Authorization: Bearer <manager_or_admin_token>
```

**Request Body:**
```json
{
  "rejectionReason": "Receipt is not clear. Please resubmit with a better quality image."
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "expense": {
      "_id": "...",
      "status": "rejected",
      "approvedBy": {...},
      "approvedAt": "2025-01-10T11:00:00.000Z",
      "rejectionReason": "Receipt is not clear..."
    }
  }
}
```

---

### 20. Get Expense Statistics
**Endpoint:** `GET /api/expenses/stats`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD

**Response:**
```json
{
  "status": "success",
  "data": {
    "statusStats": [
      { "_id": "pending", "count": 5, "totalAmount": 1250.00 },
      { "_id": "approved", "count": 20, "totalAmount": 5000.00 }
    ],
    "categoryStats": [
      { "_id": "Travel", "count": 10, "totalAmount": 3000.00 },
      { "_id": "Food", "count": 8, "totalAmount": 1200.00 }
    ],
    "monthlyStats": [...],
    "totalExpenses": 25,
    "totalAmount": 6250.00
  }
}
```

---

### 21. Get Pending Expenses Count (Manager/Admin)
**Endpoint:** `GET /api/expenses/pending-count`

**Headers:**
```
Authorization: Bearer <manager_or_admin_token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "count": 5
  }
}
```

---

## 🔔 Notification Routes

### 22. Get My Notifications
**Endpoint:** `GET /api/notifications`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `isRead` (optional): true/false
- `limit` (optional): Number of notifications (default: 20)

**Example:** `GET /api/notifications?isRead=false&limit=10`

**Response:**
```json
{
  "status": "success",
  "results": 5,
  "data": {
    "notifications": [
      {
        "_id": "...",
        "type": "expense_approved",
        "title": "Expense Approved",
        "message": "Your expense 'Client Dinner' has been approved",
        "sender": {
          "_id": "...",
          "firstName": "Manager",
          "lastName": "Name"
        },
        "relatedExpense": {
          "_id": "...",
          "title": "Client Dinner",
          "amount": 150.50,
          "currency": "USD"
        },
        "isRead": false,
        "createdAt": "2025-01-10T11:00:00.000Z"
      }
    ]
  }
}
```

---

### 23. Get Unread Count
**Endpoint:** `GET /api/notifications/unread-count`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "count": 3
  }
}
```

---

### 24. Mark Notification as Read
**Endpoint:** `PATCH /api/notifications/:id/read`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "notification": {
      "_id": "...",
      "isRead": true,
      "readAt": "2025-01-10T12:00:00.000Z"
    }
  }
}
```

---

### 25. Mark All Notifications as Read
**Endpoint:** `PATCH /api/notifications/mark-all-read`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "message": "All notifications marked as read"
}
```

---

### 26. Delete Notification
**Endpoint:** `DELETE /api/notifications/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": null
}
```

---

## 🚀 Quick Start Guide

### Step 1: Create Admin User
```bash
POST http://localhost:5000/api/admin/create-admin
Content-Type: application/json

{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@mycompany.com",
  "password": "admin123456",
  "country": "United States",
  "companyName": "My Company"
}
```

### Step 2: Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@mycompany.com",
  "password": "admin123456"
}
```

### Step 3: Copy the token from response and use it in subsequent requests

### Step 4: Create Users
```bash
POST http://localhost:5000/api/users
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Manager",
  "email": "manager@mycompany.com",
  "password": "manager123456",
  "role": "manager",
  "country": "United States"
}
```

---

## 📝 Notes

1. **Token Expiration:** Tokens expire after 7 days (configurable in .env)
2. **Password Requirements:** Minimum 8 characters
3. **Role Hierarchy:**
   - Admin: Full access to all features
   - Manager: Can manage their employees and approve/reject expenses
   - Employee: Can submit and manage their own expenses

4. **Permissions:**
   - Employees can only see/edit their own expenses
   - Managers can see their employees' expenses
   - Admins can see all expenses in the company

5. **Notifications:** Automatically created when:
   - Expense is submitted
   - Expense is approved/rejected
   - User is added to the system
   - User role is changed

---

## 🐛 Error Responses

All errors follow this format:
```json
{
  "status": "fail",
  "message": "Error message here"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔧 Environment Variables

Make sure your `.env` file in the backend directory contains:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

---

## 📦 Postman Collection

You can import these endpoints into Postman by creating a new collection and adding each endpoint manually, or use the provided examples above.

**Recommended Postman Setup:**
1. Create a new Collection called "Expense Management API"
2. Create an Environment with variable `baseUrl` = `http://localhost:5000/api`
3. Create an Environment variable `token` to store your auth token
4. Use `{{baseUrl}}` and `{{token}}` in your requests

---

Happy Testing! 🎉
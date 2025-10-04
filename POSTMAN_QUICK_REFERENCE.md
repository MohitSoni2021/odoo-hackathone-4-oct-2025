# 🚀 Postman Quick Reference Card

## ⚡ Quick Setup (2 Minutes)

### Step 1: Create Admin (First Time Only)
```
Method: POST
URL: http://localhost:5000/api/admin/create-admin
Headers: Content-Type: application/json

Body:
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@company.com",
  "password": "admin123456",
  "country": "United States",
  "companyName": "Acme Corporation"
}

✅ Save the token from response!
```

### Step 2: Login
```
Method: POST
URL: http://localhost:5000/api/auth/login

Body:
{
  "email": "admin@company.com",
  "password": "admin123456"
}

✅ Copy the token!
```

### Step 3: Use Token in All Requests
```
Add to Headers:
Authorization: Bearer <your_token_here>
```

---

## 🎯 Most Used Endpoints

### Get Current User
```
GET http://localhost:5000/api/auth/me
Header: Authorization: Bearer <token>
```

### Get All Users
```
GET http://localhost:5000/api/users
Header: Authorization: Bearer <token>
```

### Create Manager
```
POST http://localhost:5000/api/users
Header: Authorization: Bearer <token>

Body:
{
  "firstName": "John",
  "lastName": "Manager",
  "email": "manager@company.com",
  "password": "manager123456",
  "role": "manager",
  "country": "United States"
}
```

### Create Employee
```
POST http://localhost:5000/api/users
Header: Authorization: Bearer <token>

Body:
{
  "firstName": "Jane",
  "lastName": "Employee",
  "email": "employee@company.com",
  "password": "employee123456",
  "role": "employee",
  "manager": "<manager_id>",
  "country": "United States"
}
```

### Create Expense
```
POST http://localhost:5000/api/expenses
Header: Authorization: Bearer <token>

Body:
{
  "title": "Client Dinner",
  "description": "Dinner with client",
  "amount": 150.50,
  "currency": "USD",
  "category": "Food",
  "date": "2025-01-10"
}
```

### Get Pending Expenses
```
GET http://localhost:5000/api/expenses?status=pending
Header: Authorization: Bearer <token>
```

### Approve Expense
```
PATCH http://localhost:5000/api/expenses/<expense_id>/approve
Header: Authorization: Bearer <token>
```

### Reject Expense
```
PATCH http://localhost:5000/api/expenses/<expense_id>/reject
Header: Authorization: Bearer <token>

Body:
{
  "rejectionReason": "Receipt not clear"
}
```

### Get User Statistics
```
GET http://localhost:5000/api/users/stats
Header: Authorization: Bearer <token>
```

### Get Expense Statistics
```
GET http://localhost:5000/api/expenses/stats
Header: Authorization: Bearer <token>
```

### Get Notifications
```
GET http://localhost:5000/api/notifications
Header: Authorization: Bearer <token>
```

---

## 📋 Quick Values Reference

### User Roles
- `admin` - Full access
- `manager` - Team management
- `employee` - Personal expenses

### Expense Categories
- `Travel`
- `Food`
- `Accommodation`
- `Transportation`
- `Office Supplies`
- `Entertainment`
- `Training`
- `Software`
- `Hardware`
- `Other`

### Expense Status
- `pending` - Awaiting approval
- `approved` - Approved by manager/admin
- `rejected` - Rejected
- `reimbursed` - Payment processed

### Countries & Currencies
- United States → USD
- United Kingdom → GBP
- Canada → CAD
- Australia → AUD
- India → INR
- Japan → JPY
- Germany/France/Italy → EUR

---

## 🔧 Postman Environment Setup

Create a Postman Environment with these variables:

```
baseUrl: http://localhost:5000/api
token: (will be set automatically after login)
```

Then use in requests:
- URL: `{{baseUrl}}/users`
- Header: `Authorization: Bearer {{token}}`

---

## 🎪 Test Data Creation

Create complete test environment:
```
POST http://localhost:5000/api/admin/create-test-data

Body:
{
  "companyName": "Test Company",
  "country": "United States"
}

Creates:
- admin@test.com / admin123456
- manager1@test.com / manager123456
- manager2@test.com / manager123456
- employee1@test.com / employee123456
- employee2@test.com / employee123456
- employee3@test.com / employee123456
```

---

## 🐛 Common Issues

### "Unauthorized"
→ Check if token is included in Authorization header
→ Token format: `Bearer <token>` (note the space)

### "User already exists"
→ Use different email or delete existing user

### "Cannot connect"
→ Check if backend server is running at http://localhost:5000

### "Validation error"
→ Check required fields in request body
→ Password must be at least 8 characters

---

## 📦 Import Postman Collection

Import this file into Postman:
`Expense_Management_API.postman_collection.json`

All endpoints will be pre-configured!

---

## ✅ Testing Checklist

- [ ] Health check works
- [ ] Admin user created
- [ ] Login successful
- [ ] Token saved
- [ ] Get current user works
- [ ] Create manager works
- [ ] Create employee works
- [ ] Get all users works
- [ ] Create expense works
- [ ] Approve expense works
- [ ] Get statistics works

---

## 🚀 Ready to Code!

Backend is tested and working!
Now build the Admin Dashboard UI.

See **START_HERE.md** for frontend development guide.
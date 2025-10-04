# 🚀 Quick Start - Expense Management System

## Backend is Running ✅
Server: `http://localhost:5000`

---

## 📍 Step-by-Step Guide to Create Admin via Postman

### Step 1: Open Postman

### Step 2: Create Admin User

**Method:** `POST`  
**URL:** `http://localhost:5000/api/admin/create-admin`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@company.com",
  "password": "admin123456",
  "country": "United States",
  "companyName": "Acme Corporation"
}
```

**Click Send** ✨

### Expected Response:
```json
{
  "status": "success",
  "message": "Admin user and company created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "...",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@company.com",
      "role": "admin"
    },
    "company": {
      "name": "Acme Corporation",
      "country": "United States",
      "currency": "USD"
    }
  }
}
```

### Step 3: Copy the Token
Copy the `token` value from the response. You'll need it for all subsequent requests.

---

## 🎯 Quick Test Endpoints

### 1. Login (Test Your Admin)
```
POST http://localhost:5000/api/auth/login

Body:
{
  "email": "admin@company.com",
  "password": "admin123456"
}
```

### 2. Get Current User Info
```
GET http://localhost:5000/api/auth/me

Headers:
Authorization: Bearer <your_token>
```

### 3. Create a Manager
```
POST http://localhost:5000/api/users

Headers:
Authorization: Bearer <your_token>

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

### 4. Create an Employee
```
POST http://localhost:5000/api/users

Headers:
Authorization: Bearer <your_token>

Body:
{
  "firstName": "Jane",
  "lastName": "Employee",
  "email": "employee@company.com",
  "password": "employee123456",
  "role": "employee",
  "manager": "<manager_id_from_step_3>",
  "country": "United States"
}
```

### 5. Get All Users
```
GET http://localhost:5000/api/users

Headers:
Authorization: Bearer <your_token>
```

---

## 🎪 Alternative: Create Complete Test Data

Instead of creating users one by one, you can create a complete test environment:

```
POST http://localhost:5000/api/admin/create-test-data

Body:
{
  "companyName": "Test Company",
  "country": "United States"
}
```

This creates:
- 1 Admin (admin@test.com / admin123456)
- 2 Managers (manager1@test.com, manager2@test.com / manager123456)
- 3 Employees (employee1@test.com, employee2@test.com, employee3@test.com / employee123456)

---

## 📚 Full API Documentation

See `POSTMAN_API_GUIDE.md` for complete API documentation with all 26 endpoints.

---

## 🌍 Available Countries & Currencies

| Country | Currency |
|---------|----------|
| United States | USD |
| United Kingdom | GBP |
| European Union | EUR |
| Canada | CAD |
| Australia | AUD |
| Japan | JPY |
| India | INR |
| Germany | EUR |
| France | EUR |
| China | CNY |
| Brazil | BRL |
| Singapore | SGD |
| Switzerland | CHF |

---

## 🎨 Expense Categories

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

---

## 👥 User Roles

1. **Admin**
   - Full system access
   - Manage all users
   - View/approve all expenses
   - Access all analytics

2. **Manager**
   - Manage assigned employees
   - Approve/reject employee expenses
   - View team analytics

3. **Employee**
   - Submit expenses
   - View own expenses
   - Receive notifications

---

## 🔐 Important Notes

1. **Password Requirements:** Minimum 8 characters
2. **Token Expiration:** 7 days
3. **Email Uniqueness:** Each email can only be used once
4. **Company Assignment:** Users are automatically assigned to the admin's company
5. **Manager Requirement:** Employees must have a manager assigned

---

## 🐛 Troubleshooting

### Issue: "User already exists"
**Solution:** Use a different email address

### Issue: "Unauthorized"
**Solution:** Make sure you're including the Bearer token in the Authorization header

### Issue: "Cannot find module"
**Solution:** Run `npm install` in the backend directory

### Issue: "MongoDB connection failed"
**Solution:** Check your MONGODB_URI in the .env file

---

## 📞 Need Help?

Check the full documentation in `POSTMAN_API_GUIDE.md` for:
- All 26 API endpoints
- Detailed request/response examples
- Query parameters
- Error handling
- Advanced features

---

## ✅ Checklist

- [ ] Backend server is running (http://localhost:5000)
- [ ] Created admin user via Postman
- [ ] Received and saved the token
- [ ] Tested login endpoint
- [ ] Created at least one manager
- [ ] Created at least one employee
- [ ] Ready to build the frontend!

---

**Next Steps:** Start building the Admin Dashboard UI! 🎨
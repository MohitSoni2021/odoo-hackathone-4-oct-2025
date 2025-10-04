# 🚀 Create Your First Admin User

## Step-by-Step Guide with Postman

---

## 📋 Prerequisites

✅ Backend server running at `http://localhost:5000`
✅ Postman installed (or use any API client)

---

## 🎯 Step 1: Open Postman

Launch Postman application on your computer.

---

## 🎯 Step 2: Create New Request

1. Click **"New"** or **"+"** to create a new request
2. Select **"HTTP Request"**

---

## 🎯 Step 3: Configure Request

### Method
Select: **POST**

### URL
```
http://localhost:5000/api/admin/create-admin
```

### Headers
Click on **"Headers"** tab and add:

| Key | Value |
|-----|-------|
| Content-Type | application/json |

### Body
1. Click on **"Body"** tab
2. Select **"raw"**
3. Select **"JSON"** from the dropdown
4. Paste this JSON:

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

---

## 🎯 Step 4: Send Request

Click the blue **"Send"** button.

---

## ✅ Step 5: Check Response

You should see a **200 OK** response with this structure:

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OGE...",
  "data": {
    "user": {
      "_id": "678a1234567890abcdef1234",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@company.com",
      "role": "admin",
      "country": "United States",
      "currency": "USD",
      "isActive": true,
      "company": {
        "_id": "678a1234567890abcdef5678",
        "name": "Acme Corporation",
        "country": "United States",
        "currency": "USD"
      },
      "createdAt": "2025-01-17T10:30:00.000Z"
    }
  }
}
```

---

## 🎉 Success!

Your admin user has been created! 

**Important**: Copy and save the **token** from the response. You'll need it for API testing.

---

## 🔐 Your Login Credentials

Now you can login to the frontend with:

- **Email**: `admin@company.com`
- **Password**: `admin123456`

---

## 🌐 Step 6: Login to Frontend

1. Open your browser
2. Go to: `http://localhost:3000`
3. Enter your credentials:
   - Email: `admin@company.com`
   - Password: `admin123456`
4. Click **"Sign In"**

You'll be redirected to the Admin Dashboard! 🎊

---

## 🔄 Alternative: Create Test Data

If you want to create a complete test environment with multiple users and expenses, use this endpoint instead:

### Method
**POST**

### URL
```
http://localhost:5000/api/admin/create-test-data
```

### Body
```json
{
  "companyName": "Test Company",
  "country": "United States"
}
```

This will create:
- ✅ 1 Admin (admin@test.com / admin123456)
- ✅ 2 Managers (manager1@test.com, manager2@test.com / manager123456)
- ✅ 3 Employees (employee1@test.com, employee2@test.com, employee3@test.com / employee123456)
- ✅ 10 Sample Expenses

---

## 🐛 Troubleshooting

### Error: "Cannot connect"
**Solution**: Make sure backend server is running
```bash
cd backend
npm run dev
```

### Error: "User already exists"
**Solution**: Use a different email or delete the existing user

### Error: "Validation error"
**Solution**: Check all required fields are filled:
- firstName (required)
- lastName (required)
- email (required, valid email format)
- password (required, min 8 characters)
- country (required)
- companyName (required)

---

## 📝 Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| firstName | String | Yes | Admin's first name |
| lastName | String | Yes | Admin's last name |
| email | String | Yes | Admin's email (must be unique) |
| password | String | Yes | Password (min 8 characters) |
| country | String | Yes | Country name (e.g., "United States") |
| companyName | String | Yes | Your company name |

---

## 🌍 Available Countries

You can use any of these countries:

- United States (USD)
- United Kingdom (GBP)
- Canada (CAD)
- Australia (AUD)
- India (INR)
- Japan (JPY)
- Germany (EUR)
- France (EUR)
- Italy (EUR)
- Spain (EUR)
- Brazil (BRL)
- Mexico (MXN)
- China (CNY)

The currency will be automatically assigned based on the country!

---

## 🎯 Next Steps

After creating your admin user:

1. ✅ Login to frontend (`http://localhost:3000`)
2. ✅ Explore the Admin Dashboard
3. ✅ Create more users (managers, employees)
4. ✅ Create expenses via Postman
5. ✅ Test the approval workflow

---

## 📚 More Information

- **Complete API Guide**: See `POSTMAN_API_GUIDE.md`
- **Frontend Guide**: See `ADMIN_DASHBOARD_GUIDE.md`
- **Quick Reference**: See `POSTMAN_QUICK_REFERENCE.md`

---

## 🎊 You're All Set!

Your admin user is created and you're ready to start using the Expense Management System!

**Happy Managing! 🚀**
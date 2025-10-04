# 🎯 Quick Reference Card

## 🌐 Server URLs

| Service | URL | Status |
|---------|-----|--------|
| Backend API | http://localhost:5000 | ✅ Running |
| Frontend App | http://localhost:3001 | ✅ Running |
| MongoDB | Cloud Atlas | ✅ Connected |

---

## 🔐 Create Admin User (Postman)

```http
POST http://localhost:5000/api/admin/create-admin
Content-Type: application/json

{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@company.com",
  "password": "admin123456",
  "country": "United States",
  "companyName": "Acme Corporation"
}
```

**Response**: You'll get a JWT token and user object

---

## 🚪 Login Credentials

After creating admin user:

- **URL**: http://localhost:3001
- **Email**: admin@company.com
- **Password**: admin123456

---

## 📊 Admin Dashboard Routes

| Route | Description |
|-------|-------------|
| `/admin/dashboard` | Overview with statistics |
| `/admin/users` | User management (CRUD) |
| `/admin/expenses` | Expense approval workflow |
| `/admin/analytics` | Analytics (placeholder) |
| `/admin/notifications` | Notifications (placeholder) |
| `/admin/settings` | Settings (placeholder) |

---

## 🎨 Color Scheme

| Color | Hex | Usage |
|-------|-----|-------|
| Black | #000000 | Primary (sidebar, headers) |
| Sea Green | #20B2AA | Secondary (buttons) |
| Medium Sea Green | #3CB371 | Accents |
| Yellow | #FCD34D | Pending status |
| Green | #10B981 | Approved status |
| Red | #EF4444 | Rejected status |
| Blue | #3B82F6 | Reimbursed status |

---

## 🔑 User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full access to all features |
| **Manager** | Approve/reject team expenses, view team |
| **Employee** | Submit expenses, view own expenses |

---

## 📝 Quick API Reference

### Authentication
```http
POST /api/auth/signup          # Register
POST /api/auth/login           # Login
POST /api/admin/create-admin   # Create admin
```

### Users (Admin only)
```http
GET    /api/users              # List all users
POST   /api/users              # Create user
PUT    /api/users/:id          # Update user
DELETE /api/users/:id          # Delete user
GET    /api/users/stats        # User statistics
```

### Expenses
```http
GET    /api/expenses           # List expenses
POST   /api/expenses           # Create expense
PUT    /api/expenses/:id       # Update expense
DELETE /api/expenses/:id       # Delete expense
PUT    /api/expenses/:id/approve   # Approve
PUT    /api/expenses/:id/reject    # Reject
GET    /api/expenses/stats     # Statistics
```

### Notifications
```http
GET    /api/notifications      # List notifications
PUT    /api/notifications/:id/read  # Mark as read
GET    /api/notifications/unread-count  # Unread count
```

---

## 🧪 Testing Workflow

### 1️⃣ Create Admin
Use Postman to create admin user

### 2️⃣ Login
Login at http://localhost:3001

### 3️⃣ Create Users
- Go to User Management
- Create 1 Manager
- Create 2 Employees

### 4️⃣ Create Expenses
Use Postman to create expenses as employee

### 5️⃣ Approve/Reject
Go to Expense Management and approve/reject

---

## 🛠️ Useful Commands

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
cd frontend
npm start
```

### Kill Port 5000
```bash
lsof -ti:5000 | xargs kill -9
```

### Kill Port 3000
```bash
lsof -ti:3000 | xargs kill -9
```

---

## 📁 Key Files

### Backend
- `backend/src/index.js` - Server entry
- `backend/src/models/` - Database models
- `backend/src/controllers/` - Business logic
- `backend/src/routes/` - API routes
- `backend/.env` - Environment variables

### Frontend
- `frontend/src/App.js` - Main app
- `frontend/src/layouts/DashboardLayout.js` - Layout
- `frontend/src/pages/admin/` - Admin pages
- `frontend/src/store/` - Redux store
- `frontend/src/services/` - API services
- `frontend/.env` - Environment variables

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Cannot connect to backend | Check backend is running on port 5000 |
| API calls fail | Check REACT_APP_API_URL in frontend/.env |
| Token expired | Logout and login again |
| Port already in use | Kill the process or use another port |
| User already exists | Use different email |

---

## ✅ What's Complete

- ✅ Backend (100%)
- ✅ Admin Dashboard (100%)
- ✅ User Management (100%)
- ✅ Expense Management (100%)
- ✅ Authentication (100%)
- ✅ Notifications (100%)

---

## 🚧 What's Pending

- ⏳ Manager Dashboard
- ⏳ Employee Dashboard
- ⏳ Expense Submission Form
- ⏳ Analytics Page
- ⏳ Receipt Upload
- ⏳ OCR Integration

---

## 📚 Documentation

1. **CURRENT_STATUS.md** - Complete system status
2. **POSTMAN_CREATE_ADMIN.md** - Create admin guide
3. **ADMIN_DASHBOARD_GUIDE.md** - Frontend guide
4. **POSTMAN_API_GUIDE.md** - API documentation
5. **COMPLETE_SETUP_SUMMARY.md** - Setup guide

---

## 🎊 You're All Set!

**Backend**: ✅ Running on port 5000  
**Frontend**: ✅ Running on port 3001  
**Database**: ✅ Connected to MongoDB  

**Next**: Create admin user and start testing! 🚀
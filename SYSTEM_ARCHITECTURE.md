# 🏗️ System Architecture

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Browser    │  │   Postman    │  │  Mobile App  │          │
│  │ (React App)  │  │  (Testing)   │  │  (Future)    │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         └──────────────────┴──────────────────┘                  │
│                            │                                      │
│                     HTTP/HTTPS Requests                          │
│                            │                                      │
└────────────────────────────┼──────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Express.js Server (Port 5000)                 │  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │                  Middleware Stack                    │  │  │
│  │  │  • CORS                                              │  │  │
│  │  │  • Body Parser                                       │  │  │
│  │  │  • JWT Authentication                                │  │  │
│  │  │  • Role-Based Access Control                         │  │  │
│  │  │  • Error Handler                                     │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │                   API Routes                         │  │  │
│  │  │                                                       │  │  │
│  │  │  /api/auth/*          → authController               │  │  │
│  │  │  /api/users/*         → userController               │  │  │
│  │  │  /api/expenses/*      → expenseController            │  │  │
│  │  │  /api/notifications/* → notificationController       │  │  │
│  │  │  /api/admin/*         → adminController              │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │                  Controllers                         │  │  │
│  │  │  • Business Logic                                    │  │  │
│  │  │  • Request Validation                                │  │  │
│  │  │  • Response Formatting                               │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                             │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              MongoDB Atlas (Cloud Database)               │  │
│  │                                                             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │
│  │  │    Users     │  │  Companies   │  │   Expenses   │    │  │
│  │  │  Collection  │  │  Collection  │  │  Collection  │    │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │  │
│  │                                                             │  │
│  │  ┌──────────────┐                                          │  │
│  │  │Notifications │                                          │  │
│  │  │  Collection  │                                          │  │
│  │  └──────────────┘                                          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Frontend Architecture (React)

```
┌─────────────────────────────────────────────────────────────────┐
│                      REACT APPLICATION                           │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      App.js (Router)                       │  │
│  │                                                             │  │
│  │  ┌─────────────────┐         ┌─────────────────┐          │  │
│  │  │  Public Routes  │         │ Protected Routes│          │  │
│  │  │  • /login       │         │  • /admin/*     │          │  │
│  │  │  • /signup      │         │  • /manager/*   │          │  │
│  │  └─────────────────┘         │  • /employee/*  │          │  │
│  │                               └─────────────────┘          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Redux Store                             │  │
│  │                                                             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │
│  │  │  authSlice   │  │  userSlice   │  │expenseSlice  │    │  │
│  │  │  • user      │  │  • users     │  │  • expenses  │    │  │
│  │  │  • token     │  │  • stats     │  │  • stats     │    │  │
│  │  │  • isAuth    │  │  • loading   │  │  • loading   │    │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │  │
│  │                                                             │  │
│  │  ┌──────────────┐                                          │  │
│  │  │notification  │                                          │  │
│  │  │    Slice     │                                          │  │
│  │  │• notifications│                                         │  │
│  │  │• unreadCount │                                          │  │
│  │  └──────────────┘                                          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    API Services                            │  │
│  │                                                             │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │  api.js (Axios Instance)                             │ │  │
│  │  │  • Request Interceptor (Add JWT Token)               │ │  │
│  │  │  • Response Interceptor (Handle 401)                 │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  │                                                             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │
│  │  │ userService  │  │expenseService│  │notification  │    │  │
│  │  │  • getAll()  │  │  • getAll()  │  │   Service    │    │  │
│  │  │  • create()  │  │  • create()  │  │  • getAll()  │    │  │
│  │  │  • update()  │  │  • approve() │  │  • markRead()│    │  │
│  │  │  • delete()  │  │  • reject()  │  │  • getCount()│    │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Components                              │  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │              DashboardLayout                         │  │  │
│  │  │  • Sidebar (Navigation)                              │  │  │
│  │  │  • Header (Notifications, Profile)                   │  │  │
│  │  │  • Main Content (Outlet)                             │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │
│  │  │   Pages      │  │    Modals    │  │   Utility    │    │  │
│  │  │• Dashboard   │  │• UserModal   │  │• Protected   │    │  │
│  │  │• UserMgmt    │  │• ExpenseModal│  │  Route       │    │  │
│  │  │• ExpenseMgmt │  │              │  │              │    │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌──────────┐                                    ┌──────────┐
│  Client  │                                    │  Server  │
└────┬─────┘                                    └────┬─────┘
     │                                                │
     │  1. POST /api/auth/login                      │
     │    { email, password }                        │
     ├──────────────────────────────────────────────>│
     │                                                │
     │                                    2. Validate credentials
     │                                       (bcrypt.compare)
     │                                                │
     │                                    3. Generate JWT token
     │                                       (jwt.sign)
     │                                                │
     │  4. Response: { token, user }                 │
     │<──────────────────────────────────────────────┤
     │                                                │
     │  5. Store token in:                           │
     │     • Redux store                             │
     │     • localStorage                            │
     │                                                │
     │  6. All subsequent requests                   │
     │     include token in header:                  │
     │     Authorization: Bearer <token>             │
     ├──────────────────────────────────────────────>│
     │                                                │
     │                                    7. Verify token
     │                                       (jwt.verify)
     │                                                │
     │                                    8. Check user role
     │                                       (roleCheck middleware)
     │                                                │
     │  9. Response: { data }                        │
     │<──────────────────────────────────────────────┤
     │                                                │
```

---

## 📊 Data Flow - Expense Approval

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Employee │     │  Manager │     │  Backend │     │ Database │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                 │                 │
     │ 1. Submit      │                 │                 │
     │    Expense     │                 │                 │
     ├───────────────────────────────────>                │
     │                │                 │                 │
     │                │     2. Create expense             │
     │                │        document                   │
     │                │                 ├────────────────>│
     │                │                 │                 │
     │                │     3. Create notification        │
     │                │        for manager                │
     │                │                 ├────────────────>│
     │                │                 │                 │
     │                │  4. Notification                  │
     │                │     (auto-poll)                   │
     │                │<────────────────┤                 │
     │                │                 │                 │
     │                │ 5. View expense │                 │
     │                │    details      │                 │
     │                ├────────────────>│                 │
     │                │                 │                 │
     │                │ 6. Approve      │                 │
     │                │    expense      │                 │
     │                ├────────────────>│                 │
     │                │                 │                 │
     │                │     7. Update expense status      │
     │                │                 ├────────────────>│
     │                │                 │                 │
     │                │     8. Create notification        │
     │                │        for employee               │
     │                │                 ├────────────────>│
     │                │                 │                 │
     │  9. Notification                 │                 │
     │     (auto-poll)                  │                 │
     │<─────────────────────────────────┤                 │
     │                │                 │                 │
```

---

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['admin', 'manager', 'employee']),
  company: ObjectId (ref: 'Company'),
  manager: ObjectId (ref: 'User'),
  country: String,
  currency: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Companies Collection
```javascript
{
  _id: ObjectId,
  name: String,
  country: String,
  currency: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Expenses Collection
```javascript
{
  _id: ObjectId,
  title: String,
  amount: Number,
  category: String,
  description: String,
  date: Date,
  receipt: String (URL),
  status: String (enum: ['pending', 'approved', 'rejected', 'reimbursed']),
  submittedBy: ObjectId (ref: 'User'),
  company: ObjectId (ref: 'Company'),
  approvedBy: ObjectId (ref: 'User'),
  rejectedBy: ObjectId (ref: 'User'),
  rejectionReason: String,
  approvedAt: Date,
  rejectedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Notifications Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User'),
  type: String (enum: ['expense_submitted', 'expense_approved', 'expense_rejected']),
  message: String,
  relatedExpense: ObjectId (ref: 'Expense'),
  isRead: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 Redux State Structure

```javascript
{
  auth: {
    user: {
      _id: String,
      firstName: String,
      lastName: String,
      email: String,
      role: String,
      company: Object,
      currency: String
    },
    token: String,
    isAuthenticated: Boolean,
    loading: Boolean,
    error: String
  },
  
  users: {
    users: Array,
    stats: {
      totalUsers: Number,
      activeUsers: Number,
      inactiveUsers: Number,
      adminCount: Number,
      managerCount: Number,
      employeeCount: Number
    },
    loading: Boolean,
    error: String
  },
  
  expenses: {
    expenses: Array,
    stats: {
      totalExpenses: Number,
      pendingCount: Number,
      approvedCount: Number,
      rejectedCount: Number,
      totalAmount: Number,
      categoryBreakdown: Array
    },
    loading: Boolean,
    error: String
  },
  
  notifications: {
    notifications: Array,
    unreadCount: Number,
    loading: Boolean,
    error: String
  }
}
```

---

## 🛣️ API Endpoint Structure

### Authentication Endpoints
```
POST   /api/auth/signup              - Register new user
POST   /api/auth/login               - Login user
POST   /api/admin/create-admin       - Create admin user
POST   /api/admin/create-test-data   - Create test data
```

### User Endpoints (Protected)
```
GET    /api/users                    - Get all users (Admin)
GET    /api/users/stats              - Get user statistics (Admin)
GET    /api/users/employees          - Get all employees (Manager/Admin)
GET    /api/users/:id                - Get user by ID
POST   /api/users                    - Create user (Admin)
PUT    /api/users/:id                - Update user (Admin)
DELETE /api/users/:id                - Delete user (Admin)
PUT    /api/users/:id/assign-manager - Assign manager (Admin)
```

### Expense Endpoints (Protected)
```
GET    /api/expenses                 - Get all expenses (role-based)
GET    /api/expenses/stats           - Get expense statistics
GET    /api/expenses/pending-count   - Get pending count
GET    /api/expenses/:id             - Get expense by ID
POST   /api/expenses                 - Create expense (Employee)
PUT    /api/expenses/:id             - Update expense (Owner)
DELETE /api/expenses/:id             - Delete expense (Owner)
PUT    /api/expenses/:id/approve     - Approve expense (Manager/Admin)
PUT    /api/expenses/:id/reject      - Reject expense (Manager/Admin)
```

### Notification Endpoints (Protected)
```
GET    /api/notifications            - Get user notifications
GET    /api/notifications/unread-count - Get unread count
PUT    /api/notifications/:id/read   - Mark as read
PUT    /api/notifications/mark-all-read - Mark all as read
DELETE /api/notifications/:id        - Delete notification
```

---

## 🔒 Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                      Security Layers                             │
│                                                                   │
│  Layer 1: CORS                                                   │
│  ├─ Allow only specific origins                                  │
│  └─ Prevent unauthorized cross-origin requests                   │
│                                                                   │
│  Layer 2: JWT Authentication                                     │
│  ├─ Token-based authentication                                   │
│  ├─ Token expiration (30 days)                                   │
│  └─ Token verification on each request                           │
│                                                                   │
│  Layer 3: Role-Based Access Control                              │
│  ├─ Admin: Full access                                           │
│  ├─ Manager: Team management + approval                          │
│  └─ Employee: Own expenses only                                  │
│                                                                   │
│  Layer 4: Password Security                                      │
│  ├─ bcrypt hashing (10 rounds)                                   │
│  ├─ Minimum 8 characters                                         │
│  └─ Never store plain text passwords                             │
│                                                                   │
│  Layer 5: Input Validation                                       │
│  ├─ Mongoose schema validation                                   │
│  ├─ Request body validation                                      │
│  └─ Sanitize user inputs                                         │
│                                                                   │
│  Layer 6: Error Handling                                         │
│  ├─ Global error handler                                         │
│  ├─ Never expose sensitive data                                  │
│  └─ Log errors for debugging                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 Component Hierarchy

```
App.js
├── Public Routes
│   ├── Login.js
│   └── Signup.js
│
└── Protected Routes (ProtectedRoute.js)
    └── DashboardLayout.js
        ├── Sidebar
        │   ├── Logo
        │   ├── Navigation (role-based)
        │   ├── Notification Badge
        │   └── User Profile
        │
        └── Main Content (Outlet)
            │
            ├── Admin Routes (role: admin)
            │   ├── AdminDashboard.js
            │   │   ├── Statistics Cards
            │   │   ├── User Distribution
            │   │   ├── Top Categories
            │   │   └── Quick Actions
            │   │
            │   ├── UserManagement.js
            │   │   ├── Search & Filters
            │   │   ├── User Table
            │   │   ├── UserModal (Create/Edit)
            │   │   └── Delete Confirmation
            │   │
            │   └── ExpenseManagement.js
            │       ├── Search & Filters
            │       ├── Expense Table
            │       ├── ExpenseDetailModal
            │       └── Approve/Reject Actions
            │
            ├── Manager Routes (role: manager) [PENDING]
            │   ├── ManagerDashboard.js
            │   ├── TeamExpenses.js
            │   └── TeamMembers.js
            │
            └── Employee Routes (role: employee) [PENDING]
                ├── EmployeeDashboard.js
                ├── SubmitExpense.js
                └── MyExpenses.js
```

---

## 🔄 Request/Response Flow

### Example: Approve Expense

```
1. User Action
   └─> Click "Approve" button in ExpenseManagement.js

2. Component Dispatch
   └─> dispatch(approveExpense(expenseId))

3. Redux Thunk
   └─> expenseSlice.js → approveExpense async thunk

4. API Service Call
   └─> expenseService.approve(expenseId)

5. Axios Request
   └─> PUT /api/expenses/:id/approve
       Headers: { Authorization: Bearer <token> }

6. Backend Middleware
   ├─> auth.js → Verify JWT token
   └─> roleCheck.js → Check role (manager/admin)

7. Controller
   └─> expenseController.approveExpense()
       ├─> Find expense
       ├─> Update status to 'approved'
       ├─> Set approvedBy and approvedAt
       ├─> Create notification for employee
       └─> Save to database

8. Database
   └─> MongoDB → Update expense document

9. Response
   └─> { status: 'success', data: { expense } }

10. Redux State Update
    └─> expenseSlice → Update expenses array

11. Component Re-render
    └─> ExpenseManagement.js → Show updated status

12. Toast Notification
    └─> "Expense approved successfully!"
```

---

## 🎯 Technology Stack Summary

### Backend
- **Runtime**: Node.js v23.10.0
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Cloud)
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password**: bcrypt
- **Environment**: dotenv
- **Dev Tool**: nodemon

### Frontend
- **Framework**: React.js 18
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Build Tool**: Create React App

### Development Tools
- **API Testing**: Postman
- **Version Control**: Git
- **Code Editor**: VS Code
- **Package Manager**: npm

---

## 📊 Performance Considerations

### Backend Optimizations
- ✅ Database indexing on frequently queried fields
- ✅ Pagination for large datasets (ready to implement)
- ✅ Efficient MongoDB queries with population
- ✅ Error handling to prevent crashes
- ⏳ Caching for frequently accessed data (future)
- ⏳ Rate limiting to prevent abuse (future)

### Frontend Optimizations
- ✅ Redux for centralized state management
- ✅ Lazy loading for routes (ready to implement)
- ✅ Memoization for expensive computations
- ✅ Debouncing for search inputs
- ⏳ Virtual scrolling for large lists (future)
- ⏳ Image optimization for receipts (future)

---

## 🚀 Deployment Architecture (Future)

```
┌─────────────────────────────────────────────────────────────────┐
│                         Production                               │
│                                                                   │
│  ┌──────────────┐         ┌──────────────┐                      │
│  │   Frontend   │         │   Backend    │                      │
│  │   (Vercel/   │         │   (Heroku/   │                      │
│  │   Netlify)   │         │   Railway)   │                      │
│  └──────┬───────┘         └──────┬───────┘                      │
│         │                        │                               │
│         │                        │                               │
│         │                        ▼                               │
│         │              ┌──────────────┐                          │
│         │              │   MongoDB    │                          │
│         │              │    Atlas     │                          │
│         │              └──────────────┘                          │
│         │                                                         │
│         ▼                                                         │
│  ┌──────────────┐                                                │
│  │     CDN      │                                                │
│  │  (Cloudflare)│                                                │
│  └──────────────┘                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📈 Scalability Considerations

### Horizontal Scaling
- Load balancer for multiple backend instances
- Stateless backend (JWT tokens)
- Database replication for read scaling

### Vertical Scaling
- Increase server resources as needed
- MongoDB Atlas auto-scaling
- CDN for static assets

### Future Enhancements
- Microservices architecture
- Message queue for async tasks
- Redis for caching
- WebSocket server for real-time updates

---

**This architecture is production-ready and scalable!** 🚀
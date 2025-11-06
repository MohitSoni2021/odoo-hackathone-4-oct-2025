import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import TeamMembers from './pages/manager/TeamMembers';
import PendingApprovals from './pages/manager/PendingApprovals';
import ManagerAnalytics from './pages/manager/ManagerAnalytics';
import UserManagement from './pages/admin/UserManagement';
import CreateUser from './pages/admin/CreateUser';
import ExpenseManagement from './pages/admin/ExpenseManagement';
import ManagerApprovedExpenses from './pages/admin/ManagerApprovedExpenses';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import MyExpenses from './pages/employee/MyExpenses';
import SubmitExpense from './pages/employee/SubmitExpense';
import EditExpense from './pages/employee/EditExpense';
import ExpenseDetail from './pages/employee/ExpenseDetail';
import ProtectedRoute from './components/ProtectedRoute';

// Role-based dashboard component
const RoleDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  } else if (user?.role === 'manager') {
    return <ManagerDashboard />;
  } else if (user?.role === 'employee') {
    return <EmployeeDashboard />;
  } else {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {user?.firstName}!</h2>
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }
};

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Role-based dashboard index */}
            <Route index element={<RoleDashboard />} />
            
            {/* Admin-only routes */}
            <Route
              path="users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="users/new"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CreateUser />
                </ProtectedRoute>
              }
            />
            
            {/* Manager-only routes */}
            <Route
              path="team"
              element={
                <ProtectedRoute allowedRoles={['manager', 'admin']}>
                  <TeamMembers />
                </ProtectedRoute>
              }
            />
            <Route
              path="pending-approvals"
              element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <PendingApprovals />
                </ProtectedRoute>
              }
            />
            <Route
              path="manager-analytics"
              element={
                <ProtectedRoute allowedRoles={['manager', 'admin']}>
                  <ManagerAnalytics />
                </ProtectedRoute>
              }
            />
            
            {/* Employee routes */}
            <Route
              path="expenses"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <MyExpenses />
                </ProtectedRoute>
              }
            />
            <Route
              path="expenses/submit"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <SubmitExpense />
                </ProtectedRoute>
              }
            />
            <Route
              path="expenses/edit/:id"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <EditExpense />
                </ProtectedRoute>
              }
            />
            <Route
              path="expenses/:id"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <ExpenseDetail />
                </ProtectedRoute>
              }
            />
            
            {/* Admin/Manager expense routes */}
            <Route
              path="manage-expenses"
              element={
                <ProtectedRoute allowedRoles={['admin', 'manager']}>
                  <ExpenseManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="pending-approval"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManagerApprovedExpenses />
                </ProtectedRoute>
              }
            />
            
            {/* Shared routes */}
            <Route path="analytics" element={<div className="text-center py-12 text-gray-500">Analytics page coming soon...</div>} />
            <Route path="notifications" element={<div className="text-center py-12 text-gray-500">Notifications page coming soon...</div>} />
            <Route path="settings" element={<div className="text-center py-12 text-gray-500">Settings page coming soon...</div>} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
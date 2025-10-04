import React from 'react';
import { useSelector } from 'react-redux';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManagerDashboard from '../pages/manager/ManagerDashboard';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  } else if (user?.role === 'manager') {
    return <ManagerDashboard />;
  } else {
    // For employees or any other role, show a basic dashboard
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to ExpenseTracker</h1>
        <p className="text-gray-600">Your expense management dashboard</p>
      </div>
    );
  }
};

export default Dashboard;
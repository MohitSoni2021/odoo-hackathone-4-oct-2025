import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserStats } from '../../store/slices/userSlice';
import { fetchExpenseStats } from '../../store/slices/expenseSlice';
import { useCurrency } from '../../hooks/useCurrency';
import CurrencySelector from '../../components/CurrencySelector';
import {
  UsersIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats: userStats, loading: userLoading } = useSelector((state) => state.users);
  const { stats: expenseStats, loading: expenseLoading } = useSelector((state) => state.expenses);
  const { user } = useSelector((state) => state.auth);
  const { formatAmount } = useCurrency();

  useEffect(() => {
    dispatch(fetchUserStats());
    dispatch(fetchExpenseStats());
  }, [dispatch]);

  const statsCards = [
    { name: 'Total Users',       value: userStats?.totalUsers || 0,          icon: UsersIcon,         color: 'bg-indigo-500',  link: '/dashboard/users' },
    { name: 'Total Expenses',    value: expenseStats?.totalExpenses || 0,    icon: DocumentTextIcon,  color: 'bg-purple-500',  link: '/dashboard/manage-expenses' },
    { name: 'Pending',           value: expenseStats?.byStatus?.pending || 0,icon: ClockIcon,         color: 'bg-amber-500',   link: '/dashboard/manage-expenses?status=pending' },
    { name: 'Approved',         value: expenseStats?.byStatus?.approved || 0,icon: CheckBadgeIcon,    color: 'bg-emerald-500', link: '/dashboard/manage-expenses?status=approved' },
    { name: 'Rejected',          value: expenseStats?.byStatus?.rejected || 0,icon: XCircleIcon,       color: 'bg-red-500',     link: '/dashboard/manage-expenses?status=rejected' },
    { name: 'Total Amount',      value: formatAmount(expenseStats?.totalAmount || 0), icon: CurrencyDollarIcon, color: 'bg-teal-600', link: '/dashboard/analytics' },
  ];

  const topCategories = expenseStats?.byCategory
    ? [...expenseStats.byCategory].sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 5)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-2 border-gray-400 rounded-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Small Logo */}
              <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Welcome back, {user?.firstName}
                </h1>
                <p className="text-sm text-gray-500">Expense system overview</p>
              </div>
            </div>
            <CurrencySelector />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid – Solid Colors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {statsCards.map((stat) => (
            <Link
              key={stat.name}
              to={stat.link}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                    {stat.name}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Two Columns */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Distribution */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">User Distribution</h3>
            {userLoading ? (
              <div className="py-10 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-teal-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { role: 'Admins',     count: userStats?.byRole?.admin || 0,     bg: 'bg-red-100',     text: 'text-red-700' },
                  { role: 'Managers',   count: userStats?.byRole?.manager || 0,   bg: 'bg-blue-100',    text: 'text-blue-700' },
                  { role: 'Employees',  count: userStats?.byRole?.employee || 0,  bg: 'bg-emerald-100', text: 'text-emerald-700' },
                ].map((item) => (
                  <div key={item.role} className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{item.role}</span>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${item.bg} ${item.text}`}>
                        {item.count}
                      </span>
                      <span className="text-sm text-gray-500">
                        {((item.count / (userStats?.totalUsers || 1)) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}

                <div className="border-t border-gray-200 pt-4 mt-5 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active</span>
                    <span className="font-bold text-emerald-600 text-lg">{userStats?.activeUsers || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Inactive</span>
                    <span className="font-bold text-gray-400 text-lg">{userStats?.inactiveUsers || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Top Categories</h3>
            {expenseLoading ? (
              <div className="py-10 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-teal-600"></div>
              </div>
            ) : topCategories.length > 0 ? (
              <div className="space-y-4">
                {topCategories.map((cat, i) => (
                  <div key={cat._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{cat._id}</p>
                        <p className="text-xs text-gray-500">{cat.count} expenses</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">
                      {formatAmount(cat.totalAmount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-10">No expenses yet</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              to="/dashboard/users/new"
              className="flex flex-col items-center justify-center py-6 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
            >
              <PlusIcon className="h-7 w-7 mb-2" />
              <span className="text-sm font-medium">Add User</span>
            </Link>

            <Link
              to="/dashboard/expenses?status=pending"
              className="flex flex-col items-center justify-center py-6 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <ClockIcon className="h-7 w-7 mb-2 text-amber-600" />
              <span className="text-sm font-medium text-gray-700">Review Pending</span>
            </Link>

            <Link
              to="/dashboard/analytics"
              className="flex flex-col items-center justify-center py-6 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <ChartBarIcon className="h-7 w-7 mb-2 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">View Reports</span>
            </Link>

            <Link
              to="/dashboard/settings"
              className="flex flex-col items-center justify-center py-6 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <UsersIcon className="h-7 w-7 mb-2 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
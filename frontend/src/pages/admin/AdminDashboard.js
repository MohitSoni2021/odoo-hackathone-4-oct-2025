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
  ArrowUpRightIcon,
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
    { name: 'Total Users',       value: userStats?.totalUsers || 0,          icon: UsersIcon,         color: 'bg-info',  link: '/dashboard/users' },
    { name: 'Total Expenses',    value: expenseStats?.totalExpenses || 0,    icon: DocumentTextIcon,  color: 'bg-primary',  link: '/dashboard/manage-expenses' },
    { name: 'Pending',           value: expenseStats?.byStatus?.pending || 0,icon: ClockIcon,         color: 'bg-warning',   link: '/dashboard/manage-expenses?status=pending' },
    { name: 'Approved',         value: expenseStats?.byStatus?.approved || 0,icon: CheckBadgeIcon,    color: 'bg-success', link: '/dashboard/manage-expenses?status=approved' },
    { name: 'Rejected',          value: expenseStats?.byStatus?.rejected || 0,icon: XCircleIcon,       color: 'bg-error',     link: '/dashboard/manage-expenses?status=rejected' },
    { name: 'Total Amount',      value: formatAmount(expenseStats?.totalAmount || 0), icon: CurrencyDollarIcon, color: 'bg-accent', link: '/dashboard/analytics' },
  ];

  const topCategories = expenseStats?.byCategory
    ? [...expenseStats.byCategory].sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 5)
    : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-surface rounded-3xl shadow-premium border border-border p-8 md:p-10 transition-all hover:shadow-premium-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-premium transform hover:rotate-12 transition-transform">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <div>
              <h1 className="text-h-xl font-bold text-text-primary tracking-tight">
                Welcome back, {user?.firstName}
              </h1>
              <p className="text-body text-text-muted">Comprehensive administrative overview</p>
            </div>
          </div>
          <div className="bg-secondary p-4 rounded-2xl border border-border">
            <CurrencySelector />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statsCards.map((stat) => (
          <Link
            key={stat.name}
            to={stat.link}
            className="group bg-surface rounded-2xl border border-border p-6 shadow-premium hover:shadow-premium-lg hover:border-accent/30 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <ArrowUpRightIcon className="h-4 w-4 text-text-muted group-hover:text-accent transition-colors" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">
                {stat.name}
              </p>
              <h3 className="text-2xl font-bold text-text-primary">{stat.value}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Distribution */}
        <div className="bg-surface rounded-3xl border border-border p-8 shadow-premium hover:shadow-premium-lg transition-all">
          <h3 className="text-h-m font-bold text-text-primary mb-8">User Distribution</h3>
          {userLoading ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-border border-t-accent"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {[
                { role: 'Admins',     count: userStats?.byRole?.admin || 0,     color: 'bg-error',     textColor: 'text-error' },
                { role: 'Managers',   count: userStats?.byRole?.manager || 0,   color: 'bg-info',    textColor: 'text-info' },
                { role: 'Employees',  count: userStats?.byRole?.employee || 0,  color: 'bg-success', textColor: 'text-success' },
              ].map((item) => (
                <div key={item.role} className="group flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-text-primary">{item.role}</span>
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-1 rounded-xl text-small font-bold ${item.color} bg-opacity-10 ${item.textColor}`}>
                        {item.count}
                      </span>
                      <span className="text-small font-bold text-text-muted">
                        {((item.count / (userStats?.totalUsers || 1)) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${(item.count / (userStats?.totalUsers || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4 mt-10 pt-8 border-t border-border">
                <div className="p-4 bg-secondary rounded-2xl">
                  <span className="text-small font-bold text-text-muted uppercase block mb-1">Active</span>
                  <span className="text-2xl font-bold text-success">{userStats?.activeUsers || 0}</span>
                </div>
                <div className="p-4 bg-secondary rounded-2xl">
                  <span className="text-small font-bold text-text-muted uppercase block mb-1">Inactive</span>
                  <span className="text-2xl font-bold text-text-muted">{userStats?.inactiveUsers || 0}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Top Categories */}
        <div className="bg-surface rounded-3xl border border-border p-8 shadow-premium hover:shadow-premium-lg transition-all">
          <h3 className="text-h-m font-bold text-text-primary mb-8">Top Expense Categories</h3>
          {expenseLoading ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-border border-t-accent"></div>
            </div>
          ) : topCategories.length > 0 ? (
            <div className="space-y-6">
              {topCategories.map((cat, i) => (
                <div key={cat._id} className="group flex items-center justify-between p-3 rounded-2xl hover:bg-secondary transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-bold shadow-premium group-hover:scale-110 transition-transform">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-bold text-text-primary">{cat._id}</p>
                      <p className="text-small text-text-muted">{cat.count} transactions</p>
                    </div>
                  </div>
                  <span className="font-bold text-text-primary text-lg">
                    {formatAmount(cat.totalAmount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-text-muted italic bg-secondary rounded-2xl border border-dashed border-border">
              No expense data available
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface rounded-3xl border border-border p-8 shadow-premium">
        <h3 className="text-h-m font-bold text-text-primary mb-8">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/dashboard/users/new"
            className="group flex flex-col items-center justify-center py-8 bg-accent text-white rounded-2xl hover:bg-accent-dark shadow-premium hover:shadow-premium-lg transition-all transform hover:-translate-y-1"
          >
            <PlusIcon className="h-8 w-8 mb-3 group-hover:rotate-90 transition-transform" />
            <span className="text-body font-bold">Add New User</span>
          </Link>

          <Link
            to="/dashboard/manage-expenses?status=pending"
            className="group flex flex-col items-center justify-center py-8 bg-secondary rounded-2xl hover:bg-border transition-all transform hover:-translate-y-1"
          >
            <ClockIcon className="h-8 w-8 mb-3 text-warning group-hover:scale-110 transition-transform" />
            <span className="text-body font-bold text-text-primary">Review Pending</span>
          </Link>

          <Link
            to="/dashboard/analytics"
            className="group flex flex-col items-center justify-center py-8 bg-secondary rounded-2xl hover:bg-border transition-all transform hover:-translate-y-1"
          >
            <ChartBarIcon className="h-8 w-8 mb-3 text-info group-hover:scale-110 transition-transform" />
            <span className="text-body font-bold text-text-primary">Global Reports</span>
          </Link>

          <Link
            to="/dashboard/settings"
            className="group flex flex-col items-center justify-center py-8 bg-secondary rounded-2xl hover:bg-border transition-all transform hover:-translate-y-1"
          >
            <UsersIcon className="h-8 w-8 mb-3 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-body font-bold text-text-primary">System Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
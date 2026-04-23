import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchExpenseStats } from '../../store/slices/expenseSlice';
import { fetchMyTeam } from '../../store/slices/userSlice';
import { useCurrency } from '../../hooks/useCurrency';
import CurrencySelector from '../../components/CurrencySelector';
import {
  UsersIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const { stats: expenseStats, loading: expenseLoading } = useSelector((state) => state.expenses);
  const { team, loading: teamLoading } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);
  const { formatAmount } = useCurrency();

  useEffect(() => {
    dispatch(fetchExpenseStats());
    dispatch(fetchMyTeam());
  }, [dispatch]);

  const statsCards = [
    {
      name: 'Team Size',
      value: team?.length || 0,
      icon: UsersIcon,
      color: 'bg-blue-500',
      link: '/dashboard/expenses',
    },
    {
      name: 'Total Expenses',
      value: expenseStats?.totalExpenses || 0,
      icon: DocumentTextIcon,
      color: 'bg-purple-500',
      link: '/dashboard/expenses',
    },
    {
      name: 'Pending Approval',
      value: expenseStats?.statusStats?.find(s => s._id === 'pending')?.count || 0,
      icon: ClockIcon,
      color: 'bg-yellow-500',
      link: '/dashboard/pending-approvals',
    },
    {
      name: 'Approved',
      value: expenseStats?.statusStats?.find(s => s._id === 'approved')?.count || 0,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      link: '/dashboard/expenses?status=approved',
    },
    {
      name: 'Rejected',
      value: expenseStats?.statusStats?.find(s => s._id === 'rejected')?.count || 0,
      icon: XCircleIcon,
      color: 'bg-red-500',
      link: '/dashboard/expenses?status=rejected',
    },
    {
      name: 'Total Amount',
      value: formatAmount(expenseStats?.totalAmount || 0),
      icon: CurrencyDollarIcon,
      color: 'bg-teal-500',
      link: '/dashboard/manager-analytics',
    },
  ];

  const topCategories = expenseStats?.categoryStats?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg shadow-lg p-6 text-white">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="mt-2 text-teal-100">
              Here's what's happening with your team's expenses today.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <CurrencySelector showLabel={true} compact={false} />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((stat) => (
          <Link
            key={stat.name}
            to={stat.link}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow hover:shadow-lg transition-shadow sm:px-6 sm:py-6"
          >
            <dt>
              <div className={`absolute rounded-md ${stat.color} p-3`}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </dd>
          </Link>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Team Members */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              My Team
            </h3>
            <Link
              to="/dashboard/team"
              className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center"
            >
              View All
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          {teamLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : team && team.length > 0 ? (
            <div className="space-y-4">
              {team.slice(0, 5).map((member) => (
                <div key={member._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-100 text-teal-600 font-bold">
                      {member.firstName?.[0]}{member.lastName?.[0]}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {member.role}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">
                      {formatAmount(member.totalExpenseAmount || 0)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {member.totalExpenses || 0} expenses
                    </div>
                  </div>
                </div>
              ))}
              {team.length > 5 && (
                <div className="pt-2 border-t border-gray-200">
                  <Link
                    to="/dashboard/team"
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center justify-center"
                  >
                    View {team.length - 5} more members
                    <svg
                      className="ml-1 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No team members found
            </div>
          )}
        </div>

        {/* Top Expense Categories */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Expense Categories
          </h3>
          {expenseLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : topCategories.length > 0 ? (
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={category._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-600 font-bold text-sm">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {category._id}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">
                      {formatAmount(category.totalAmount)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {category.count} expenses
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No expense data available
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Quick Actions
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/dashboard/expenses"
            className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            View Expenses
          </Link>
          <Link
            to="/dashboard/pending-approvals"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ClockIcon className="h-5 w-5 mr-2" />
            Review Pending
          </Link>
          <Link
            to="/dashboard/manager-analytics"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            View Analytics
          </Link>
          <Link
            to="/dashboard/settings"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <UsersIcon className="h-5 w-5 mr-2" />
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
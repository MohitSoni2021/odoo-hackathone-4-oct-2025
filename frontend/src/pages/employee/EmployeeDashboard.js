import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchExpenses } from '../../store/slices/expenseSlice';
import { useCurrency } from '../../hooks/useCurrency';
import CurrencySelector from '../../components/CurrencySelector';
import {
  CurrencyDollarIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusCircleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { expenses, loading } = useSelector((state) => state.expenses);
  const { userCurrency, formatAmount, formatExpenseAmount } = useCurrency();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalAmount: 0,
    approvedAmount: 0,
  });

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  useEffect(() => {
    if (expenses && expenses.length > 0) {
      const pending = expenses.filter((e) => e.status === 'pending');
      const approved = expenses.filter((e) => e.status === 'approved');
      const rejected = expenses.filter((e) => e.status === 'rejected');
      
      // Use displayAmount if available (converted), otherwise use original amount
      const totalAmount = expenses.reduce((sum, e) => sum + (e.displayAmount !== undefined ? e.displayAmount : e.amount || 0), 0);
      const approvedAmount = approved.reduce((sum, e) => sum + (e.displayAmount !== undefined ? e.displayAmount : e.amount || 0), 0);

      setStats({
        total: expenses.length,
        pending: pending.length,
        approved: approved.length,
        rejected: rejected.length,
        totalAmount,
        approvedAmount,
      });
    }
  }, [expenses]);

  const statCards = [
    {
      name: 'Total Expenses',
      value: stats.total,
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Pending',
      value: stats.pending,
      icon: ClockIcon,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      name: 'Approved',
      value: stats.approved,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Rejected',
      value: stats.rejected,
      icon: XCircleIcon,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  const recentExpenses = expenses?.slice(0, 5) || [];

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      reimbursed: 'bg-blue-100 text-blue-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg shadow-lg p-6 text-white">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-teal-100 mb-4">
              Track your expenses and manage your claims all in one place.
            </p>
            <Link
              to="/dashboard/expenses/submit"
              className="inline-flex items-center px-4 py-2 bg-white text-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Submit New Expense
            </Link>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <CurrencySelector showLabel={true} compact={false} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.bgColor} rounded-md p-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Amount Summary */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-50 rounded-md p-3">
                <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Amount Claimed
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {formatAmount(stats.totalAmount)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-teal-50 rounded-md p-3">
                <ChartBarIcon className="h-6 w-6 text-teal-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Approved Amount
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {formatAmount(stats.approvedAmount)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Expenses
          </h2>
          <Link
            to="/dashboard/expenses"
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          {recentExpenses.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No expenses yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by submitting your first expense claim.
              </p>
              <div className="mt-6">
                <Link
                  to="/dashboard/expenses/submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" />
                  Submit Expense
                </Link>
              </div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentExpenses.map((expense) => (
                  <tr
                    key={expense._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/dashboard/expenses/${expense._id}`)
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {expense.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {expense.description?.substring(0, 50)}
                        {expense.description?.length > 50 ? '...' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {expense.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatExpenseAmount(expense)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                          expense.status
                        )}`}
                      >
                        {expense.status.charAt(0).toUpperCase() +
                          expense.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            to="/dashboard/expenses/submit"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors"
          >
            <PlusCircleIcon className="h-8 w-8 text-teal-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Submit Expense</div>
              <div className="text-sm text-gray-500">Create new claim</div>
            </div>
          </Link>

          <Link
            to="/dashboard/expenses"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors"
          >
            <DocumentTextIcon className="h-8 w-8 text-teal-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">View Expenses</div>
              <div className="text-sm text-gray-500">Track your claims</div>
            </div>
          </Link>

          <Link
            to="/dashboard/notifications"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors"
          >
            <CheckCircleIcon className="h-8 w-8 text-teal-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Notifications</div>
              <div className="text-sm text-gray-500">Check updates</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
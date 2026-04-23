import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { useCurrency } from '../../hooks/useCurrency';
import api from '../../services/api';

const ManagerAnalytics = () => {
  const { user } = useSelector((state) => state.auth);
  const { formatAmount, formatExpenseAmount } = useCurrency();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/expenses/manager-analytics');
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = (type) => {
    // Prepare CSV data
    let csvContent = '';
    
    if (type === 'monthly') {
      csvContent = 'Month,Year,Total Amount,Count\n';
      analytics.monthlyTrends.forEach(item => {
        csvContent += `${item._id.month},${item._id.year},${item.totalAmount},${item.count}\n`;
      });
    } else if (type === 'category') {
      csvContent = 'Category,Total Amount,Count\n';
      analytics.categoryBreakdown.forEach(item => {
        csvContent += `${item._id},${item.totalAmount},${item.count}\n`;
      });
    } else if (type === 'employee') {
      csvContent = 'Employee,Email,Total Amount,Count\n';
      analytics.topEmployees.forEach(item => {
        csvContent += `${item._id.firstName} ${item._id.lastName},${item._id.email},${item.totalAmount},${item.count}\n`;
      });
    }

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  const COLORS = ['#14B8A6', '#0EA5E9', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981'];

  // Prepare monthly trends data
  const monthlyData = analytics.monthlyTrends.map(item => ({
    name: `${item._id.month}/${item._id.year}`,
    amount: item.totalAmount,
    count: item.count
  }));

  // Prepare category data for pie chart
  const categoryData = analytics.categoryBreakdown.map(item => ({
    name: item._id,
    value: item.totalAmount
  }));

  // Prepare top employees data
  const employeeData = analytics.topEmployees.slice(0, 10).map(item => ({
    name: `${item._id.firstName} ${item._id.lastName}`,
    amount: item.totalAmount,
    count: item.count
  }));

  // Status breakdown
  const statusData = analytics.teamOverview.statusBreakdown.map(item => ({
    name: item._id,
    value: item.count
  }));

  // Currency breakdown
  const currencyData = analytics.currencyBreakdown.map(item => ({
    name: item._id,
    amount: item.totalAmount,
    count: item.count
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold">Team Analytics Dashboard 📊</h1>
        <p className="mt-2 text-teal-100">
          Comprehensive insights into your team's expense patterns and trends
        </p>
      </div>

      {/* 1. Team Spending Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Team Spending Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-teal-600 font-medium">Current Month</p>
                <p className="text-2xl font-bold text-teal-900">
                  ${analytics.teamOverview.currentMonth.total.toLocaleString()}
                </p>
                <p className="text-xs text-teal-600 mt-1">
                  {analytics.teamOverview.currentMonth.count} expenses
                </p>
              </div>
              <CurrencyDollarIcon className="h-10 w-10 text-teal-600" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Previous Month</p>
                <p className="text-2xl font-bold text-blue-900">
                  ${analytics.teamOverview.previousMonth.total.toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {analytics.teamOverview.previousMonth.count} expenses
                </p>
              </div>
              <DocumentTextIcon className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className={`bg-gradient-to-br ${
            analytics.teamOverview.percentageChange >= 0 
              ? 'from-red-50 to-red-100' 
              : 'from-green-50 to-green-100'
          } rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  analytics.teamOverview.percentageChange >= 0 
                    ? 'text-red-600' 
                    : 'text-green-600'
                }`}>
                  Change
                </p>
                <p className={`text-2xl font-bold ${
                  analytics.teamOverview.percentageChange >= 0 
                    ? 'text-red-900' 
                    : 'text-green-900'
                }`}>
                  {analytics.teamOverview.percentageChange >= 0 ? '+' : ''}
                  {analytics.teamOverview.percentageChange}%
                </p>
                <p className={`text-xs mt-1 ${
                  analytics.teamOverview.percentageChange >= 0 
                    ? 'text-red-600' 
                    : 'text-green-600'
                }`}>
                  vs last month
                </p>
              </div>
              {analytics.teamOverview.percentageChange >= 0 ? (
                <ArrowTrendingUpIcon className="h-10 w-10 text-red-600" />
              ) : (
                <ArrowTrendingDownIcon className="h-10 w-10 text-green-600" />
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Team Size</p>
                <p className="text-2xl font-bold text-purple-900">
                  {analytics.totalStats.teamSize}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  team members
                </p>
              </div>
              <UsersIcon className="h-10 w-10 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {analytics.teamOverview.statusBreakdown.map((status) => (
            <div key={status._id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 capitalize">{status._id}</p>
                  <p className="text-lg font-bold text-gray-900">{status.count}</p>
                  <p className="text-xs text-gray-500">
                    ${status.totalAmount.toLocaleString()}
                  </p>
                </div>
                {status._id === 'approved' && <CheckCircleIcon className="h-6 w-6 text-green-500" />}
                {status._id === 'rejected' && <XCircleIcon className="h-6 w-6 text-red-500" />}
                {status._id === 'pending' && <ClockIcon className="h-6 w-6 text-yellow-500" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Monthly Trends */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Monthly Trends (Last 12 Months)</h2>
          <button
            onClick={() => downloadReport('monthly')}
            className="flex items-center px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#14B8A6" 
              fill="#14B8A6" 
              fillOpacity={0.6}
              name="Total Amount ($)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 3. Category-wise Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Category Breakdown</h2>
            <button
              onClick={() => downloadReport('category')}
              className="flex items-center px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Categories</h2>
          <div className="space-y-3">
            {analytics.categoryBreakdown.slice(0, 6).map((category, index) => (
              <div key={category._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <div>
                    <p className="font-medium text-gray-900">{category._id}</p>
                    <p className="text-xs text-gray-500">{category.count} expenses</p>
                  </div>
                </div>
                <p className="font-bold text-gray-900">
                  ${category.totalAmount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Top Employees by Expenses */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Top Employees by Spending</h2>
          <button
            onClick={() => downloadReport('employee')}
            className="flex items-center px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={employeeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#14B8A6" name="Total Amount ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 5. Approval Queue Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Approval Queue</h2>
          <div className="space-y-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">Pending Approvals</p>
                  <p className="text-3xl font-bold text-yellow-900 mt-1">
                    {analytics.approvalQueue.pendingCount}
                  </p>
                </div>
                <ClockIcon className="h-12 w-12 text-yellow-500" />
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Avg. Approval Time</p>
                  <p className="text-3xl font-bold text-blue-900 mt-1">
                    {analytics.approvalQueue.avgApprovalTimeHours}h
                  </p>
                </div>
                <ChartBarIcon className="h-12 w-12 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* 7. Currency Insights */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Currency Breakdown</h2>
          <div className="space-y-3">
            {analytics.currencyBreakdown.map((currency, index) => (
              <div key={currency._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-teal-700">{currency._id}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{currency._id}</p>
                    <p className="text-xs text-gray-500">{currency.count} expenses</p>
                  </div>
                </div>
                <p className="font-bold text-gray-900">
                  {currency._id} {currency.totalAmount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 8. Rejected Expense Analysis */}
      {analytics.rejectedAnalysis.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Rejection Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.rejectedAnalysis.map((reason, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">
                      {reason._id || 'No reason provided'}
                    </p>
                    <p className="text-2xl font-bold text-red-900 mt-2">{reason.count}</p>
                    <p className="text-xs text-red-600 mt-1">rejections</p>
                  </div>
                  <XCircleIcon className="h-8 w-8 text-red-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Team Expenses</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.recentActivity.map((expense) => (
                <tr key={expense._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {expense.submittedBy.firstName} {expense.submittedBy.lastName}
                    </div>
                    <div className="text-xs text-gray-500">{expense.submittedBy.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatExpenseAmount(expense)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      expense.status === 'approved' ? 'bg-green-100 text-green-800' :
                      expense.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      expense.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Overall Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-teal-100 text-sm">Total Team Expenses</p>
            <p className="text-3xl font-bold">${analytics.totalStats.totalAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-teal-100 text-sm">Total Submissions</p>
            <p className="text-3xl font-bold">{analytics.totalStats.totalCount}</p>
          </div>
          <div>
            <p className="text-teal-100 text-sm">Team Members</p>
            <p className="text-3xl font-bold">{analytics.totalStats.teamSize}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerAnalytics;
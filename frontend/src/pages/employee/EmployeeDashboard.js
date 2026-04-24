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
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { expenses, loading } = useSelector((state) => state.expenses);
  const { formatAmount, formatExpenseAmount } = useCurrency();
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
      color: 'bg-info',
      textColor: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      name: 'Pending',
      value: stats.pending,
      icon: ClockIcon,
      color: 'bg-warning',
      textColor: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      name: 'Approved',
      value: stats.approved,
      icon: CheckCircleIcon,
      color: 'bg-success',
      textColor: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      name: 'Rejected',
      value: stats.rejected,
      icon: XCircleIcon,
      color: 'bg-error',
      textColor: 'text-error',
      bgColor: 'bg-error/10',
    },
  ];

  const recentExpenses = expenses?.slice(0, 5) || [];

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-warning/10 text-warning border-warning/20',
      approved: 'bg-success/10 text-success border-success/20',
      rejected: 'bg-error/10 text-error border-error/20',
      reimbursed: 'bg-info/10 text-info border-info/20',
    };
    return badges[status] || 'bg-secondary text-text-muted border-border';
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-primary rounded-3xl shadow-premium p-8 md:p-10 text-white">
        <div className="relative z-10 flex justify-between items-center flex-wrap gap-8">
          <div className="max-w-xl">
            <h1 className="text-h-xl font-bold tracking-tight mb-4">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-lg text-text-muted opacity-90 mb-8">
              Keep your finances in check. Track, manage, and submit your expense claims with ease.
            </p>
            <Link
              to="/dashboard/expenses/submit"
              className="inline-flex items-center px-8 py-4 bg-accent text-white rounded-2xl hover:bg-accent-dark transition-all shadow-premium hover:shadow-premium-lg font-bold group"
            >
              <PlusCircleIcon className="h-6 w-6 mr-3 group-hover:rotate-90 transition-transform" />
              Submit New Expense
            </Link>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-premium">
            <CurrencySelector showLabel={true} compact={false} />
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-info/20 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="group bg-surface rounded-2xl border border-border p-6 shadow-premium hover:shadow-premium-lg transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${stat.bgColor} rounded-xl p-3 transform group-hover:scale-110 transition-transform`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <div className="ml-5">
                <p className="text-small font-bold text-text-muted uppercase tracking-widest">
                  {stat.name}
                </p>
                <h3 className="text-2xl font-bold text-text-primary mt-1">
                  {stat.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Amount Summary */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="bg-surface rounded-3xl border border-border p-8 shadow-premium hover:shadow-premium-lg transition-all flex items-center group">
          <div className="flex-shrink-0 bg-accent/10 rounded-2xl p-5 group-hover:bg-accent group-hover:text-white transition-all">
            <CurrencyDollarIcon className="h-10 w-10 text-accent group-hover:text-white" />
          </div>
          <div className="ml-8">
            <p className="text-body font-bold text-text-muted uppercase tracking-widest mb-1">
              Total Amount Claimed
            </p>
            <h3 className="text-3xl font-bold text-text-primary">
              {formatAmount(stats.totalAmount)}
            </h3>
          </div>
        </div>

        <div className="bg-surface rounded-3xl border border-border p-8 shadow-premium hover:shadow-premium-lg transition-all flex items-center group">
          <div className="flex-shrink-0 bg-success/10 rounded-2xl p-5 group-hover:bg-success group-hover:text-white transition-all">
            <ChartBarIcon className="h-10 w-10 text-success group-hover:text-white" />
          </div>
          <div className="ml-8">
            <p className="text-body font-bold text-text-muted uppercase tracking-widest mb-1">
              Approved Amount
            </p>
            <h3 className="text-3xl font-bold text-text-primary">
              {formatAmount(stats.approvedAmount)}
            </h3>
          </div>
        </div>
      </div>

      {/* Recent Expenses Table */}
      <div className="bg-surface rounded-3xl border border-border shadow-premium overflow-hidden">
        <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-secondary/30">
          <h2 className="text-h-m font-bold text-text-primary">
            Recent Activity
          </h2>
          <Link
            to="/dashboard/expenses"
            className="text-body font-bold text-accent hover:text-accent-dark flex items-center group"
          >
            View Full History
            <ChevronRightIcon className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          {recentExpenses.length === 0 ? (
            <div className="text-center py-20 px-8">
              <div className="bg-secondary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <DocumentTextIcon className="h-10 w-10 text-text-muted" />
              </div>
              <h3 className="text-h-m font-bold text-text-primary mb-2">
                No expenses yet
              </h3>
              <p className="text-body text-text-muted max-w-xs mx-auto mb-8">
                Ready to file your first claim? It only takes a minute to get started.
              </p>
              <Link
                to="/dashboard/expenses/submit"
                className="btn-primary"
              >
                File First Claim
              </Link>
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Expense Details</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Category</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Date</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentExpenses.map((expense) => (
                  <tr
                    key={expense._id}
                    className="hover:bg-secondary/30 transition-colors cursor-pointer group"
                    onClick={() => (window.location.href = `/dashboard/expenses/${expense._id}`)}
                  >
                    <td className="px-8 py-6">
                      <div className="text-body font-bold text-text-primary group-hover:text-accent transition-colors">
                        {expense.title}
                      </div>
                      <div className="text-small text-text-muted truncate max-w-xs">
                        {expense.description}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-body font-medium text-text-primary bg-secondary px-3 py-1 rounded-lg">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-body font-bold text-text-primary">
                        {formatExpenseAmount(expense)}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-body text-text-muted">
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 inline-flex text-xs font-bold rounded-xl border ${getStatusBadge(expense.status)} uppercase tracking-wider`}>
                        {expense.status}
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
      <div className="bg-surface rounded-3xl border border-border p-8 shadow-premium">
        <h2 className="text-h-m font-bold text-text-primary mb-8">
          More Actions
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Link
            to="/dashboard/expenses/submit"
            className="flex items-center p-6 bg-secondary rounded-2xl border border-transparent hover:border-accent hover:bg-accent/5 transition-all group"
          >
            <PlusCircleIcon className="h-10 w-10 text-accent mr-5 group-hover:rotate-90 transition-transform" />
            <div>
              <div className="font-bold text-text-primary">New Claim</div>
              <div className="text-small text-text-muted">Start an expense request</div>
            </div>
          </Link>

          <Link
            to="/dashboard/expenses"
            className="flex items-center p-6 bg-secondary rounded-2xl border border-transparent hover:border-accent hover:bg-accent/5 transition-all group"
          >
            <DocumentTextIcon className="h-10 w-10 text-info mr-5 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-bold text-text-primary">My History</div>
              <div className="text-small text-text-muted">View all previous claims</div>
            </div>
          </Link>

          <Link
            to="/dashboard/notifications"
            className="flex items-center p-6 bg-secondary rounded-2xl border border-transparent hover:border-accent hover:bg-accent/5 transition-all group"
          >
            <CheckCircleIcon className="h-10 w-10 text-success mr-5 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-bold text-text-primary">Updates</div>
              <div className="text-small text-text-muted">Check claim status changes</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
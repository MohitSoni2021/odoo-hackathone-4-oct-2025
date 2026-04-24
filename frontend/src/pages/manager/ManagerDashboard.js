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
  ArrowUpRightIcon,
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
      color: 'bg-info',
      textColor: 'text-info',
      link: '/dashboard/expenses',
    },
    {
      name: 'Total Expenses',
      value: expenseStats?.totalExpenses || 0,
      icon: DocumentTextIcon,
      color: 'bg-primary',
      textColor: 'text-primary',
      link: '/dashboard/expenses',
    },
    {
      name: 'Pending Approval',
      value: expenseStats?.statusStats?.find(s => s._id === 'pending')?.count || 0,
      icon: ClockIcon,
      color: 'bg-warning',
      textColor: 'text-warning',
      link: '/dashboard/pending-approvals',
    },
    {
      name: 'Approved',
      value: expenseStats?.statusStats?.find(s => s._id === 'approved')?.count || 0,
      icon: CheckCircleIcon,
      color: 'bg-success',
      textColor: 'text-success',
      link: '/dashboard/expenses?status=approved',
    },
    {
      name: 'Rejected',
      value: expenseStats?.statusStats?.find(s => s._id === 'rejected')?.count || 0,
      icon: XCircleIcon,
      color: 'bg-error',
      textColor: 'text-error',
      link: '/dashboard/expenses?status=rejected',
    },
    {
      name: 'Total Amount',
      value: formatAmount(expenseStats?.totalAmount || 0),
      icon: CurrencyDollarIcon,
      color: 'bg-accent',
      textColor: 'text-accent',
      link: '/dashboard/manager-analytics',
    },
  ];

  const topCategories = expenseStats?.categoryStats?.slice(0, 5) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-primary rounded-3xl shadow-premium p-8 md:p-10 text-white">
        <div className="relative z-10 flex justify-between items-center flex-wrap gap-6">
          <div>
            <h1 className="text-h-xl font-bold tracking-tight mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-lg text-text-muted opacity-90 max-w-md">
              Here's a comprehensive overview of your team's expense activity.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-premium">
            <CurrencySelector showLabel={true} compact={false} />
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-info/20 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((stat) => (
          <Link
            key={stat.name}
            to={stat.link}
            className="group relative bg-surface p-6 rounded-2xl shadow-premium border border-border hover:shadow-premium-lg hover:border-accent/30 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10 ${stat.textColor}`}>
                <stat.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <ArrowUpRightIcon className="h-4 w-4 text-text-muted group-hover:text-accent transition-colors" />
            </div>
            <div>
              <p className="text-body font-medium text-text-secondary mb-1">
                {stat.name}
              </p>
              <h3 className="text-2xl font-bold text-text-primary">{stat.value}</h3>
            </div>
            <div className={`absolute bottom-0 left-0 h-1 w-0 ${stat.color} transition-all duration-300 group-hover:w-full rounded-b-2xl opacity-50`}></div>
          </Link>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Team Members */}
        <div className="bg-surface rounded-3xl shadow-premium border border-border p-8 transition-all hover:shadow-premium-lg">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-h-m font-bold text-text-primary">
              My Team
            </h3>
            <Link
              to="/dashboard/team"
              className="text-body font-semibold text-accent hover:text-accent-dark flex items-center transition-colors group"
            >
              View All
              <ChevronRightIcon className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {teamLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
            </div>
          ) : team && team.length > 0 ? (
            <div className="space-y-6">
              {team.slice(0, 5).map((member) => (
                <div key={member._id} className="flex items-center justify-between p-2 rounded-2xl hover:bg-secondary transition-colors group">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-white font-bold shadow-premium transform group-hover:scale-110 transition-transform">
                      {member.firstName?.[0]}{member.lastName?.[0]}
                    </div>
                    <div>
                      <div className="text-body font-bold text-text-primary">
                        {member.firstName} {member.lastName}
                      </div>
                      <div className="text-small text-text-muted capitalize">
                        {member.role}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-body font-bold text-text-primary">
                      {formatAmount(member.totalExpenseAmount || 0)}
                    </div>
                    <div className="text-small text-text-muted">
                      {member.totalExpenses || 0} expenses
                    </div>
                  </div>
                </div>
              ))}
              {team.length > 5 && (
                <div className="pt-4 border-t border-border">
                  <Link
                    to="/dashboard/team"
                    className="text-body text-text-secondary hover:text-accent font-semibold flex items-center justify-center transition-colors"
                  >
                    View {team.length - 5} more members
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-text-muted italic bg-secondary rounded-2xl border border-dashed border-border">
              No team members found
            </div>
          )}
        </div>

        {/* Top Expense Categories */}
        <div className="bg-surface rounded-3xl shadow-premium border border-border p-8 transition-all hover:shadow-premium-lg">
          <h3 className="text-h-m font-bold text-text-primary mb-8">
            Top Categories
          </h3>
          {expenseLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
            </div>
          ) : topCategories.length > 0 ? (
            <div className="space-y-6">
              {topCategories.map((category, index) => (
                <div key={category._id} className="group flex items-center justify-between p-2 rounded-2xl hover:bg-secondary transition-colors">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 text-accent font-bold text-small group-hover:bg-accent group-hover:text-white transition-all">
                      {index + 1}
                    </span>
                    <span className="text-body font-semibold text-text-primary">
                      {category._id}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-body font-bold text-text-primary">
                      {formatAmount(category.totalAmount)}
                    </div>
                    <div className="text-small text-text-muted">
                      {category.count} transactions
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-text-muted italic bg-secondary rounded-2xl border border-dashed border-border">
              No expense data available
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-surface rounded-3xl shadow-premium border border-border p-8">
        <h3 className="text-h-m font-bold text-text-primary mb-8">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/dashboard/expenses"
            className="flex items-center justify-center px-6 py-4 border border-transparent text-body font-bold rounded-2xl text-white bg-accent hover:bg-accent-dark shadow-premium hover:shadow-premium-lg transition-all transform hover:-translate-y-1"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            View Expenses
          </Link>
          <Link
            to="/dashboard/pending-approvals"
            className="flex items-center justify-center px-6 py-4 border border-border text-body font-bold rounded-2xl text-text-primary bg-secondary hover:bg-border transition-all transform hover:-translate-y-1"
          >
            <ClockIcon className="h-5 w-5 mr-2" />
            Review Pending
          </Link>
          <Link
            to="/dashboard/manager-analytics"
            className="flex items-center justify-center px-6 py-4 border border-border text-body font-bold rounded-2xl text-text-primary bg-secondary hover:bg-border transition-all transform hover:-translate-y-1"
          >
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Analytics
          </Link>
          <Link
            to="/dashboard/settings"
            className="flex items-center justify-center px-6 py-4 border border-border text-body font-bold rounded-2xl text-text-primary bg-secondary hover:bg-border transition-all transform hover:-translate-y-1"
          >
            <Cog6ToothIcon className="h-5 w-5 mr-2" />
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
};

// Simple helper icons for the link above
const ChevronRightIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChartBarIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const Cog6ToothIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default ManagerDashboard;
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
  WalletIcon,
  BoltIcon,
  BellIcon,
  ArrowUpRightIcon,
  SparklesIcon,
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
      name: 'Global Claims',
      value: stats.total,
      icon: DocumentTextIcon,
      color: 'bg-info',
      textColor: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      name: 'Under Review',
      value: stats.pending,
      icon: ClockIcon,
      color: 'bg-warning',
      textColor: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      name: 'Verified',
      value: stats.approved,
      icon: CheckCircleIcon,
      color: 'bg-success',
      textColor: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      name: 'Declined',
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse font-inter">
        <div className="w-16 h-16 border-4 border-secondary border-t-accent rounded-full animate-spin mb-6"></div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted italic">Synchronizing Personal Ledger...</div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-inter">
      {/* Personalized Command Header */}
      <div className="relative overflow-hidden bg-slate-900 rounded-xl shadow-massive p-10 md:p-14 text-white group">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-accent/20 rounded-full blur-[100px] group-hover:bg-accent/30 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-info/20 rounded-full blur-[100px] group-hover:bg-info/30 transition-all duration-700"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
               <div className="px-4 py-1 bg-accent rounded-full text-[10px] font-black uppercase tracking-widest italic shadow-massive">
                 System Identity: Verified
               </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-4">
              Welcome, <span className="text-accent">{user?.firstName}</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium max-w-lg opacity-80 italic mb-10">
              Manage your personal expenditure vault and track capital reimbursements with corporate-grade precision.
            </p>
            <Link
              to="/dashboard/expenses/submit"
              className="inline-flex items-center px-10 py-5 bg-accent text-white rounded-xl hover:bg-orange-600 transition-all shadow-massive hover:scale-105 font-black uppercase text-xs tracking-widest group"
            >
              <PlusCircleIcon className="h-6 w-6 mr-3 group-hover:rotate-90 transition-transform" />
              File New Capital Artifact
            </Link>
          </div>
          <div className="bg-white/5 backdrop-blur-2xl rounded-xl p-10 border border-white/10 shadow-massive group-hover:border-white/20 transition-all duration-500">
            <div className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-6 text-center italic opacity-80 underline underline-offset-8">Local Currency Protocol</div>
            <CurrencySelector showLabel={true} compact={false} />
          </div>
        </div>
      </div>


      {/* Metrics Matrix */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="group bg-surface rounded-xl border border-border p-8 shadow-premium hover:shadow-massive transition-all transform hover:-translate-y-2 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-700">
               <stat.icon className="h-16 w-16" />
            </div>
            <div className="flex items-center gap-5 relative z-10">
              <div className={`flex-shrink-0 ${stat.bgColor} rounded-xl p-4 transform group-hover:rotate-12 transition-all`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor} stroke-[2.5]`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] italic opacity-60">
                  {stat.name}
                </p>
                <h3 className="text-3xl font-black text-text-primary italic tracking-tighter mt-1">
                  {stat.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Capital Summary Bifurcation */}
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        <div className="bg-surface rounded-xl border border-border p-10 shadow-premium hover:shadow-massive transition-all flex items-center group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
             <WalletIcon className="h-40 w-40" />
          </div>
          <div className="flex-shrink-0 bg-accent/10 rounded-xl p-6 group-hover:bg-accent group-hover:text-white transition-all shadow-inner">
            <CurrencyDollarIcon className="h-12 w-12 text-accent group-hover:text-white stroke-[2.5]" />
          </div>
          <div className="ml-10 relative z-10">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 italic opacity-60">
              Total Capital Exposure
            </p>
            <h3 className="text-4xl font-black text-text-primary italic tracking-tighter">
              {formatAmount(stats.totalAmount)}
            </h3>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl border border-white/5 p-10 shadow-massive flex items-center group relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
             <SparklesIcon className="h-40 w-40 text-accent" />
          </div>
          <div className="flex-shrink-0 bg-white/5 rounded-xl p-6 group-hover:bg-accent transition-all shadow-inner border border-white/5">
            <ChartBarIcon className="h-12 w-12 text-accent group-hover:text-white stroke-[2.5]" />
          </div>
          <div className="ml-10 relative z-10">
            <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-2 italic opacity-80">
              Verified Reimbursement
            </p>
            <h3 className="text-4xl font-black text-white italic tracking-tighter">
              {formatAmount(stats.approvedAmount)}
            </h3>
          </div>
        </div>
      </div>


      {/* Activity Registry Table */}
      <div className="bg-surface rounded-xl border border-border shadow-massive overflow-hidden">
        <div className="px-10 py-8 border-b border-border flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-primary/10 rounded-xl text-primary">
               <BoltIcon className="h-6 w-6" />
             </div>
             <h2 className="text-xl font-black text-text-primary tracking-tighter uppercase italic">Recent Artifacts</h2>
          </div>
          <Link
            to="/dashboard/expenses"
            className="text-[10px] font-black text-accent hover:underline flex items-center group/link uppercase tracking-widest italic"
          >
            Historical Archives
            <ChevronRightIcon className="ml-2 h-4 w-4 group-hover/link:translate-x-2 transition-transform stroke-[3]" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          {recentExpenses.length === 0 ? (
            <div className="text-center py-24 px-10 bg-secondary/10">
              <div className="bg-surface w-24 h-24 rounded-xl flex items-center justify-center mx-auto mb-8 shadow-premium">
                <DocumentTextIcon className="h-12 w-12 text-text-muted/30" />
              </div>
              <h3 className="text-2xl font-black text-text-primary mb-3 italic uppercase tracking-tighter">Vault Empty</h3>
              <p className="text-sm font-medium text-text-muted italic opacity-70 mb-10">
                Ready to file your first claim? System protocols are standing by.
              </p>
              <Link
                to="/dashboard/expenses/submit"
                className="px-8 py-4 bg-accent text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-massive hover:scale-105 transition-all inline-block"
              >
                Initiate First Claim
              </Link>
            </div>
          ) : (

            <table className="min-w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-10 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Artifact Detail</th>
                  <th className="px-10 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Domain</th>
                  <th className="px-10 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Liability</th>
                  <th className="px-10 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Timeline</th>
                  <th className="px-10 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentExpenses.map((expense) => (
                  <tr
                    key={expense._id}
                    className="hover:bg-secondary/40 transition-all cursor-pointer group"
                    onClick={() => (window.location.href = `/dashboard/expenses/${expense._id}`)}
                  >
                    <td className="px-10 py-8">
                      <div className="text-sm font-black text-text-primary group-hover:text-accent transition-colors italic uppercase tracking-tight">
                        {expense.title}
                      </div>
                      <div className="text-[10px] text-text-muted font-bold italic opacity-60 mt-1 max-w-xs truncate">
                        {expense.description || 'No supplementary rationale provided.'}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-[10px] font-black text-text-primary bg-secondary border border-border px-4 py-1.5 rounded-xl uppercase tracking-widest group-hover:border-accent/30 transition-all italic">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="text-lg font-black text-text-primary tracking-tighter italic">
                        {formatExpenseAmount(expense)}
                      </div>
                    </td>
                    <td className="px-10 py-8 text-[11px] font-bold text-text-muted italic opacity-70">
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1.5 inline-flex text-[10px] font-black rounded-xl border ${getStatusBadge(expense.status)} uppercase tracking-widest italic`}>
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

      {/* Personal Command Cluster */}
      <div className="bg-slate-900 rounded-xl border border-white/5 p-12 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic mb-2">Vault Commands</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic opacity-60">Manage your corporate capital footprint</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full lg:w-auto">
            {[
              { to: '/dashboard/expenses/submit', icon: PlusCircleIcon, label: 'New Artifact', color: 'text-accent' },
              { to: '/dashboard/expenses', icon: DocumentTextIcon, label: 'Archives', color: 'text-info' },
              { to: '/dashboard/notifications', icon: BellIcon, label: 'Protocols', color: 'text-success' },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all group/btn shadow-massive"
              >
                <action.icon className={`h-10 w-10 ${action.color} mb-4 group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-transform stroke-[2.5]`} />
                <div className="font-black text-white text-[10px] uppercase tracking-[0.2em] italic">{action.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default EmployeeDashboard;
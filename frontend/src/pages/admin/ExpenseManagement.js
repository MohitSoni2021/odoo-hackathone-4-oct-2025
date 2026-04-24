import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses, approveExpense, rejectExpense } from '../../store/slices/expenseSlice';
import { useCurrency } from '../../hooks/useCurrency';
import { toast } from 'react-toastify';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  CalendarIcon,
  BanknotesIcon,
  ClockIcon,
  CheckBadgeIcon,
  NoSymbolIcon,
  WalletIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import ExpenseDetailModal from '../../components/modals/ExpenseDetailModal';

const ExpenseManagement = () => {
  const dispatch = useDispatch();
  const { expenses, loading } = useSelector((state) => state.expenses);
  const { user } = useSelector((state) => state.auth);
  const { formatExpenseAmount } = useCurrency();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const handleView = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this expense record?')) return;
    try {
      await dispatch(approveExpense(id)).unwrap();
      toast.success('Capital request authorized successfully');
      dispatch(fetchExpenses());
    } catch (err) {
      toast.error(err || 'Authorization failed');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Specify rejection rationale (required):');
    if (!reason?.trim()) {
      toast.warn('Rationale is mandatory for auditing');
      return;
    }
    try {
      await dispatch(rejectExpense({ id, rejectionReason: reason })).unwrap();
      toast.success('Expense record declined');
      dispatch(fetchExpenses());
    } catch (err) {
      toast.error(err || 'Action failed');
    }
  };

  const filteredExpenses = expenses.filter((e) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      e.title.toLowerCase().includes(search) ||
      e.description?.toLowerCase().includes(search) ||
      `${e.submittedBy?.firstName} ${e.submittedBy?.lastName}`.toLowerCase().includes(search);

    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':             return 'bg-warning/10 text-warning border-warning/20';
      case 'approved_by_manager': return 'bg-info/10 text-info border-info/20';
      case 'approved':            return 'bg-success/10 text-success border-success/20';
      case 'rejected':            return 'bg-error/10 text-error border-error/20';
      case 'reimbursed':          return 'bg-primary/10 text-primary border-primary/20';
      default:                    return 'bg-secondary text-text-muted border-border';
    }
  };

  const getStatusLabel = (status) => {
    return status === 'approved_by_manager' ? 'Mgr Verified' : status.charAt(0).toUpperCase() + status.slice(1);
  };

  const categories = [
    'Travel', 'Food', 'Accommodation', 'Transportation', 'Office Supplies',
    'Entertainment', 'Training', 'Software', 'Hardware', 'Other'
  ];

  const stats = {
    total: filteredExpenses.length,
    pending: filteredExpenses.filter(e => e.status === 'pending' || e.status === 'approved_by_manager').length,
    approved: filteredExpenses.filter(e => e.status === 'approved' || e.status === 'reimbursed').length,
    rejected: filteredExpenses.filter(e => e.status === 'rejected').length,
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 font-inter space-y-10">
      {/* Premium Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 bg-slate-900 rounded-xl flex items-center justify-center shadow-massive transform hover:rotate-6 transition-transform">
            <BriefcaseIcon className="h-10 w-10 text-accent" />
          </div>
          <div>
            <h1 className="text-h-xl font-black text-text-primary tracking-tighter italic uppercase">Capital Oversight</h1>
            <p className="text-body text-text-muted font-medium opacity-70">
              {user?.role === 'manager'
                ? 'Strategic review and authorization of divisional expenditures.'
                : 'Centralized governance of global corporate expense submissions.'}
            </p>
          </div>
        </div>

        <div className="bg-surface px-8 py-5 rounded-xl border border-border shadow-premium flex items-center gap-8 group hover:shadow-massive transition-all cursor-default relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-700">
             <BanknotesIcon className="h-20 w-20" />
          </div>
          <div className="text-right border-r border-border pr-8 relative z-10">
            <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Active Requests</div>
            <div className="text-3xl font-black text-text-primary mt-1 tracking-tighter italic">{stats.total}</div>
          </div>
          <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center text-accent shadow-inner group-hover:scale-110 transition-transform relative z-10">
            <WalletIcon className="h-7 w-7" />
          </div>
        </div>
      </div>


      {/* Strategic Metrics Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: 'Audit Volume', value: stats.total, icon: DocumentTextIcon, color: 'text-primary', bg: 'bg-primary/10' },
          { name: 'Pending Review', value: stats.pending, icon: ClockIcon, color: 'text-warning', bg: 'bg-warning/10' },
          { name: 'Authorized', value: stats.approved, icon: CheckBadgeIcon, color: 'text-success', bg: 'bg-success/10' },
          { name: 'Declined', value: stats.rejected, icon: NoSymbolIcon, color: 'text-error', bg: 'bg-error/10' },
        ].map((stat) => (
          <div key={stat.name} className="bg-surface p-8 rounded-xl border border-border shadow-premium group hover:shadow-massive transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} shadow-inner transition-transform group-hover:scale-110`}>

                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <div>
              <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 opacity-60">{stat.name}</div>
              <div className="text-3xl font-black text-text-primary tracking-tighter italic">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Control Panel / Filters */}
      <div className="bg-surface rounded-xl border border-border shadow-premium p-10 relative overflow-hidden group">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Search Field */}
          <div className="lg:col-span-6 relative group">
            <MagnifyingGlassIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-text-muted group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search by title, identifier, or personnel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-secondary/30 border border-border rounded-xl focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all placeholder:text-text-muted/50 font-bold text-sm tracking-tight"
            />

          </div>

          {/* Status Protocol Selector */}
          <div className="lg:col-span-3 relative group">
            <FunnelIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-secondary/30 border border-border rounded-xl focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all appearance-none font-bold text-sm tracking-tight cursor-pointer"
            >

              <option value="all">Protocol: All Status</option>
              <option value="pending">Awaiting Verification</option>
              <option value="approved_by_manager">Mgr Authorized</option>
              <option value="approved">Finalized Approval</option>
              <option value="rejected">Record Declined</option>
              <option value="reimbursed">Funds Disbursed</option>
            </select>
            <ChevronDownIcon className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          </div>

          {/* Domain Category Selector */}
          <div className="lg:col-span-3 relative group">
            <FunnelIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-secondary/30 border border-border rounded-xl focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all appearance-none font-bold text-sm tracking-tight cursor-pointer"
            >

              <option value="all">Domain: Global View</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Ledger Table Module */}
      <div className="bg-surface rounded-xl border border-border shadow-massive overflow-hidden">

        {loading ? (
          <div className="py-32 text-center animate-pulse">
            <div className="inline-block rounded-full h-16 w-16 border-4 border-secondary border-t-accent animate-spin mb-6 shadow-massive"></div>
            <p className="text-text-muted font-black uppercase tracking-[0.2em] text-[10px] italic">Synchronizing Capital Ledger...</p>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="py-32 text-center">
          <div className="w-24 h-24 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-8 shadow-inner">

              <NoSymbolIcon className="h-12 w-12 text-text-muted/30" />
            </div>
            <h3 className="text-2xl font-black text-text-primary tracking-tighter italic uppercase">Void Portfolio</h3>
            <p className="text-text-muted mt-3 font-medium opacity-60 italic">
              No expenditure records matches your current governance filtration criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900 border-b border-border/10">
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Audit Artifact</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Originator Node</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Capital Allocation</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Investment Domain</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Audit Timeline</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Status Protocol</th>
                  <th className="px-10 py-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Governance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredExpenses.map((expense) => (
                  <tr key={expense._id} className="hover:bg-secondary/40 transition-all group cursor-default">
                    <td className="px-10 py-8">
                      <div className="font-black text-text-primary text-lg tracking-tighter uppercase italic group-hover:text-accent transition-colors">{expense.title}</div>
                      <div className="text-[10px] text-text-muted font-bold mt-1.5 max-w-xs truncate italic opacity-60 group-hover:opacity-100 transition-opacity uppercase tracking-tight">
                        {expense.description || 'No supplementary rationale provided'}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-premium group-hover:scale-110 transition-transform group-hover:bg-accent duration-500 italic">
                          {expense.submittedBy?.firstName?.[0]}{expense.submittedBy?.lastName?.[0]}
                        </div>
                        <div>
                          <div className="font-black text-text-primary tracking-tighter text-sm uppercase italic">
                            {expense.submittedBy?.firstName} {expense.submittedBy?.lastName}
                          </div>
                          <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest opacity-60">{expense.submittedBy?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="text-xl font-black text-text-primary tracking-tighter italic">
                        {formatExpenseAmount(expense)}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase bg-secondary text-text-primary border border-border group-hover:border-accent/30 transition-all italic shadow-sm">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3 text-xs font-black text-text-secondary italic uppercase tracking-tighter">
                        <CalendarIcon className="h-4 w-4 text-accent" />
                        {new Date(expense.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black tracking-[0.1em] uppercase border italic shadow-sm ${getStatusStyle(expense.status)}`}>
                        {getStatusLabel(expense.status)}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                        <button
                          onClick={() => handleView(expense)}
                          className="p-3 bg-secondary rounded-xl text-primary border border-border hover:bg-primary hover:text-white transition-all shadow-sm active:scale-90"
                          title="Audit Perspective"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>

                        {user?.role === 'manager' && expense.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(expense._id)}
                              className="p-3 bg-secondary rounded-xl text-success border border-border hover:bg-success hover:text-white transition-all shadow-sm active:scale-90"
                              title="Authorize Allocation"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleReject(expense._id)}
                              className="p-3 bg-secondary rounded-xl text-error border border-border hover:bg-error hover:text-white transition-all shadow-sm active:scale-90"
                              title="Decline Allocation"
                            >
                              <XCircleIcon className="h-5 w-5" />
                            </button>
                          </>
                        )}

                        {user?.role === 'admin' && expense.status === 'approved_by_manager' && (
                          <>
                            <button
                              onClick={() => handleApprove(expense._id)}
                              className="p-3 bg-secondary rounded-xl text-success border border-border hover:bg-success hover:text-white transition-all shadow-sm active:scale-90"
                              title="Final Capital Release"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleReject(expense._id)}
                              className="p-3 bg-secondary rounded-xl text-error border border-border hover:bg-error hover:text-white transition-all shadow-sm active:scale-90"
                              title="Final Audit Decline"
                            >
                              <XCircleIcon className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Portfolio Audit Modal */}
      <ExpenseDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        expense={selectedExpense}
        onApprove={handleApprove}
        onReject={handleReject}
        userRole={user?.role}
      />
    </div>
  );
};

export default ExpenseManagement;
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  UserGroupIcon,
  BanknotesIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { approveExpense, rejectExpense } from '../../store/slices/expenseSlice';
import { useCurrency } from '../../hooks/useCurrency';
import { toast } from 'react-toastify';
import ExpenseDetailModal from '../../components/modals/ExpenseDetailModal';
import api from '../../services/api';

const ManagerApprovedExpenses = () => {
  const dispatch = useDispatch();
  const { formatExpenseAmount, formatAmount } = useCurrency();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/expenses/manager-approved');
      setExpenses(data.data?.expenses || []);
    } catch (err) {
      toast.error('Failed to retrieve verified expenditure records.');
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Finalize corporate authorization for this record?')) return;
    try {
      await dispatch(approveExpense(id)).unwrap();
      toast.success('Capital authorization finalized!');
      loadExpenses();
    } catch (err) {
      toast.error(err?.message || 'Authorization failed');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Specify rejection rationale for archival (required):');
    if (!reason?.trim()) {
      toast.warn('Rationale is mandatory for compliance auditing');
      return;
    }
    try {
      await dispatch(rejectExpense({ id, rejectionReason: reason })).unwrap();
      toast.success('Record declined and archived.');
      loadExpenses();
    } catch (err) {
      toast.error(err?.message || 'Action sequence failed');
    }
  };

  const handleView = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const filteredExpenses = expenses.filter((e) => {
    const search = searchTerm.toLowerCase();
    return (
      e.title.toLowerCase().includes(search) ||
      e.category.toLowerCase().includes(search) ||
      `${e.submittedBy?.firstName || ''} ${e.submittedBy?.lastName || ''}`.toLowerCase().includes(search)
    );
  });

  const totalAmount = expenses.reduce((sum, e) => sum + (e.displayAmount ?? e.amount), 0);

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-700 font-inter">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-primary rounded-xl shadow-premium">

            <CheckBadgeIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-h-xl font-bold text-text-primary tracking-tight italic uppercase">Corporate Verification</h1>
            <p className="text-body text-text-muted opacity-80">
              Final executive audit of expenditures verified by divisional leadership.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={loadExpenses}
            className="p-4 bg-surface rounded-xl border border-border text-text-muted hover:text-accent hover:border-accent/30 transition-all shadow-premium group"
          >

            <ArrowPathIcon className={`h-6 w-6 group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="bg-surface px-8 py-4 rounded-xl border border-border shadow-premium flex items-center gap-6 cursor-default">

            <div className="text-right border-r border-border pr-6">
              <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">Awaiting Release</div>
              <div className="text-h-m font-black text-text-primary mt-1">{expenses.length} Records</div>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent shadow-inner">
              <BanknotesIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-surface p-10 rounded-xl border border-border shadow-premium flex items-center gap-8 group hover:border-primary/30 transition-all relative overflow-hidden">

          <div className="absolute top-0 right-0 p-8 opacity-5">
            <UserGroupIcon className="h-32 w-32" />
          </div>
          <div className="p-5 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform shadow-inner">
            <UserCircleIcon className="h-10 w-10" />
          </div>
          <div>
            <div className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-1">Pre-Verified Portfolio</div>
            <div className="text-5xl font-black text-text-primary tracking-tighter italic">{expenses.length}</div>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-primary italic">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Managerial audit complete
            </div>
          </div>
        </div>

        <div className="bg-surface p-10 rounded-xl border border-border shadow-premium flex items-center gap-8 group hover:border-accent/30 transition-all relative overflow-hidden bg-slate-900 text-white">

          <div className="absolute top-0 right-0 p-8 opacity-10">
            <CurrencyDollarIcon className="h-32 w-32" />
          </div>
          <div className="p-5 bg-accent rounded-2xl text-white group-hover:scale-110 transition-transform shadow-premium">
            <BanknotesIcon className="h-10 w-10" />
          </div>
          <div className="relative z-10">
            <div className="text-xs font-black text-accent uppercase tracking-[0.2em] mb-1">Asset Allocation</div>
            <div className="text-5xl font-black text-white tracking-tighter italic">{formatAmount(totalAmount)}</div>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-400 italic">
              Total capital awaiting disbursement
            </div>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-surface rounded-xl border border-border shadow-premium p-8 mb-8">

        <div className="relative group max-w-2xl">
          <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder="Audit by title, domain, or originator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-secondary/50 border border-border rounded-2xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-bold text-text-primary placeholder:text-text-muted/40"
          />
        </div>
      </div>

      {/* Final Verification Table */}
      <div className="bg-surface rounded-xl border border-border shadow-premium overflow-hidden">

        {loading ? (
          <div className="p-32 text-center">
             <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-secondary border-t-accent shadow-inner"></div>
             <p className="mt-8 text-text-muted font-black tracking-[0.2em] uppercase text-[10px]">Synchronizing Verification Data...</p>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="p-32 text-center bg-secondary/10">
          <div className="w-24 h-24 bg-surface rounded-xl flex items-center justify-center mx-auto mb-8 shadow-premium">

              <CheckBadgeIcon className="h-12 w-12 text-primary/30" />
            </div>
            <h3 className="text-2xl font-black text-text-primary tracking-tight italic uppercase">Portfolio Optimized</h3>
            <p className="text-text-muted mt-3 font-medium italic opacity-70">
              No manager-verified records currently awaiting final corporate release.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/30 border-b border-border">
                  <th className="px-8 py-6 text-left text-xs font-black text-text-muted uppercase tracking-[0.2em]">Asset Detail</th>
                  <th className="px-8 py-6 text-left text-xs font-black text-text-muted uppercase tracking-[0.2em]">Originator</th>
                  <th className="px-8 py-6 text-left text-xs font-black text-text-muted uppercase tracking-[0.2em]">First Auditor</th>
                  <th className="px-8 py-6 text-left text-xs font-black text-text-muted uppercase tracking-[0.2em]">Capital</th>
                  <th className="px-8 py-6 text-left text-xs font-black text-text-muted uppercase tracking-[0.2em]">Domain</th>
                  <th className="px-8 py-6 text-right text-xs font-black text-text-muted uppercase tracking-[0.2em]">Final Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredExpenses.map((expense) => (
                  <tr key={expense._id} className="hover:bg-secondary/20 transition-all group">
                    <td className="px-8 py-8">
                      <div className="font-black text-text-primary text-lg tracking-tight group-hover:text-accent transition-colors">{expense.title}</div>
                      <div className="text-xs text-text-muted font-medium mt-1.5 max-w-sm truncate italic opacity-70">
                        {expense.description || 'No supplementary data provided.'}
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-black shadow-premium group-hover:scale-110 transition-transform">
                          {expense.submittedBy?.firstName?.[0]}{expense.submittedBy?.lastName?.[0]}
                        </div>
                        <div>
                          <div className="font-bold text-text-primary tracking-tight text-sm">
                            {expense.submittedBy?.firstName} {expense.submittedBy?.lastName}
                          </div>
                          <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{expense.submittedBy?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary rounded-lg">
                           <UserCircleIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-text-primary">
                            {expense.approvedByManager?.firstName} {expense.approvedByManager?.lastName}
                          </div>
                          <div className="text-[10px] text-text-muted font-bold uppercase tracking-widest italic">
                            {expense.managerApprovedAt
                              ? new Date(expense.managerApprovedAt).toLocaleDateString()
                              : 'Manual Override'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                       <div className="text-h-s font-black text-text-primary tracking-tighter">
                        {formatExpenseAmount(expense)}
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <span className="inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase bg-secondary text-text-primary border border-border group-hover:border-accent/20 transition-all">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-8 py-8 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleView(expense)}
                          className="p-3 bg-secondary rounded-xl text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                          title="Detailed Portfolio Review"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleApprove(expense._id)}
                          className="p-3 bg-secondary rounded-xl text-success hover:bg-success hover:text-white transition-all shadow-sm"
                          title="Final Asset Release"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleReject(expense._id)}
                          className="p-3 bg-secondary rounded-xl text-error hover:bg-error hover:text-white transition-all shadow-sm"
                          title="Final Record Decline"
                        >
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Integration */}
      <ExpenseDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExpense(null);
        }}
        expense={selectedExpense}
        onApprove={handleApprove}
        onReject={handleReject}
        userRole="admin"
      />
    </div>
  );
};

export default ManagerApprovedExpenses;
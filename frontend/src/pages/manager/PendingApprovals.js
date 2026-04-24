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
  ClockIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ClipboardDocumentCheckIcon,
  DocumentMagnifyingGlassIcon,
  CalendarIcon,
  BanknotesIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import ExpenseDetailModal from '../../components/modals/ExpenseDetailModal';

const PendingApprovals = () => {
  const dispatch = useDispatch();
  const { expenses, loading, error } = useSelector((state) => state.expenses);
  const { user } = useSelector((state) => state.auth);
  const { formatAmount, formatExpenseAmount } = useCurrency();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleViewExpense = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleApprove = async (expenseId) => {
    if (window.confirm('Confirm validation of this capital request?')) {
      try {
        await dispatch(approveExpense(expenseId)).unwrap();
        toast.success('Validation successful. Sent for final corporate authorization.');
        dispatch(fetchExpenses());
      } catch (error) {
        toast.error(error || 'Validation sequence failed');
      }
    }
  };

  const handleReject = async (expenseId, rejectionReason) => {
    try {
      await dispatch(rejectExpense({ id: expenseId, rejectionReason })).unwrap();
      toast.success('Capital request declined and archived.');
      dispatch(fetchExpenses());
    } catch (error) {
      toast.error(error || 'Action sequence failed');
    }
  };

  // Filter only pending expenses from team members
  const pendingExpenses = expenses.filter((expense) => {
    const isPending = expense.status === 'pending';
    const matchesSearch =
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.submittedBy?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.submittedBy?.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    return isPending && matchesSearch && matchesCategory;
  });

  // Calculate statistics
  const totalPendingAmount = pendingExpenses.reduce((sum, expense) => sum + (expense.displayAmount !== undefined ? expense.displayAmount : expense.amount), 0);
  const pendingCount = pendingExpenses.length;

  const categories = [
    'Travel', 'Food', 'Accommodation', 'Transportation', 'Office Supplies',
    'Entertainment', 'Training', 'Software', 'Hardware', 'Other',
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 font-inter space-y-10">
      {/* Premium Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 bg-slate-900 rounded-xl flex items-center justify-center shadow-massive transform hover:rotate-6 transition-transform">
            <ClipboardDocumentCheckIcon className="h-10 w-10 text-accent" />
          </div>

          <div>
            <h1 className="text-h-xl font-black text-text-primary tracking-tighter italic uppercase">Validation Queue</h1>
            <p className="text-body text-text-muted font-medium opacity-70">
              Meticulously review and authorize capital requests from your direct subordinates.
            </p>
          </div>
        </div>

        <div className="bg-surface px-8 py-5 rounded-xl border border-border shadow-premium flex items-center gap-8 group hover:shadow-massive transition-all cursor-default relative overflow-hidden">

           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-700">
             <ClockIcon className="h-20 w-20" />
          </div>
          <div className="text-right border-r border-border pr-8 relative z-10">
            <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Active Queue</div>
            <div className="text-3xl font-black text-text-primary mt-1 tracking-tighter italic">{pendingCount} Requests</div>
          </div>
          <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center text-accent shadow-inner group-hover:scale-110 transition-transform relative z-10">
            <ShieldCheckIcon className="h-7 w-7" />
          </div>

        </div>
      </div>

      {/* Strategic Metrics Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface p-10 rounded-xl border border-border shadow-premium flex items-center gap-10 group hover:shadow-massive transition-all relative overflow-hidden">

          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
            <ShieldCheckIcon className="h-40 w-40" />
          </div>
          <div className="p-6 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform shadow-inner relative z-10">
            <ShieldCheckIcon className="h-12 w-12" />
          </div>

          <div className="relative z-10">
            <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 opacity-60">Pending Audit Volume</div>
            <div className="text-6xl font-black text-text-primary tracking-tighter italic">{pendingCount}</div>
            <div className="mt-6 flex items-center gap-3 text-xs font-black text-primary italic uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Live Validation Sequence
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-xl border border-white/5 shadow-massive flex items-center gap-10 group hover:shadow-massive transition-all relative overflow-hidden text-white">

           <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <CurrencyDollarIcon className="h-40 w-40" />
          </div>
          <div className="p-6 bg-accent rounded-xl text-white group-hover:scale-110 transition-transform shadow-massive relative z-10">
            <BanknotesIcon className="h-12 w-12" />
          </div>

          <div className="relative z-10">
            <div className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-2 opacity-60">Cumulative Exposure</div>
            <div className="text-6xl font-black text-white tracking-tighter italic">
              {formatAmount(totalPendingAmount)}
            </div>
            <div className="mt-6 flex items-center gap-3 text-xs font-black text-slate-400 italic uppercase tracking-widest">
              Total Capital Pending Authorization
            </div>
          </div>
        </div>
      </div>

      {/* Audit Control Panel */}
      <div className="bg-surface rounded-[2.5rem] border border-border shadow-premium p-10 relative overflow-hidden group">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-text-muted group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search by title, rationale, or originator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-secondary/30 border border-border rounded-xl focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all placeholder:text-text-muted/50 font-bold text-sm tracking-tight"
            />

          </div>

          <div className="relative group">
            <FunnelIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-secondary/30 border border-border rounded-xl focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all appearance-none font-bold text-sm tracking-tight cursor-pointer"
            >

              <option value="all">Global Domain Filters</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Validation Registry Table */}
      <div className="bg-surface rounded-xl border border-border shadow-massive overflow-hidden">

        {loading ? (
          <div className="py-32 text-center animate-pulse">
             <div className="inline-block rounded-full h-16 w-16 border-4 border-secondary border-t-accent animate-spin mb-6 shadow-massive"></div>
             <p className="text-text-muted font-black tracking-[0.2em] uppercase text-[10px] italic">Retrieving Audit Trail...</p>
          </div>
        ) : pendingExpenses.length === 0 ? (
          <div className="py-32 text-center bg-secondary/10">
            <div className="w-24 h-24 bg-surface rounded-xl flex items-center justify-center mx-auto mb-8 shadow-premium">
              <DocumentMagnifyingGlassIcon className="h-12 w-12 text-primary/30" />
            </div>

            <h3 className="text-2xl font-black text-text-primary tracking-tighter italic uppercase">Queue Cleared</h3>
            <p className="text-text-muted mt-3 font-medium italic opacity-60">
              Strategic objective complete. All personnel requests have been processed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900 border-b border-border/10">
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Objective Artifact</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Originator node</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Capital allocation</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Investment domain</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Audit Timeline</th>
                  <th className="px-10 py-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Governance Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pendingExpenses.map((expense) => (
                  <tr key={expense._id} className="hover:bg-secondary/40 transition-all group cursor-default">
                    <td className="px-10 py-10">
                      <div className="font-black text-text-primary text-lg tracking-tighter uppercase italic group-hover:text-accent transition-colors">{expense.title}</div>
                      <div className="text-[10px] text-text-muted font-bold mt-2 max-w-sm truncate italic opacity-60 group-hover:opacity-100 transition-opacity uppercase tracking-tight">
                        {expense.description || 'No supplementary rationale provided.'}
                      </div>
                    </td>
                    <td className="px-10 py-10">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white font-black shadow-premium group-hover:scale-110 transition-transform group-hover:bg-accent duration-500 italic">

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
                    <td className="px-10 py-10">
                       <div className="text-xl font-black text-text-primary tracking-tighter italic">
                        {formatExpenseAmount(expense)}
                      </div>
                    </td>
                    <td className="px-10 py-10">
                      <span className="inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase bg-secondary text-text-primary border border-border group-hover:border-accent/30 transition-all italic shadow-sm">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-10 py-10">
                       <div className="flex items-center gap-3 text-xs font-black text-text-secondary italic uppercase tracking-tighter">
                        <CalendarIcon className="h-4 w-4 text-accent" />
                        {new Date(expense.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="px-10 py-10 text-right">
                      <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                        <button
                          onClick={() => handleViewExpense(expense)}
                          className="p-3 bg-secondary rounded-xl text-primary border border-border hover:bg-primary hover:text-white transition-all shadow-sm active:scale-90"
                          title="Audit Perspective"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleApprove(expense._id)}
                          className="p-3 bg-secondary rounded-xl text-success border border-border hover:bg-success hover:text-white transition-all shadow-sm active:scale-90"
                          title="Authorize Allocation"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Provide rejection rationale for archival:');
                            if (reason) handleReject(expense._id, reason);
                          }}
                          className="p-3 bg-secondary rounded-xl text-error border border-border hover:bg-error hover:text-white transition-all shadow-sm active:scale-90"
                          title="Decline Allocation"
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

      {/* Portfolio Audit Modal */}
      {isModalOpen && selectedExpense && (
        <ExpenseDetailModal
          expense={selectedExpense}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedExpense(null);
          }}
          onApprove={handleApprove}
          onReject={(reason) => handleReject(selectedExpense._id, reason)}
          userRole={user?.role}
        />
      )}
    </div>
  );
};

export default PendingApprovals;
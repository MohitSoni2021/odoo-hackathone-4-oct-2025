import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchExpenses, deleteExpense } from '../../store/slices/expenseSlice';
import { useCurrency } from '../../hooks/useCurrency';
import { toast } from 'react-toastify';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
  DocumentTextIcon,
  TagIcon,
  ArrowRightIcon,
  ArchiveBoxIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';


const MyExpenses = () => {
  const dispatch = useDispatch();
  const { expenses, loading } = useSelector((state) => state.expenses);
  const { formatExpenseAmount } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  useEffect(() => {
    if (expenses) {
      let filtered = [...expenses];
      if (searchTerm) {
        filtered = filtered.filter(
          (e) =>
            e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.category?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (statusFilter !== 'all') {
        filtered = filtered.filter((e) => e.status === statusFilter);
      }
      if (categoryFilter !== 'all') {
        filtered = filtered.filter((e) => e.category === categoryFilter);
      }
      setFilteredExpenses(filtered);
    }
  }, [expenses, searchTerm, statusFilter, categoryFilter]);

  const handleDelete = async (id) => {
    if (window.confirm('Withdraw this expenditure record from the audit queue?')) {
      try {
        await dispatch(deleteExpense(id)).unwrap();
        toast.success('Record successfully withdrawn.');
      } catch (error) {
        toast.error(error.message || 'Withdrawal failed.');
      }
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'approved': return 'bg-success/10 text-success border-success/20';
      case 'rejected': return 'bg-error/10 text-error border-error/20';
      case 'reimbursed': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-secondary text-text-muted border-border';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const categories = ['all', ...new Set(expenses?.map((e) => e.category).filter(Boolean))];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-700 font-inter">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-primary rounded-xl shadow-premium">
            <ArchiveBoxIcon className="h-8 w-8 text-white" />
          </div>

          <div>
            <h1 className="text-h-xl font-bold text-text-primary tracking-tight italic uppercase">Expenditure Vault</h1>
            <p className="text-body text-text-muted opacity-80">
              Manage and track your corporate capital requests.
            </p>
          </div>
        </div>

        <Link
          to="/dashboard/expenses/submit"
          className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-orange-600 shadow-premium hover:scale-105 transition-all group"
        >

          <PlusCircleIcon className="h-5 w-5 mr-3 group-hover:rotate-90 transition-transform" />
          Submit Capital Request
        </Link>
      </div>

      {/* Control Panel (Filters) */}
      <div className="bg-surface rounded-xl border border-border shadow-premium p-8 mb-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Search */}
          <div className="lg:col-span-6 relative group">
            <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Audit by title, domain, or rationale..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-bold text-text-primary placeholder:text-text-muted/40"
            />

          </div>

          {/* Status Select */}
          <div className="lg:col-span-3 relative group">
            <FunnelIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-14 pr-10 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-text-primary appearance-none cursor-pointer"
            >

              <option value="all">Status Audit: All</option>
              <option value="pending">Portfolio: Pending</option>
              <option value="approved">Portfolio: Approved</option>
              <option value="rejected">Portfolio: Declined</option>
              <option value="reimbursed">Portfolio: Reimbursed</option>
            </select>
          </div>

          {/* Category Select */}
          <div className="lg:col-span-3 relative group">
            <TagIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-14 pr-10 py-4 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-text-primary appearance-none cursor-pointer"
            >

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Domain: All Categories' : `Domain: ${category}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between px-2">
          <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
            Optimized View: Showing <span className="text-primary">{filteredExpenses.length}</span> of {expenses?.length || 0} records
          </div>
          <button 
            onClick={() => dispatch(fetchExpenses())}
            className="flex items-center gap-2 text-[10px] font-black text-accent hover:text-orange-600 transition-colors uppercase tracking-[0.2em]"
          >
            <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Records
          </button>
        </div>
      </div>

      {/* Records Matrix */}
      <div className="bg-surface rounded-xl border border-border shadow-massive overflow-hidden">

        {loading ? (
          <div className="p-32 text-center">
            <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-secondary border-t-accent shadow-inner"></div>
            <p className="mt-8 text-text-muted font-black tracking-[0.2em] uppercase text-[10px]">Synchronizing Private Vault...</p>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="p-32 text-center bg-secondary/10">
            <div className="w-24 h-24 bg-surface rounded-xl flex items-center justify-center mx-auto mb-8 shadow-premium">
              <DocumentTextIcon className="h-12 w-12 text-primary/30" />
            </div>

            <h3 className="text-2xl font-black text-text-primary tracking-tight italic uppercase">Portfolio Empty</h3>
            <p className="text-text-muted mt-3 font-medium italic opacity-70">
              No expenditure records match your current audit parameters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/30 border-b border-border">
                  <th className="px-8 py-6 text-left text-xs font-black text-text-muted uppercase tracking-[0.2em]">Asset Detail</th>
                  <th className="px-8 py-6 text-left text-xs font-black text-text-muted uppercase tracking-[0.2em]">Domain</th>
                  <th className="px-8 py-6 text-left text-xs font-black text-text-muted uppercase tracking-[0.2em]">Impact</th>
                  <th className="px-8 py-6 text-left text-xs font-black text-text-muted uppercase tracking-[0.2em]">Timeline</th>
                  <th className="px-8 py-6 text-left text-xs font-black text-text-muted uppercase tracking-[0.2em]">Audit Status</th>
                  <th className="px-8 py-6 text-right text-xs font-black text-text-muted uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredExpenses.map((expense) => (
                  <tr key={expense._id} className="hover:bg-secondary/20 transition-all group">
                    <td className="px-8 py-8">
                      <div className="font-black text-text-primary text-lg tracking-tight group-hover:text-accent transition-colors">{expense.title}</div>
                      <div className="text-xs text-text-muted font-medium mt-1.5 max-w-sm truncate italic opacity-70">
                        {expense.description || 'No supplementary rationale provided.'}
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <span className="inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase bg-secondary text-text-primary border border-border group-hover:border-accent/20 transition-all">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-8 py-8">
                      <div className="text-h-s font-black text-text-primary tracking-tighter">
                        {formatExpenseAmount(expense)}
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="text-sm font-bold text-text-muted italic">{formatDate(expense.date)}</div>
                    </td>
                    <td className="px-8 py-8">
                      <span className={`inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border ${getStatusBadgeStyle(expense.status || 'pending')}`}>
                        {expense.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-8 py-8 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/dashboard/expenses/${expense._id}`}
                          className="p-3 bg-secondary rounded-xl text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                          title="View Portfolio Details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        {expense.status === 'pending' && (
                          <>
                            <Link
                              to={`/dashboard/expenses/edit/${expense._id}`}
                              className="p-3 bg-secondary rounded-xl text-info hover:bg-info hover:text-white transition-all shadow-sm"
                              title="Modify Request"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(expense._id)}
                              className="p-3 bg-secondary rounded-xl text-error hover:bg-error hover:text-white transition-all shadow-sm"
                              title="Withdraw Record"
                            >
                              <TrashIcon className="h-5 w-5" />
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

      {/* Quick Action Overlay (Mobile) */}
      <div className="fixed bottom-10 right-10 lg:hidden">
        <Link
          to="/dashboard/expenses/submit"
          className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white shadow-massive hover:scale-110 transition-transform active:scale-95"
        >
          <PlusCircleIcon className="h-8 w-8" />
        </Link>
      </div>
    </div>
  );
};

export default MyExpenses;
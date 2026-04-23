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
} from '@heroicons/react/24/outline';
import ExpenseDetailModal from '../../components/modals/ExpenseDetailModal';

const ExpenseManagement = () => {
  const dispatch = useDispatch();
  const { expenses, loading } = useSelector((state) => state.expenses);
  const { user } = useSelector((state) => state.auth);
  const { formatExpenseAmount } = useCurrency();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
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
    if (!window.confirm('Approve this expense?')) return;
    try {
      await dispatch(approveExpense(id)).unwrap();
      toast.success('Expense approved successfully');
      dispatch(fetchExpenses());
    } catch (err) {
      toast.error(err || 'Failed to approve');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Reason for rejection (required):');
    if (!reason?.trim()) {
      toast.warn('Rejection reason is required');
      return;
    }
    try {
      await dispatch(rejectExpense({ id, rejectionReason: reason })).unwrap();
      toast.success('Expense rejected');
      dispatch(fetchExpenses());
    } catch (err) {
      toast.error(err || 'Failed to reject');
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
      case 'pending':             return 'bg-amber-100 text-amber-700';
      case 'approved_by_manager': return 'bg-blue-100 text-blue-700';
      case 'approved':            return 'bg-emerald-100 text-emerald-700';
      case 'rejected':            return 'bg-red-100 text-red-700';
      case 'reimbursed':          return 'bg-purple-100 text-purple-700';
      default:                    return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status) => {
    return status === 'approved_by_manager' ? 'Mgr Approved' : status.charAt(0).toUpperCase() + status.slice(1);
  };

  const categories = [
    'Travel', 'Food', 'Accommodation', 'Transportation', 'Office Supplies',
    'Entertainment', 'Training', 'Software', 'Hardware', 'Other'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Expense Management</h1>
              <p className="text-sm text-gray-500">
                {user?.role === 'manager'
                  ? 'Review and approve your team’s expenses'
                  : 'Manage all expense submissions across the organization'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search title, description, or employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved_by_manager">Mgr Approved</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="reimbursed">Reimbursed</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-teal-600"></div>
              <p className="mt-4 text-gray-500">Loading expenses...</p>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="p-16 text-center text-gray-500">
              <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-900">No expenses found</p>
              <p className="mt-2">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expense</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted By</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredExpenses.map((expense) => (
                    <tr key={expense._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-5">
                        <div className="font-medium text-gray-900">{expense.title}</div>
                        <div className="text-sm text-gray-500 mt-1 max-w-md truncate">
                          {expense.description || 'No description'}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold">
                            {expense.submittedBy?.firstName?.[0]}{expense.submittedBy?.lastName?.[0]}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {expense.submittedBy?.firstName} {expense.submittedBy?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{expense.submittedBy?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-semibold text-gray-900">
                        {formatExpenseAmount(expense)}
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {new Date(expense.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(expense.status)}`}>
                          {getStatusLabel(expense.status)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right space-x-3">
                        <button
                          onClick={() => handleView(expense)}
                          className="text-teal-600 hover:text-teal-800"
                          title="View details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>

                        {/* Manager: Approve/Reject Pending */}
                        {user?.role === 'manager' && expense.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(expense._id)}
                              className="text-emerald-600 hover:text-emerald-800"
                              title="Approve"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleReject(expense._id)}
                              className="text-red-600 hover:text-red-800"
                              title="Reject"
                            >
                              <XCircleIcon className="h-5 w-5" />
                            </button>
                          </>
                        )}

                        {/* Admin: Final Approve/Reject */}
                        {user?.role === 'admin' && expense.status === 'approved_by_manager' && (
                          <>
                            <button
                              onClick={() => handleApprove(expense._id)}
                              className="text-emerald-600 hover:text-emerald-800"
                              title="Final approve"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleReject(expense._id)}
                              className="text-red-600 hover:text-red-800"
                              title="Reject"
                            >
                              <XCircleIcon className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
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
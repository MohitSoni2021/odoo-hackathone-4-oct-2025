import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { approveExpense, rejectExpense } from '../../store/slices/expenseSlice';
import { useCurrency } from '../../hooks/useCurrency';
import { toast } from 'react-toastify';
import ExpenseDetailModal from '../../components/modals/ExpenseDetailModal';
import api from '../../services/api';

const ManagerApprovedExpenses = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { formatExpenseAmount, formatAmount } = useCurrency(); // Fixed: proper destructuring

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
      toast.error('Failed to load manager-approved expenses');
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Finalize approval of this expense?')) return;
    try {
      await dispatch(approveExpense(id)).unwrap();
      toast.success('Expense fully approved!');
      loadExpenses();
    } catch (err) {
      toast.error(err?.message || 'Failed to approve');
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
      loadExpenses();
    } catch (err) {
      toast.error(err?.message || 'Failed to reject');
    }
  };

  const handleView = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  // Fixed: Proper filtering logic
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-2 rounded-xl border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manager-Approved Expenses</h1>
              <p className="text-sm text-gray-500">
                Final review of expenses already approved by managers
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Final Approval</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{expenses.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <CheckCircleIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{formatAmount(totalAmount)}</p>
              </div>
              <div className="p-3 bg-teal-100 rounded-xl">
                <CurrencyDollarIcon className="h-8 w-8 text-teal-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, category, or employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
            />
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
              <CheckCircleIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-900">No expenses pending final approval</p>
              <p className="mt-2">All manager-approved expenses have been processed.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expense</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved By</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredExpenses.map((expense) => (
                    <tr key={expense._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-5">
                        <div className="font-medium text-gray-900">{expense.title}</div>
                        <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">
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
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <UserCircleIcon className="h-8 w-8 text-blue-500" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {expense.approvedByManager?.firstName} {expense.approvedByManager?.lastName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {expense.managerApprovedAt
                                ? new Date(expense.managerApprovedAt).toLocaleDateString()
                                : '-'}
                            </div>
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
                      <td className="px-6 py-5 text-right space-x-3">
                        <button
                          onClick={() => handleView(expense)}
                          className="text-teal-600 hover:text-teal-800"
                          title="View details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
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
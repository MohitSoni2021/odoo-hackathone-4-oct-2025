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
    if (window.confirm('Are you sure you want to approve this expense?')) {
      try {
        await dispatch(approveExpense(expenseId)).unwrap();
        toast.success('Expense approved successfully! It will now be sent to admin for final approval.');
        dispatch(fetchExpenses());
      } catch (error) {
        toast.error(error || 'Failed to approve expense');
      }
    }
  };

  const handleReject = async (expenseId, rejectionReason) => {
    try {
      await dispatch(rejectExpense({ id: expenseId, rejectionReason })).unwrap();
      toast.success('Expense rejected successfully');
      dispatch(fetchExpenses());
    } catch (error) {
      toast.error(error || 'Failed to reject expense');
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
    'Travel',
    'Food',
    'Accommodation',
    'Transportation',
    'Office Supplies',
    'Entertainment',
    'Training',
    'Software',
    'Hardware',
    'Other',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
          <p className="mt-2 text-sm text-gray-700">
            Review and approve expense requests from your team members
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Requests
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {pendingCount}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-teal-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Pending Amount
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {formatAmount(totalPendingAmount)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : pendingExpenses.length === 0 ? (
          <div className="text-center py-12">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No pending approvals</h3>
            <p className="mt-1 text-sm text-gray-500">
              All expense requests from your team have been reviewed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expense
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingExpenses.map((expense) => (
                  <tr key={expense._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {expense.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {expense.description?.substring(0, 50)}
                        {expense.description?.length > 50 && '...'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold">
                            {expense.submittedBy?.firstName?.[0]}{expense.submittedBy?.lastName?.[0]}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {expense.submittedBy?.firstName} {expense.submittedBy?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {expense.submittedBy?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatExpenseAmount(expense)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewExpense(expense)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleApprove(expense._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          title="Approve"
                        >
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Enter rejection reason:');
                            if (reason) {
                              handleReject(expense._id, reason);
                            }
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          title="Reject"
                        >
                          <XCircleIcon className="h-4 w-4 mr-1" />
                          Reject
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

      {/* Expense Detail Modal */}
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
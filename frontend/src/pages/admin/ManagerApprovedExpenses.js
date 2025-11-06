import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { fetchExpenses, approveExpense, rejectExpense } from '../../store/slices/expenseSlice';
import { useCurrency } from '../../hooks/useCurrency';
import ExpenseDetailModal from '../../components/modals/ExpenseDetailModal';
import api from '../../services/api';

const ManagerApprovedExpenses = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { formatAmount, formatExpenseAmount } = useCurrency();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadManagerApprovedExpenses();
  }, []);

  const loadManagerApprovedExpenses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/expenses/manager-approved');
      setExpenses(response.data.data.expenses || []);
    } catch (error) {
      console.error('Error loading manager-approved expenses:', error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (expenseId) => {
    try {
      await dispatch(approveExpense(expenseId)).unwrap();
      loadManagerApprovedExpenses();
    } catch (error) {
      console.error('Error approving expense:', error);
    }
  };

  const handleReject = async (expenseId, reason) => {
    try {
      await dispatch(rejectExpense({ expenseId, reason })).unwrap();
      loadManagerApprovedExpenses();
    } catch (error) {
      console.error('Error rejecting expense:', error);
    }
  };

  const handleViewDetails = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.submittedBy?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.submittedBy?.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manager Approved Expenses</h1>
          <p className="mt-1 text-sm text-gray-500">
            Review and approve expenses that have been approved by managers
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by title, category, or employee name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Pending Final Approval</p>
            <p className="text-3xl font-bold mt-1">{expenses.length}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm font-medium">Total Amount</p>
            <p className="text-2xl font-bold mt-1">
              {formatAmount(expenses.reduce((sum, exp) => sum + (exp.displayAmount !== undefined ? exp.displayAmount : exp.amount), 0))}
            </p>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Manager
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <CheckCircleIcon className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-lg font-medium">No expenses pending final approval</p>
                    <p className="text-sm">All manager-approved expenses have been processed</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredExpenses.map((expense) => (
                <tr key={expense._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{expense.title}</div>
                    <div className="text-sm text-gray-500">{expense.description?.substring(0, 50)}...</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {expense.submittedBy?.firstName} {expense.submittedBy?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{expense.submittedBy?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {expense.approvedByManager?.firstName} {expense.approvedByManager?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(expense.managerApprovedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatExpenseAmount(expense)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-100 text-teal-800">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(expense)}
                        className="text-teal-600 hover:text-teal-900"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleApprove(expense._id)}
                        className="text-green-600 hover:text-green-900"
                        title="Approve"
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleViewDetails(expense)}
                        className="text-red-600 hover:text-red-900"
                        title="Reject"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Expense Detail Modal */}
      <ExpenseDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExpense(null);
        }}
        expense={selectedExpense}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default ManagerApprovedExpenses;
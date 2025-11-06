import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import expenseService from '../../services/expenseService';
import { useCurrency } from '../../hooks/useCurrency';
import { toast } from 'react-toastify';
import {
  ArrowLeftIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  TagIcon,
  DocumentTextIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

const ExpenseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const { formatExpenseAmount } = useCurrency();

  useEffect(() => {
    fetchExpenseDetail();
  }, [id]);

  const fetchExpenseDetail = async () => {
    try {
      setLoading(true);
      const data = await expenseService.getExpenseById(id);
      setExpense(data.expense);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch expense details');
      navigate('/dashboard/expenses');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: ClockIcon,
      },
      approved: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: CheckCircleIcon,
      },
      rejected: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: XCircleIcon,
      },
      reimbursed: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: CheckCircleIcon,
      },
    };
    return badges[status] || badges.pending;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="text-center py-12">
        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Expense not found
        </h3>
        <div className="mt-6">
          <Link
            to="/dashboard/expenses"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Expenses
          </Link>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(expense.status);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate('/dashboard/expenses')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Expenses
        </button>
      </div>

      {/* Header Card */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{expense.title}</h1>
              <p className="text-teal-100 text-lg">
                {formatExpenseAmount(expense)}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${statusBadge.bg} ${statusBadge.text}`}
              >
                <StatusIcon className="h-5 w-5 mr-2" />
                {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
              </span>
              {expense.status === 'pending' && (
                <Link
                  to={`/dashboard/expenses/edit/${expense._id}`}
                  className="inline-flex items-center px-3 py-2 bg-white text-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
                >
                  <PencilIcon className="h-5 w-5 mr-1" />
                  Edit
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <TagIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="mt-1 text-sm text-gray-900">{expense.category}</p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Expense Date</p>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(expense.date)}
                </p>
              </div>
            </div>

            {/* Amount */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Amount</p>
                <p className="mt-1 text-sm text-gray-900">
                  {formatExpenseAmount(expense)}
                </p>
              </div>
            </div>

            {/* Submitted By */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <UserIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Submitted By</p>
                <p className="mt-1 text-sm text-gray-900">
                  {expense.submittedBy?.firstName} {expense.submittedBy?.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {expense.submittedBy?.email}
                </p>
              </div>
            </div>

            {/* Submitted At */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Submitted At</p>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDateTime(expense.createdAt)}
                </p>
              </div>
            </div>

            {/* Approved/Rejected By */}
            {expense.approvedBy && (
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <UserIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    {expense.status === 'approved' || expense.status === 'reimbursed'
                      ? 'Approved By'
                      : 'Rejected By'}
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {expense.approvedBy?.firstName} {expense.approvedBy?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(expense.approvedAt)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {expense.description && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Description
              </h3>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {expense.description}
              </p>
            </div>
          )}

          {/* Notes */}
          {expense.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Additional Notes
              </h3>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {expense.notes}
              </p>
            </div>
          )}

          {/* Rejection Reason */}
          {expense.status === 'rejected' && expense.rejectionReason && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircleIcon className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Rejection Reason
                    </h3>
                    <p className="mt-2 text-sm text-red-700">
                      {expense.rejectionReason}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Receipt */}
          {expense.receipt && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                <PhotoIcon className="h-5 w-5 mr-2" />
                Receipt
              </h3>
              <div className="mt-2">
                <img
                  src={expense.receipt}
                  alt="Receipt"
                  className="max-w-full h-auto rounded-lg shadow-lg border border-gray-200"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Approval Workflow Info */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Approval Workflow
        </h3>
        <div className="space-y-4">
          {/* Step 1: Submitted */}
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Submitted</p>
              <p className="text-xs text-gray-500">
                {formatDateTime(expense.createdAt)}
              </p>
            </div>
          </div>

          {/* Step 2: Under Review */}
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  expense.status !== 'pending'
                    ? 'bg-green-100'
                    : 'bg-yellow-100'
                }`}
              >
                {expense.status !== 'pending' ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                ) : (
                  <ClockIcon className="h-5 w-5 text-yellow-600" />
                )}
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Under Review</p>
              <p className="text-xs text-gray-500">
                {expense.status === 'pending'
                  ? 'Waiting for approval'
                  : `Reviewed on ${formatDateTime(expense.approvedAt)}`}
              </p>
            </div>
          </div>

          {/* Step 3: Final Status */}
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  expense.status === 'approved' || expense.status === 'reimbursed'
                    ? 'bg-green-100'
                    : expense.status === 'rejected'
                    ? 'bg-red-100'
                    : 'bg-gray-100'
                }`}
              >
                {expense.status === 'approved' ||
                expense.status === 'reimbursed' ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                ) : expense.status === 'rejected' ? (
                  <XCircleIcon className="h-5 w-5 text-red-600" />
                ) : (
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">
                {expense.status === 'approved'
                  ? 'Approved'
                  : expense.status === 'rejected'
                  ? 'Rejected'
                  : expense.status === 'reimbursed'
                  ? 'Reimbursed'
                  : 'Pending Decision'}
              </p>
              <p className="text-xs text-gray-500">
                {expense.status !== 'pending'
                  ? `${
                      expense.status === 'approved' || expense.status === 'reimbursed'
                        ? 'Approved'
                        : 'Rejected'
                    } by ${expense.approvedBy?.firstName} ${
                      expense.approvedBy?.lastName
                    }`
                  : 'Awaiting manager/admin decision'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetail;
import React, { useState } from 'react';
import { XMarkIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { useCurrency } from '../../hooks/useCurrency';

const ExpenseDetailModal = ({ isOpen, onClose, expense, onApprove, onReject }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { formatExpenseAmount } = useCurrency();

  if (!isOpen || !expense) return null;

  const handleApprove = () => {
    onApprove(expense._id);
    onClose();
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please enter a rejection reason');
      return;
    }
    onReject(expense._id, rejectionReason);
    setRejectionReason('');
    setShowRejectForm(false);
    onClose();
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved_by_manager':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'reimbursed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    if (status === 'approved_by_manager') {
      return 'Approved by Manager';
    }
    return status;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Expense Details</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusBadgeColor(
                    expense.status
                  )}`}
                >
                  {getStatusLabel(expense.status)}
                </span>
                <span className="text-sm text-gray-500">
                  Submitted on {new Date(expense.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Title */}
              <div>
                <h4 className="text-2xl font-bold text-gray-900">{expense.title}</h4>
              </div>

              {/* Amount */}
              <div className="bg-teal-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Amount</div>
                <div className="text-3xl font-bold text-teal-600">
                  {formatExpenseAmount(expense)}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Category</div>
                  <div className="mt-1 text-sm text-gray-900">{expense.category}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Date</div>
                  <div className="mt-1 text-sm text-gray-900">
                    {new Date(expense.date).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Submitted By</div>
                  <div className="mt-1 text-sm text-gray-900">
                    {expense.submittedBy?.firstName} {expense.submittedBy?.lastName}
                  </div>
                  <div className="text-xs text-gray-500">{expense.submittedBy?.email}</div>
                </div>
                {expense.approvedByManager && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Manager Approval</div>
                    <div className="mt-1 text-sm text-gray-900">
                      {expense.approvedByManager.firstName} {expense.approvedByManager.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(expense.managerApprovedAt).toLocaleDateString()}
                    </div>
                  </div>
                )}
                {expense.approvedByAdmin && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Admin Approval</div>
                    <div className="mt-1 text-sm text-gray-900">
                      {expense.approvedByAdmin.firstName} {expense.approvedByAdmin.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(expense.adminApprovedAt).toLocaleDateString()}
                    </div>
                  </div>
                )}
                {expense.rejectedBy && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Rejected By</div>
                    <div className="mt-1 text-sm text-gray-900">
                      {expense.rejectedBy.firstName} {expense.rejectedBy.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(expense.rejectedAt).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {expense.description && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Description</div>
                  <div className="mt-1 text-sm text-gray-900">{expense.description}</div>
                </div>
              )}

              {/* Receipt */}
              {expense.receiptUrl && (
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">Receipt</div>
                  <img
                    src={expense.receiptUrl}
                    alt="Receipt"
                    className="max-w-full h-auto rounded-lg border border-gray-300"
                  />
                </div>
              )}

              {/* Rejection Reason */}
              {expense.status === 'rejected' && expense.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-red-800">Rejection Reason</div>
                  <div className="mt-1 text-sm text-red-700">{expense.rejectionReason}</div>
                </div>
              )}

              {/* Reject Form */}
              {showRejectForm && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <label
                    htmlFor="rejectionReason"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Rejection Reason *
                  </label>
                  <textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    placeholder="Enter reason for rejection..."
                  />
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {((user?.role === 'manager' && expense.status === 'pending') ||
            (user?.role === 'admin' && expense.status === 'approved_by_manager')) && (
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              {showRejectForm ? (
                <>
                  <button
                    type="button"
                    onClick={handleReject}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    <XCircleIcon className="h-5 w-5 mr-2" />
                    Confirm Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectForm(false);
                      setRejectionReason('');
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    {user?.role === 'manager' ? 'Approve (Manager)' : 'Final Approve (Admin)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRejectForm(true)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    <XCircleIcon className="h-5 w-5 mr-2" />
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetailModal;
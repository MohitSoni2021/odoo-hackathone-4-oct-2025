import React, { useState } from 'react';
import { XMarkIcon, CheckCircleIcon, XCircleIcon, CalendarIcon, UserIcon, TagIcon, DocumentTextIcon, BanknotesIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
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
      alert('Strategic rationale is required for decline operations.');
      return;
    }
    onReject(expense._id, rejectionReason);
    setRejectionReason('');
    setShowRejectForm(false);
    onClose();
  };

  const getStatusBadgeStyle = (status) => {
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
    if (status === 'approved_by_manager') return 'Manager Verified';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Glassmorphic Overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-slate-900/60 backdrop-blur-md"
          onClick={onClose}
        ></div>

        {/* Modal Portfolio */}
        <div className="inline-block align-bottom bg-surface border border-white/10 rounded-xl text-left overflow-hidden shadow-massive transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full animate-in zoom-in-95 duration-300">

          <div className="relative">
            {/* Header Gradient */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>
            
            <div className="px-8 pt-8 pb-4 relative">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-premium">
                    <DocumentTextIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-h-m font-black text-text-primary uppercase tracking-tighter italic">Investment Portfolio</h3>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Record ID: {expense._id?.slice(-8)}</p>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 bg-secondary rounded-xl text-text-muted hover:text-accent hover:bg-accent/10 transition-all group"
                >
                  <XMarkIcon className="h-6 w-6 group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Visual Identity & Status */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <div className={`inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border ${getStatusBadgeStyle(expense.status)} mb-4`}>
                      {getStatusLabel(expense.status)}
                    </div>
                    <h4 className="text-4xl font-black text-text-primary tracking-tight leading-tight italic">{expense.title}</h4>
                    <p className="text-sm text-text-muted font-medium mt-2 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-accent" />
                      Submitted on {new Date(expense.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
                    </p>
                  </div>
                  
                  <div className="bg-slate-900 p-8 rounded-xl border border-white/5 shadow-massive text-right min-w-[240px]">

                    <div className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-2">Total Capital Impact</div>
                    <div className="text-5xl font-black text-white tracking-tighter italic">
                      {formatExpenseAmount(expense)}
                    </div>
                  </div>
                </div>

                {/* Information Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-secondary/30 p-6 rounded-xl border border-border group hover:border-primary/20 transition-all">

                    <div className="flex items-center gap-2 text-text-muted mb-2">
                      <TagIcon className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Business Domain</span>
                    </div>
                    <div className="font-bold text-text-primary">{expense.category}</div>
                  </div>
                  
                  <div className="bg-secondary/30 p-6 rounded-xl border border-border group hover:border-accent/20 transition-all col-span-2">

                    <div className="flex items-center gap-2 text-text-muted mb-2">
                      <UserIcon className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Originator Profile</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-xs">
                        {expense.submittedBy?.firstName?.[0]}{expense.submittedBy?.lastName?.[0]}
                      </div>
                      <div>
                        <div className="font-bold text-text-primary text-sm">{expense.submittedBy?.firstName} {expense.submittedBy?.lastName}</div>
                        <div className="text-[10px] text-text-muted font-medium italic">{expense.submittedBy?.email}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audit Trail Matrix */}
                {(expense.approvedByManager || expense.approvedByAdmin || expense.rejectedBy) && (
                  <div className="bg-secondary/10 p-8 rounded-xl border border-border">

                    <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <ShieldCheckIcon className="h-4 w-4 text-primary" />
                      Strategic Audit Trail
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {expense.approvedByManager && (
                        <div className="relative pl-6 border-l-2 border-info/30">
                          <div className="text-[10px] font-black text-info uppercase tracking-widest mb-1">Divisional Verification</div>
                          <div className="font-bold text-text-primary text-sm">
                            {expense.approvedByManager.firstName} {expense.approvedByManager.lastName}
                          </div>
                          <div className="text-[10px] text-text-muted italic mt-1">
                            {new Date(expense.managerApprovedAt).toLocaleString()}
                          </div>
                        </div>
                      )}
                      {expense.approvedByAdmin && (
                        <div className="relative pl-6 border-l-2 border-success/30">
                          <div className="text-[10px] font-black text-success uppercase tracking-widest mb-1">Corporate Authorization</div>
                          <div className="font-bold text-text-primary text-sm">
                            {expense.approvedByAdmin.firstName} {expense.approvedByAdmin.lastName}
                          </div>
                          <div className="text-[10px] text-text-muted italic mt-1">
                            {new Date(expense.adminApprovedAt).toLocaleString()}
                          </div>
                        </div>
                      )}
                      {expense.rejectedBy && (
                        <div className="relative pl-6 border-l-2 border-error/30 col-span-2">
                          <div className="text-[10px] font-black text-error uppercase tracking-widest mb-1">Portfolio Declined</div>
                          <div className="font-bold text-text-primary text-sm">
                            {expense.rejectedBy.firstName} {expense.rejectedBy.lastName}
                          </div>
                          <div className="text-[10px] text-text-muted italic mt-1">
                            {new Date(expense.rejectedAt).toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Descriptive Rationale */}
                {expense.description && (
                  <div className="bg-secondary/20 p-8 rounded-xl border border-border">

                    <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3">Supplementary Rationale</div>
                    <p className="text-sm text-text-primary leading-relaxed italic opacity-80 font-medium">
                      "{expense.description}"
                    </p>
                  </div>
                )}

                {/* Captive Receipt Data */}
                {expense.receiptUrl && (
                  <div>
                    <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">Verification Artifact</div>
                    <div className="relative group overflow-hidden rounded-xl border-4 border-secondary shadow-premium">

                      <img
                        src={expense.receiptUrl}
                        alt="Audit Artifact"
                        className="w-full h-auto object-cover max-h-96 group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <a href={expense.receiptUrl} target="_blank" rel="noreferrer" className="bg-white text-slate-900 px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-110 transition-transform">
                          Expand Artifact
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Exception Rationale (Rejection) */}
                {expense.status === 'rejected' && expense.rejectionReason && (
                  <div className="bg-error/5 border border-error/20 rounded-xl p-8">

                    <div className="text-[10px] font-black text-error uppercase tracking-[0.2em] mb-3">Audit Decline Rationale</div>
                    <p className="text-sm text-error font-bold italic leading-relaxed">
                      "{expense.rejectionReason}"
                    </p>
                  </div>
                )}

                {/* Exception Form (Reject Operation) */}
                {showRejectForm && (
                  <div className="bg-secondary p-8 rounded-xl border-2 border-error/20 animate-in slide-in-from-top-4">

                    <label
                      htmlFor="rejectionReason"
                      className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4"
                    >
                      Audit Decline Rationale *
                    </label>
                    <textarea
                      id="rejectionReason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      className="block w-full bg-surface border border-border rounded-xl shadow-inner py-4 px-6 focus:ring-2 focus:ring-error/20 focus:border-error outline-none transition-all font-bold text-text-primary text-sm italic"
                      placeholder="Specify the compliance or strategic reasons for declining this portfolio..."
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Hub */}
          <div className="bg-secondary/50 px-8 py-8 sm:flex sm:flex-row-reverse gap-4 border-t border-border">
            {showRejectForm ? (
              <>
                <button
                  type="button"
                  onClick={handleReject}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-error text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-red-700 shadow-premium hover:scale-105 transition-all"
                >

                  <XCircleIcon className="h-5 w-5 mr-2" />
                  Confirm Decline
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectionReason('');
                  }}
                  className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-surface text-text-primary rounded-xl font-black uppercase text-xs tracking-widest hover:bg-secondary border border-border transition-all"
                >

                  Cancel
                </button>
              </>
            ) : (
              <>
                {((user?.role === 'manager' && expense.status === 'pending') ||
                  (user?.role === 'admin' && expense.status === 'approved_by_manager')) && (
                  <>
                    <button
                      type="button"
                      onClick={handleApprove}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-success text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-emerald-700 shadow-premium hover:scale-105 transition-all sm:ml-4"
                    >

                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      {user?.role === 'manager' ? 'Authorize (Manager)' : 'Final Release (Admin)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRejectForm(true)}
                      className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-error text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-red-700 shadow-premium hover:scale-105 transition-all"
                    >

                      <XCircleIcon className="h-5 w-5 mr-2" />
                      Decline
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-surface text-text-primary rounded-xl font-black uppercase text-xs tracking-widest hover:bg-secondary border border-border transition-all"
                >

                  Dismiss Portfolio
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetailModal;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import expenseService from '../../services/expenseService';
import { useCurrency } from '../../hooks/useCurrency';
import { toast } from 'react-toastify';
import {
  ArrowLeftIcon,
  CalendarIcon,
  BanknotesIcon,
  TagIcon,
  DocumentTextIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon,
  PencilIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  ArrowDownTrayIcon,
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
    if (!id) {
      toast.error('Expense record identification missing.');
      navigate('/dashboard/expenses');
      return;
    }
    
    try {
      setLoading(true);
      const data = await expenseService.getExpenseById(id);
      if (data && data.expense) {
        setExpense(data.expense);
      } else {
        throw new Error('Record not found in central vault.');
      }
    } catch (error) {
      toast.error(error.message || 'Audit retrieval failed.');
      navigate('/dashboard/expenses');
    } finally {
      setLoading(false);
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

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-pulse">
        <div className="w-16 h-16 border-4 border-secondary border-t-accent rounded-full animate-spin mb-6 shadow-inner"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Retrieving Audit Artifacts...</p>
      </div>
    );
  }

  if (!expense) return null;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 font-inter">
      {/* Back & Actions */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/dashboard/expenses')}
          className="group flex items-center gap-3 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] hover:text-primary transition-colors"
        >
          <div className="p-2 bg-surface rounded-lg border border-border group-hover:border-primary/30 transition-all">
            <ArrowLeftIcon className="h-4 w-4" />
          </div>
          Return to Vault
        </button>

        {expense.status === 'pending' && (
          <Link
            to={`/dashboard/expenses/edit/${expense._id}`}
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 shadow-premium transition-all"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Modify Request
          </Link>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Header Card */}
          <div className="bg-slate-900 rounded-xl p-10 relative overflow-hidden shadow-massive">

            <div className="absolute top-0 right-0 p-10 opacity-10">
              <BanknotesIcon className="h-40 w-40 text-white" />
            </div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <span className={`inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border border-white/10 mb-4 ${getStatusBadgeStyle(expense.status)} bg-white/5`}>
                    {expense.status}
                  </span>
                  <h1 className="text-h-xl font-bold text-white tracking-tight italic uppercase">{expense.title}</h1>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Impact Value</div>
                  <div className="text-h-l font-black text-accent tracking-tighter">
                    {formatExpenseAmount(expense)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10">
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Category</div>
                  <div className="text-sm font-bold text-white">{expense.category}</div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Timeline</div>
                  <div className="text-sm font-bold text-white">{formatDate(expense.date)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Reference ID</div>
                  <div className="text-sm font-bold text-white truncate max-w-[100px]">{expense._id.slice(-8).toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Type</div>
                  <div className="text-sm font-bold text-white">Capital Request</div>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Notes */}
          <div className="bg-surface rounded-xl p-10 border border-border shadow-premium">

            <div className="space-y-10">
              {expense.description && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <DocumentTextIcon className="h-5 w-5 text-accent" />
                    <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.2em]">Strategic Rationale</h3>
                  </div>
                  <p className="text-body text-text-muted italic leading-relaxed pl-8 border-l-2 border-secondary">
                    "{expense.description}"
                  </p>
                </div>
              )}

              {expense.notes && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <InformationCircleIcon className="h-5 w-5 text-primary" />
                    <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.2em]">Supplementary Data</h3>
                  </div>
                  <p className="text-body text-text-muted italic leading-relaxed pl-8 border-l-2 border-secondary">
                    {expense.notes}
                  </p>
                </div>
              )}

              {!expense.description && !expense.notes && (
                <div className="text-center py-10 opacity-40">
                  <InformationCircleIcon className="h-10 w-10 mx-auto mb-4 text-text-muted" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">No supplementary rationale provided.</p>
                </div>
              )}
            </div>
          </div>

          {/* Receipt Preview */}
          {expense.receipt && (
            <div className="bg-surface rounded-xl p-10 border border-border shadow-premium overflow-hidden">

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <PhotoIcon className="h-5 w-5 text-accent" />
                  <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.2em]">Verification Artifact</h3>
                </div>
                <button className="text-[10px] font-black text-primary hover:text-accent transition-colors flex items-center gap-2 uppercase tracking-[0.2em]">
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Download Original
                </button>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                <img
                  src={expense.receipt}
                  alt="Audit Artifact"
                  className="relative w-full rounded-xl shadow-massive border-4 border-surface"
                />

              </div>
            </div>
          )}
        </div>

        {/* Right Column: Workflow & Audit */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* Approval Matrix */}
          <div className="bg-surface rounded-xl border border-border shadow-premium p-8">

            <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <ShieldCheckIcon className="h-5 w-5 text-primary" />
              Audit Trail
            </h3>
            
            <div className="space-y-10 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-secondary">
              {/* Step 1: Submission */}
              <div className="relative pl-12">
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-success/10 border-2 border-success flex items-center justify-center z-10">
                  <CheckCircleIcon className="h-4 w-4 text-success" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-text-primary uppercase tracking-widest mb-1">Initiation Sequence</h4>
                  <p className="text-xs font-bold text-text-muted italic opacity-70 mb-2">Request injected by asset owner.</p>
                  <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl border border-border">
                    <div className="p-1.5 bg-surface rounded-lg">
                      <UserIcon className="h-3 w-3 text-primary" />
                    </div>
                    <div className="text-[10px] font-black truncate">
                      {expense.submittedBy?.firstName} {expense.submittedBy?.lastName}
                    </div>
                  </div>
                  <div className="mt-2 text-[9px] font-black text-text-muted/50 uppercase tracking-tighter">
                    {formatDateTime(expense.createdAt)}
                  </div>
                </div>
              </div>

              {/* Step 2: Verification */}
              <div className="relative pl-12">
                <div className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 ${expense.status !== 'pending' ? 'bg-success/10 border-success' : 'bg-warning/10 border-warning animate-pulse'}`}>
                  {expense.status !== 'pending' ? <CheckCircleIcon className="h-4 w-4 text-success" /> : <ClockIcon className="h-4 w-4 text-warning" />}
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-text-primary uppercase tracking-widest mb-1">Corporate Verification</h4>
                  <p className="text-xs font-bold text-text-muted italic opacity-70 mb-2">Managerial audit and risk assessment.</p>
                  {expense.status === 'pending' ? (
                    <div className="text-[10px] font-black text-warning uppercase italic animate-pulse">Awaiting authorization...</div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl border border-border">
                        <div className="p-1.5 bg-surface rounded-lg">
                          <ShieldCheckIcon className="h-3 w-3 text-primary" />
                        </div>
                        <div className="text-[10px] font-black truncate">
                          {expense.approvedBy?.firstName} {expense.approvedBy?.lastName || 'System Admin'}
                        </div>
                      </div>
                      <div className="mt-2 text-[9px] font-black text-text-muted/50 uppercase tracking-tighter">
                        {formatDateTime(expense.approvedAt || expense.updatedAt)}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Step 3: Final Disposition */}
              <div className="relative pl-12">
                <div className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 ${
                  expense.status === 'approved' || expense.status === 'reimbursed' ? 'bg-success/10 border-success' : 
                  expense.status === 'rejected' ? 'bg-error/10 border-error' : 'bg-secondary border-border'
                }`}>
                  {expense.status === 'approved' || expense.status === 'reimbursed' ? <CheckCircleIcon className="h-4 w-4 text-success" /> : 
                   expense.status === 'rejected' ? <XCircleIcon className="h-4 w-4 text-error" /> : <ClockIcon className="h-4 w-4 text-text-muted" />}
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-text-primary uppercase tracking-widest mb-1">Audit Disposition</h4>
                  <p className="text-xs font-bold text-text-muted italic opacity-70 mb-2">Final record status in archival.</p>
                  <div className={`inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border ${getStatusBadgeStyle(expense.status)}`}>
                    {expense.status}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rejection Alert */}
          {expense.status === 'rejected' && expense.rejectionReason && (
            <div className="bg-error/5 border-2 border-error/20 rounded-xl p-8 animate-in zoom-in-95 duration-500">

              <div className="flex items-center gap-3 mb-4">
                <XCircleIcon className="h-6 w-6 text-error" />
                <h3 className="text-xs font-black text-error uppercase tracking-[0.2em]">Audit Discrepancy</h3>
              </div>
              <p className="text-sm font-bold text-error/80 italic leading-relaxed">
                "{expense.rejectionReason}"
              </p>
              <div className="mt-6 p-4 bg-error/10 rounded-xl text-[10px] font-black text-error uppercase tracking-tighter">
                Action Required: Please rectify artifacts or rationale and re-initiate sequence.
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ExpenseDetail;
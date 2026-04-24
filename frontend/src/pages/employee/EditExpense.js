import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateExpense } from '../../store/slices/expenseSlice';
import expenseService from '../../services/expenseService';
import { toast } from 'react-toastify';
import {
  DocumentTextIcon,
  CameraIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  ArrowLeftIcon,
  BanknotesIcon,
  TagIcon,
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const EditExpense = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [receiptPreview, setReceiptPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    currency: 'USD',
    category: 'Food',
    date: '',
    receipt: '',
    notes: '',
  });

  const categories = [
    'Food',
    'Transportation',
    'Accommodation',
    'Office Supplies',
    'Travel',
    'Entertainment',
    'Communication',
    'Training',
    'Other',
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY'];

  const fetchExpense = useCallback(async () => {
    if (!id) {
      toast.error('Expense identification sequence missing.');
      navigate('/dashboard/expenses');
      return;
    }

    try {
      setFetchLoading(true);
      const { data } = await expenseService.getExpenseById(id);
      const expense = data?.expense;

      if (!expense) throw new Error('Record not found.');

      if (expense.status !== 'pending') {
        toast.error('Audit restricted: Only pending requests can be modified.');
        navigate('/dashboard/expenses');
        return;
      }

      setFormData({
        title: expense.title || '',
        description: expense.description || '',
        amount: expense.amount || '',
        currency: expense.currency || 'USD',
        category: expense.category || 'Food',
        date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : '',
        receipt: expense.receipt || '',
        notes: expense.notes || '',
      });

      if (expense.receipt) setReceiptPreview(expense.receipt);
    } catch (error) {
      toast.error(error.message || 'Audit retrieval failed.');
      navigate('/dashboard/expenses');
    } finally {
      setFetchLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchExpense();
  }, [fetchExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Strategic artifacts must be image-based.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Artifact size exceeds the 5MB corporate threshold.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptPreview(reader.result);
      setFormData((prev) => ({
        ...prev,
        receipt: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeReceipt = () => {
    setReceiptPreview(null);
    setFormData((prev) => ({
      ...prev,
      receipt: '',
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Record title is mandatory for audit trail.');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Capital impact must be a positive non-zero value.');
      return;
    }
    if (!formData.date) {
      toast.error('Timeline marker is required for archival.');
      return;
    }

    setLoading(true);
    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };
      await dispatch(updateExpense({ id, expenseData })).unwrap();
      toast.success('Capital request successfully recalibrated!');
      navigate('/dashboard/expenses');
    } catch (error) {
      toast.error(error.message || 'Calibration sequence failed.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-pulse">
        <div className="w-16 h-16 border-4 border-secondary border-t-accent rounded-full animate-spin mb-6 shadow-inner"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Synchronizing Private Vault...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 font-inter">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-primary rounded-xl shadow-premium">
            <PencilSquareIcon className="h-8 w-8 text-white" />
          </div>

          <div>
            <h1 className="text-h-xl font-bold text-text-primary tracking-tight italic uppercase">Record Modification</h1>
            <p className="text-body text-text-muted opacity-80">
              Recalibrate your existing capital request for the audit queue.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/dashboard/expenses')}
          className="group flex items-center gap-3 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] hover:text-primary transition-colors"
        >
          <div className="p-2 bg-surface rounded-lg border border-border group-hover:border-primary/30 transition-all">
            <ArrowLeftIcon className="h-4 w-4" />
          </div>
          Abort Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="bg-surface rounded-xl border border-border shadow-massive overflow-hidden">

            <form onSubmit={handleSubmit} className="p-10 space-y-10">
              
              {/* Receipt Matrix */}
              <div className="relative group">
                <div className={`relative bg-secondary/30 rounded-xl p-10 border-2 border-dashed transition-all duration-500 ${receiptPreview ? 'border-primary/40 bg-primary/5' : 'border-border hover:border-accent/40'}`}>

                  {!receiptPreview ? (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-surface rounded-xl flex items-center justify-center mx-auto mb-6 shadow-premium">
                        <CloudArrowUpIcon className="h-10 w-10 text-accent" />
                      </div>

                      <h3 className="text-lg font-black text-text-primary tracking-tight uppercase italic">Update Artifact</h3>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-8 inline-flex items-center px-8 py-4 bg-surface text-text-primary border border-border rounded-xl font-black uppercase text-xs tracking-widest hover:bg-secondary transition-all shadow-sm"
                      >

                        <CameraIcon className="h-5 w-5 mr-3 text-accent" />
                        Replace Artifact
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={receiptPreview}
                        alt="Audit Preview"
                        className="mx-auto max-h-[400px] rounded-xl shadow-massive border-4 border-surface"
                      />

                      <button
                        type="button"
                        onClick={removeReceipt}
                        className="absolute -top-4 -right-4 p-3 bg-error text-white rounded-xl hover:scale-110 transition-transform shadow-premium"
                      >

                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Input Grid */}
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Request Identification</label>
                    <div className="relative group">
                      <DocumentTextIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
                      <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full pl-16 pr-6 py-5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-bold text-text-primary"
                        placeholder="Define the expenditure objective..."

                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Business Domain</label>
                    <div className="relative group">
                      <TagIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                      <select
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full pl-16 pr-10 py-5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-text-primary appearance-none cursor-pointer"
                      >

                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Timeline Marker</label>
                    <div className="relative group">
                      <CalendarIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                      <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full pl-16 pr-6 py-5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-text-primary"
                      />

                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Capital Impact</label>
                    <div className="relative group">
                      <BanknotesIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-accent transition-colors" />
                      <input
                        type="number"
                        name="amount"
                        required
                        step="0.01"
                        min="0"
                        value={formData.amount}
                        onChange={handleChange}
                        className="w-full pl-16 pr-6 py-5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-bold text-text-primary"
                      />

                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Currency Unit</label>
                    <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-text-muted group-focus-within:text-primary transition-colors">$</div>
                      <select
                        name="currency"
                        required
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-full pl-16 pr-10 py-5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-text-primary appearance-none cursor-pointer"
                      >

                        {currencies.map((cur) => (
                          <option key={cur} value={cur}>{cur}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Strategic Rationale</label>
                    <div className="relative group">
                      <ChatBubbleBottomCenterTextIcon className="absolute left-6 top-6 h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                      <textarea
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full pl-16 pr-6 py-5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-text-primary italic"
                      />

                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-10 border-t border-border">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard/expenses')}
                    className="px-8 py-5 bg-surface text-text-primary border border-border rounded-xl font-black uppercase text-xs tracking-widest hover:bg-secondary transition-all"
                  >

                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 md:flex-none inline-flex items-center justify-center px-12 py-5 bg-primary text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 disabled:opacity-50 shadow-premium hover:scale-105 transition-all group"
                  >

                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                    ) : (
                      <>
                        Sync Changes
                        <ArrowPathIcon className="h-5 w-5 ml-3 group-hover:rotate-180 transition-transform duration-700" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900 p-8 rounded-xl border border-white/5 shadow-massive relative overflow-hidden text-white">

            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheckIcon className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <h3 className="text-h-m font-black italic uppercase tracking-tighter mb-6">Audit Integrity</h3>
              <p className="text-sm font-medium text-slate-300 leading-relaxed italic mb-8">
                Modification of records is permitted only during the pre-authorization phase.
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">

                  <div className="text-[10px] font-black uppercase tracking-widest text-accent mb-1">Status Restriction</div>
                  <div className="text-xs font-bold text-slate-400 italic">This record is currently PENDING. Updates will not reset the audit timeline.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditExpense;
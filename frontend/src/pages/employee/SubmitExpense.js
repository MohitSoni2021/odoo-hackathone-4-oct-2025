import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createExpense } from '../../store/slices/expenseSlice';
import { toast } from 'react-toastify';
import {
  DocumentTextIcon,
  CameraIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  SparklesIcon,
  BanknotesIcon,
  CalendarIcon,
  TagIcon,
  ChatBubbleBottomCenterTextIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';


const SubmitExpense = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    currency: 'USD',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
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

  const handleOCRScan = async () => {
    if (!formData.receipt) {
      toast.error('Primary artifact required for OCR optimization.');
      return;
    }
    setOcrLoading(true);
    setTimeout(() => {
      const mockOCRData = {
        title: 'Corporate Strategy Lunch',
        description: 'Strategic alignment session with departmental leads.',
        amount: '125.50',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
      };
      setFormData((prev) => ({
        ...prev,
        ...mockOCRData,
      }));
      setOcrLoading(false);
      toast.success('Artifact synthesized! Please verify the extracted data points.');
    }, 2000);
  };

  const removeReceipt = () => {
    setReceiptPreview(null);
    setFormData((prev) => ({
      ...prev,
      receipt: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
      await dispatch(createExpense(expenseData)).unwrap();
      toast.success('Capital request successfully integrated into the audit queue!');
      navigate('/dashboard/expenses');
    } catch (error) {
      toast.error(error.message || 'Integration sequence failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 font-inter">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-primary rounded-xl shadow-premium">
            <PencilSquareIcon className="h-8 w-8 text-white" />
          </div>

          <div>
            <h1 className="text-h-xl font-bold text-text-primary tracking-tight italic uppercase">Expenditure Initiation</h1>
            <p className="text-body text-text-muted opacity-80">
              Inject a new capital request into the corporate verification matrix.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Form Area */}
        <div className="lg:col-span-8">
          <div className="bg-surface rounded-xl border border-border shadow-massive overflow-hidden">

            <form onSubmit={handleSubmit} className="p-10 space-y-10">
              
              {/* Receipt Upload Matrix */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                <div className={`relative bg-secondary/30 rounded-xl p-10 border-2 border-dashed transition-all duration-500 ${receiptPreview ? 'border-primary/40 bg-primary/5' : 'border-border hover:border-accent/40'}`}>

                  {!receiptPreview ? (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-surface rounded-xl flex items-center justify-center mx-auto mb-6 shadow-premium">
                        <CloudArrowUpIcon className="h-10 w-10 text-accent" />
                      </div>

                      <h3 className="text-lg font-black text-text-primary tracking-tight uppercase italic">Audit Artifact</h3>
                      <p className="mt-2 text-xs text-text-muted font-bold tracking-widest uppercase opacity-60">
                        PNG, JPG or PDF up to 5MB
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-8 inline-flex items-center px-8 py-4 bg-surface text-text-primary border border-border rounded-xl font-black uppercase text-xs tracking-widest hover:bg-secondary hover:border-accent/40 transition-all shadow-sm"
                      >

                        <CameraIcon className="h-5 w-5 mr-3 text-accent" />
                        Select Artifact
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
                      <div className="mt-8 flex justify-center">
                        <button
                          type="button"
                          onClick={handleOCRScan}
                          disabled={ocrLoading}
                          className="inline-flex items-center px-8 py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-black disabled:opacity-50 shadow-massive group"
                        >
                          <SparklesIcon className={`h-5 w-5 mr-3 text-accent ${ocrLoading ? 'animate-pulse' : 'group-hover:rotate-12'}`} />
                          {ocrLoading ? 'Synthesizing...' : 'Optimize via OCR'}
                        </button>
                      </div>
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

              {/* Data Input Grid */}
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
                        className="w-full pl-16 pr-6 py-5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-bold text-text-primary placeholder:text-text-muted/40"
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
                        className="w-full pl-16 pr-6 py-5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-text-primary cursor-pointer"
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
                        className="w-full pl-16 pr-6 py-5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all font-bold text-text-primary placeholder:text-text-muted/40"
                        placeholder="0.00"
                      />

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
                        className="w-full pl-16 pr-6 py-5 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-text-primary placeholder:text-text-muted/40 italic"
                        placeholder="Provide detailed strategic justification..."
                      />

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

                    Abort Request
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
                        Inject Request
                        <ArrowRightIcon className="h-5 w-5 ml-3 group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar Info Area */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900 p-8 rounded-xl border border-white/5 shadow-massive relative overflow-hidden text-white">

            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheckIcon className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-accent/20 rounded-xl">
                  <SparklesIcon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-h-m font-black italic uppercase tracking-tighter">OCR Synthesis</h3>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-medium text-slate-300 leading-relaxed italic">
                  Upload your verification artifact to enable our neural extraction engine.
                </p>
                <ul className="space-y-3">
                  {[
                    'Automated capital extraction',
                    'Strategic domain identification',
                    'Temporal marker synchronization',
                    'Rationalization suggestion'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10 text-[10px] font-bold italic text-slate-400">

                Strategic Intelligence Note: Manual verification is mandatory before final injection.
              </div>
            </div>
          </div>

          <div className="bg-surface p-10 rounded-xl border border-border shadow-premium group hover:border-primary/30 transition-all">

            <h4 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-4">Investment Governance</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-secondary rounded-lg">
                  <DocumentTextIcon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs text-text-muted font-medium italic leading-relaxed">
                  Every request must be accompanied by a valid corporate justification artifact.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-secondary rounded-lg">
                  <CalendarIcon className="h-5 w-5 text-accent" />
                </div>
                <p className="text-xs text-text-muted font-medium italic leading-relaxed">
                  Timeline markers must reflect the actual date of capital impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitExpense;
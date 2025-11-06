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
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Create preview
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
      toast.error('Please upload a receipt first');
      return;
    }

    setOcrLoading(true);
    
    // Simulate OCR processing (In production, this would call an OCR API like Tesseract.js or Google Vision API)
    setTimeout(() => {
      // Mock OCR results
      const mockOCRData = {
        title: 'Business Lunch',
        description: 'Team lunch at restaurant',
        amount: '125.50',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
      };

      setFormData((prev) => ({
        ...prev,
        ...mockOCRData,
      }));

      setOcrLoading(false);
      toast.success('Receipt scanned successfully! Please review the details.');
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

    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!formData.date) {
      toast.error('Please select a date');
      return;
    }

    setLoading(true);

    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      await dispatch(createExpense(expenseData)).unwrap();
      toast.success('Expense submitted successfully!');
      navigate('/dashboard/expenses');
    } catch (error) {
      toast.error(error.message || 'Failed to submit expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <DocumentTextIcon className="h-6 w-6 text-teal-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Submit New Expense
            </h2>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Fill in the details below or use OCR to scan your receipt
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Receipt Upload Section */}
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-6 border-2 border-dashed border-teal-300">
            <div className="text-center">
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-teal-600" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Upload Receipt (Optional)
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>

              <div className="mt-4 flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
                >
                  <CameraIcon className="h-5 w-5 mr-2" />
                  Choose File
                </button>

                {receiptPreview && (
                  <button
                    type="button"
                    onClick={handleOCRScan}
                    disabled={ocrLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400"
                  >
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    {ocrLoading ? 'Scanning...' : 'Scan with OCR'}
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Receipt Preview */}
            {receiptPreview && (
              <div className="mt-4 relative">
                <img
                  src={receiptPreview}
                  alt="Receipt preview"
                  className="mx-auto max-h-64 rounded-lg shadow-lg"
                />
                <button
                  type="button"
                  onClick={removeReceipt}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            )}

            {ocrLoading && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mr-3"></div>
                  <span className="text-sm text-gray-700">
                    Scanning receipt with OCR...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Title */}
            <div className="sm:col-span-2">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                placeholder="e.g., Client Dinner, Taxi to Airport"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                id="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                id="date"
                required
                value={formData.date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              />
            </div>

            {/* Amount */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                id="amount"
                required
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>

            {/* Currency */}
            <div>
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-700"
              >
                Currency <span className="text-red-500">*</span>
              </label>
              <select
                name="currency"
                id="currency"
                required
                value={formData.currency}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                placeholder="Provide additional details about this expense..."
              />
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700"
              >
                Additional Notes
              </label>
              <textarea
                name="notes"
                id="notes"
                rows={2}
                value={formData.notes}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                placeholder="Any additional information..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard/expenses')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Submit Expense
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <SparklesIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              OCR Feature (Beta)
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Upload a receipt image and click "Scan with OCR" to automatically
                extract expense details. This feature uses optical character
                recognition to read text from your receipts.
              </p>
              <p className="mt-2">
                <strong>Note:</strong> Always review the extracted information for
                accuracy before submitting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitExpense;
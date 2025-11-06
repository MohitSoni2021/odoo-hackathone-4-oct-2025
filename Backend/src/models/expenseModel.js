const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide expense title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide expense amount'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      required: [true, 'Please provide currency'],
      default: 'USD',
    },
    category: {
      type: String,
      required: [true, 'Please provide expense category'],
      enum: [
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
      ],
    },
    date: {
      type: Date,
      required: [true, 'Please provide expense date'],
      default: Date.now,
    },
    receipt: {
      url: String,
      publicId: String,
    },
    status: {
      type: String,
      enum: ['pending', 'approved_by_manager', 'approved', 'rejected', 'reimbursed'],
      default: 'pending',
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Expense must belong to a user'],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Expense must belong to a company'],
    },
    approvedByManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    managerApprovedAt: {
      type: Date,
    },
    approvedByAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    adminApprovedAt: {
      type: Date,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectedAt: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
expenseSchema.index({ submittedBy: 1, status: 1 });
expenseSchema.index({ company: 1, status: 1 });
expenseSchema.index({ date: -1 });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
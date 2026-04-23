const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Notification must have a recipient'],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: [
        'expense_submitted',
        'expense_approved',
        'expense_approved_by_manager',
        'expense_pending_admin_approval',
        'expense_rejected',
        'expense_reimbursed',
        'user_added',
        'role_changed',
        'system',
      ],
      required: [true, 'Please provide notification type'],
    },
    title: {
      type: String,
      required: [true, 'Please provide notification title'],
    },
    message: {
      type: String,
      required: [true, 'Please provide notification message'],
    },
    relatedExpense: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expense',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
const Expense = require('../models/expenseModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');
const currencyService = require('../services/currencyService');

// Create new expense (Employee)
exports.createExpense = async (req, res) => {
  try {
    const { title, description, amount, currency, category, date, receipt, notes } = req.body;
    
    const expense = await Expense.create({
      title,
      description,
      amount,
      currency,
      category,
      date,
      receipt,
      notes,
      submittedBy: req.user._id,
      company: req.user.company,
    });
    
    // Notify manager if employee has one
    if (req.user.manager) {
      await Notification.create({
        recipient: req.user.manager,
        sender: req.user._id,
        type: 'expense_submitted',
        title: 'New Expense Submitted',
        message: `${req.user.firstName} ${req.user.lastName} submitted an expense of ${currency} ${amount}`,
        relatedExpense: expense._id,
      });
    }
    
    // Notify all admins
    const admins = await User.find({
      company: req.user.company,
      role: 'admin',
      _id: { $ne: req.user._id },
    });
    
    for (const admin of admins) {
      await Notification.create({
        recipient: admin._id,
        sender: req.user._id,
        type: 'expense_submitted',
        title: 'New Expense Submitted',
        message: `${req.user.firstName} ${req.user.lastName} submitted an expense of ${currency} ${amount}`,
        relatedExpense: expense._id,
      });
    }
    
    const populatedExpense = await Expense.findById(expense._id)
      .populate('submittedBy', 'firstName lastName email');
    
    res.status(201).json({
      status: 'success',
      data: {
        expense: populatedExpense,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get all expenses (with filters)
exports.getAllExpenses = async (req, res) => {
  try {
    const { status, category, startDate, endDate, submittedBy } = req.query;
    
    // Build query based on user role
    let query = { company: req.user.company };
    
    // If employee, only show their expenses
    if (req.user.role === 'employee') {
      query.submittedBy = req.user._id;
    }
    
    // If manager, show their employees' expenses + their own
    if (req.user.role === 'manager') {
      const employees = await User.find({ manager: req.user._id });
      const employeeIds = employees.map(emp => emp._id);
      query.submittedBy = { $in: [...employeeIds, req.user._id] };
    }
    
    // Apply filters
    if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    if (submittedBy && req.user.role !== 'employee') {
      query.submittedBy = submittedBy;
    }
    
    const expenses = await Expense.find(query)
      .populate('submittedBy', 'firstName lastName email')
      .populate('approvedBy', 'firstName lastName email')
      .populate('approvedByManager', 'firstName lastName email')
      .populate('approvedByAdmin', 'firstName lastName email')
      .populate('rejectedBy', 'firstName lastName email')
      .sort('-createdAt');
    
    // Convert expenses to user's preferred currency if requested
    let convertedExpenses = expenses;
    const userPreferredCurrency = req.user.preferredCurrency || 'USD';
    const convertCurrency = req.query.convert !== 'false'; // Default to true
    
    if (convertCurrency && expenses.length > 0) {
      try {
        convertedExpenses = await currencyService.convertExpenses(expenses, userPreferredCurrency);
      } catch (error) {
        console.error('Currency conversion error:', error.message);
        // Continue with original expenses if conversion fails
      }
    }
    
    res.status(200).json({
      status: 'success',
      results: convertedExpenses.length,
      data: {
        expenses: convertedExpenses,
        userCurrency: userPreferredCurrency,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get single expense
exports.getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('submittedBy', 'firstName lastName email')
      .populate('approvedBy', 'firstName lastName email')
      .populate('company');
    
    if (!expense) {
      return res.status(404).json({
        status: 'fail',
        message: 'No expense found with that ID',
      });
    }
    
    // Check permissions
    if (
      req.user.role === 'employee' &&
      expense.submittedBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to access this expense',
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        expense,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Update expense (Employee - only their own pending expenses)
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({
        status: 'fail',
        message: 'No expense found with that ID',
      });
    }
    
    // Check if user owns the expense
    if (expense.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only update your own expenses',
      });
    }
    
    // Can only update pending expenses
    if (expense.status !== 'pending') {
      return res.status(400).json({
        status: 'fail',
        message: 'You can only update pending expenses',
      });
    }
    
    const { title, description, amount, currency, category, date, receipt, notes } = req.body;
    
    if (title) expense.title = title;
    if (description) expense.description = description;
    if (amount) expense.amount = amount;
    if (currency) expense.currency = currency;
    if (category) expense.category = category;
    if (date) expense.date = date;
    if (receipt) expense.receipt = receipt;
    if (notes) expense.notes = notes;
    
    await expense.save();
    
    const updatedExpense = await Expense.findById(expense._id)
      .populate('submittedBy', 'firstName lastName email');
    
    res.status(200).json({
      status: 'success',
      data: {
        expense: updatedExpense,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Delete expense (Employee - only their own pending expenses)
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({
        status: 'fail',
        message: 'No expense found with that ID',
      });
    }
    
    // Check if user owns the expense
    if (expense.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only delete your own expenses',
      });
    }
    
    // Can only delete pending expenses
    if (expense.status !== 'pending') {
      return res.status(400).json({
        status: 'fail',
        message: 'You can only delete pending expenses',
      });
    }
    
    await Expense.findByIdAndDelete(req.params.id);
    
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Approve expense (Manager/Admin)
exports.approveExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('submittedBy', 'firstName lastName email manager');
    
    if (!expense) {
      return res.status(404).json({
        status: 'fail',
        message: 'No expense found with that ID',
      });
    }
    
    console.log('Approve Expense Request:', {
      expenseId: req.params.id,
      userRole: req.user.role,
      userId: req.user._id,
      expenseStatus: expense.status,
      submittedBy: expense.submittedBy._id,
      submittedByManager: expense.submittedBy.manager,
    });
    
    // Manager approval flow
    if (req.user.role === 'manager') {
      // Check if expense is pending
      if (expense.status !== 'pending') {
        return res.status(400).json({
          status: 'fail',
          message: 'Only pending expenses can be approved by manager',
        });
      }
      
      // Manager can only approve expenses from their team members
      // Check if the expense submitter has a manager assigned
      if (!expense.submittedBy.manager) {
        return res.status(403).json({
          status: 'fail',
          message: 'This expense was submitted by a user without an assigned manager',
        });
      }
      
      // Check if the manager is the current user
      if (expense.submittedBy.manager.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: 'fail',
          message: 'You can only approve expenses from your team members',
        });
      }
      
      expense.status = 'approved_by_manager';
      expense.approvedByManager = req.user._id;
      expense.managerApprovedAt = Date.now();
      
      await expense.save();
      
      // Notify the employee
      await Notification.create({
        recipient: expense.submittedBy._id,
        sender: req.user._id,
        type: 'expense_approved_by_manager',
        title: 'Expense Approved by Manager',
        message: `Your expense "${expense.title}" has been approved by your manager. Waiting for admin approval.`,
        relatedExpense: expense._id,
      });
      
      // Notify all admins
      const admins = await User.find({
        company: req.user.company,
        role: 'admin',
      });
      
      for (const admin of admins) {
        await Notification.create({
          recipient: admin._id,
          sender: req.user._id,
          type: 'expense_pending_admin_approval',
          title: 'Expense Pending Admin Approval',
          message: `Manager approved expense "${expense.title}" from ${expense.submittedBy.firstName} ${expense.submittedBy.lastName}. Amount: ${expense.currency} ${expense.amount}`,
          relatedExpense: expense._id,
        });
      }
      
      const updatedExpense = await Expense.findById(expense._id)
        .populate('submittedBy', 'firstName lastName email')
        .populate('approvedByManager', 'firstName lastName email');
      
      return res.status(200).json({
        status: 'success',
        message: 'Expense approved by manager. Waiting for admin approval.',
        data: {
          expense: updatedExpense,
        },
      });
    }
    
    // Admin approval flow
    if (req.user.role === 'admin') {
      // Admin can approve expenses that are approved by manager
      if (expense.status !== 'approved_by_manager') {
        return res.status(400).json({
          status: 'fail',
          message: 'Only expenses approved by manager can be approved by admin',
        });
      }
      
      expense.status = 'approved';
      expense.approvedByAdmin = req.user._id;
      expense.adminApprovedAt = Date.now();
      expense.approvedBy = req.user._id;
      expense.approvedAt = Date.now();
      
      await expense.save();
      
      // Notify the employee
      await Notification.create({
        recipient: expense.submittedBy._id,
        sender: req.user._id,
        type: 'expense_approved',
        title: 'Expense Fully Approved',
        message: `Your expense "${expense.title}" has been fully approved by admin`,
        relatedExpense: expense._id,
      });
      
      // Notify the manager
      if (expense.approvedByManager) {
        await Notification.create({
          recipient: expense.approvedByManager,
          sender: req.user._id,
          type: 'expense_approved',
          title: 'Expense Fully Approved',
          message: `Expense "${expense.title}" has been approved by admin`,
          relatedExpense: expense._id,
        });
      }
      
      const updatedExpense = await Expense.findById(expense._id)
        .populate('submittedBy', 'firstName lastName email')
        .populate('approvedByManager', 'firstName lastName email')
        .populate('approvedByAdmin', 'firstName lastName email');
      
      return res.status(200).json({
        status: 'success',
        message: 'Expense fully approved by admin',
        data: {
          expense: updatedExpense,
        },
      });
    }
    
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Reject expense (Manager/Admin)
exports.rejectExpense = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    
    if (!rejectionReason) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a rejection reason',
      });
    }
    
    const expense = await Expense.findById(req.params.id)
      .populate('submittedBy', 'firstName lastName email manager');
    
    if (!expense) {
      return res.status(404).json({
        status: 'fail',
        message: 'No expense found with that ID',
      });
    }
    
    // Manager rejection flow
    if (req.user.role === 'manager') {
      // Manager can only reject pending expenses
      if (expense.status !== 'pending') {
        return res.status(400).json({
          status: 'fail',
          message: 'Only pending expenses can be rejected by manager',
        });
      }
      
      // Manager can only reject expenses from their team members
      if (expense.submittedBy.manager && expense.submittedBy.manager.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: 'fail',
          message: 'You can only reject expenses from your team members',
        });
      }
    }
    
    // Admin rejection flow
    if (req.user.role === 'admin') {
      // Admin can reject expenses that are approved by manager or pending
      if (expense.status !== 'approved_by_manager' && expense.status !== 'pending') {
        return res.status(400).json({
          status: 'fail',
          message: 'Only pending or manager-approved expenses can be rejected by admin',
        });
      }
    }
    
    expense.status = 'rejected';
    expense.rejectedBy = req.user._id;
    expense.rejectedAt = Date.now();
    expense.rejectionReason = rejectionReason;
    
    await expense.save();
    
    // Notify the employee
    await Notification.create({
      recipient: expense.submittedBy._id,
      sender: req.user._id,
      type: 'expense_rejected',
      title: 'Expense Rejected',
      message: `Your expense "${expense.title}" has been rejected by ${req.user.role}. Reason: ${rejectionReason}`,
      relatedExpense: expense._id,
    });
    
    // If admin rejected a manager-approved expense, notify the manager
    if (req.user.role === 'admin' && expense.approvedByManager) {
      await Notification.create({
        recipient: expense.approvedByManager,
        sender: req.user._id,
        type: 'expense_rejected',
        title: 'Expense Rejected by Admin',
        message: `Expense "${expense.title}" that you approved has been rejected by admin. Reason: ${rejectionReason}`,
        relatedExpense: expense._id,
      });
    }
    
    const updatedExpense = await Expense.findById(expense._id)
      .populate('submittedBy', 'firstName lastName email')
      .populate('rejectedBy', 'firstName lastName email')
      .populate('approvedByManager', 'firstName lastName email');
    
    res.status(200).json({
      status: 'success',
      message: `Expense rejected by ${req.user.role}`,
      data: {
        expense: updatedExpense,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get expense statistics
exports.getExpenseStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let matchQuery = { company: req.user.company };
    
    // Filter by user role
    if (req.user.role === 'employee') {
      matchQuery.submittedBy = req.user._id;
    } else if (req.user.role === 'manager') {
      const employees = await User.find({ manager: req.user._id });
      const employeeIds = employees.map(emp => emp._id);
      matchQuery.submittedBy = { $in: [...employeeIds, req.user._id] };
    }
    
    // Date filter
    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = new Date(startDate);
      if (endDate) matchQuery.date.$lte = new Date(endDate);
    }
    
    // Status statistics
    const statusStats = await Expense.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);
    
    // Category statistics
    const categoryStats = await Expense.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);
    
    // Monthly statistics
    const monthlyStats = await Expense.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);
    
    // Total statistics
    const totalExpenses = await Expense.countDocuments(matchQuery);
    const totalAmount = await Expense.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);
    
    res.status(200).json({
      status: 'success',
      data: {
        statusStats,
        categoryStats,
        monthlyStats,
        totalExpenses,
        totalAmount: totalAmount[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get pending expenses count
exports.getPendingCount = async (req, res) => {
  try {
    let query = { company: req.user.company, status: 'pending' };
    
    // If manager, only count their employees' expenses
    if (req.user.role === 'manager') {
      const employees = await User.find({ manager: req.user._id });
      const employeeIds = employees.map(emp => emp._id);
      query.submittedBy = { $in: employeeIds };
    }
    
    const count = await Expense.countDocuments(query);
    
    res.status(200).json({
      status: 'success',
      data: {
        count,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get manager-approved expenses (Admin only)
exports.getManagerApprovedExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      company: req.user.company,
      status: 'approved_by_manager',
    })
      .populate('submittedBy', 'firstName lastName email')
      .populate('approvedByManager', 'firstName lastName email')
      .sort('-managerApprovedAt');
    
    res.status(200).json({
      status: 'success',
      results: expenses.length,
      data: {
        expenses,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get comprehensive manager analytics
exports.getManagerAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, period = 'month' } = req.query;
    
    // Get team members
    const employees = await User.find({ manager: req.user._id });
    const employeeIds = employees.map(emp => emp._id);
    
    // Base query for team expenses
    let matchQuery = {
      company: req.user.company,
      submittedBy: { $in: employeeIds }
    };
    
    // Date filter
    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = new Date(startDate);
      if (endDate) matchQuery.date.$lte = new Date(endDate);
    }
    
    // 1. Team Spending Overview (current month vs previous month)
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    
    const currentMonthExpenses = await Expense.aggregate([
      {
        $match: {
          ...matchQuery,
          date: { $gte: currentMonthStart }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    const previousMonthExpenses = await Expense.aggregate([
      {
        $match: {
          ...matchQuery,
          date: { $gte: previousMonthStart, $lte: previousMonthEnd }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    const currentTotal = currentMonthExpenses[0]?.total || 0;
    const previousTotal = previousMonthExpenses[0]?.total || 0;
    const percentageChange = previousTotal > 0 
      ? ((currentTotal - previousTotal) / previousTotal * 100).toFixed(2)
      : 0;
    
    // Status breakdown
    const statusBreakdown = await Expense.aggregate([
      {
        $match: {
          ...matchQuery,
          date: { $gte: currentMonthStart }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);
    
    // 2. Monthly Trends (last 12 months)
    const monthlyTrends = await Expense.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);
    
    // 3. Category-wise breakdown
    const categoryBreakdown = await Expense.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);
    
    // 4. Top employees by expenses
    const topEmployees = await Expense.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$submittedBy',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 10 }
    ]);
    
    // Populate employee details
    const populatedTopEmployees = await User.populate(topEmployees, {
      path: '_id',
      select: 'firstName lastName email'
    });
    
    // 5. Approval Queue Status
    const pendingApprovals = await Expense.countDocuments({
      ...matchQuery,
      status: 'pending'
    });
    
    // Calculate average approval time for manager
    const approvedByManager = await Expense.find({
      approvedByManager: req.user._id,
      managerApprovedAt: { $exists: true }
    }).select('createdAt managerApprovedAt');
    
    let avgApprovalTime = 0;
    if (approvedByManager.length > 0) {
      const totalTime = approvedByManager.reduce((sum, exp) => {
        const timeDiff = exp.managerApprovedAt - exp.createdAt;
        return sum + timeDiff;
      }, 0);
      avgApprovalTime = Math.round(totalTime / approvedByManager.length / (1000 * 60 * 60)); // in hours
    }
    
    // 6. Expense Status Heatmap (submission patterns)
    const submissionHeatmap = await Expense.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            dayOfWeek: { $dayOfWeek: '$createdAt' },
            hour: { $hour: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.dayOfWeek': 1, '_id.hour': 1 } }
    ]);
    
    // 7. Currency insights
    const currencyBreakdown = await Expense.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$currency',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);
    
    // 8. Rejected expense analysis
    const rejectedExpenses = await Expense.aggregate([
      {
        $match: {
          ...matchQuery,
          status: 'rejected'
        }
      },
      {
        $group: {
          _id: '$rejectionReason',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // 9. Budget tracking (if applicable)
    const totalTeamExpenses = await Expense.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // 10. Recent activity
    const recentExpenses = await Expense.find(matchQuery)
      .populate('submittedBy', 'firstName lastName email')
      .sort('-createdAt')
      .limit(10);
    
    res.status(200).json({
      status: 'success',
      data: {
        teamOverview: {
          currentMonth: {
            total: currentTotal,
            count: currentMonthExpenses[0]?.count || 0
          },
          previousMonth: {
            total: previousTotal,
            count: previousMonthExpenses[0]?.count || 0
          },
          percentageChange: parseFloat(percentageChange),
          statusBreakdown
        },
        monthlyTrends,
        categoryBreakdown,
        topEmployees: populatedTopEmployees,
        approvalQueue: {
          pendingCount: pendingApprovals,
          avgApprovalTimeHours: avgApprovalTime
        },
        submissionHeatmap,
        currencyBreakdown,
        rejectedAnalysis: rejectedExpenses,
        totalStats: {
          totalAmount: totalTeamExpenses[0]?.total || 0,
          totalCount: totalTeamExpenses[0]?.count || 0,
          teamSize: employees.length
        },
        recentActivity: recentExpenses
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};
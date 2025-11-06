const express = require('express');
const expenseController = require('../controllers/expenseController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

// Routes accessible by all authenticated users
router
  .route('/')
  .get(expenseController.getAllExpenses)
  .post(expenseController.createExpense);

router.get('/stats', expenseController.getExpenseStats);
router.get('/pending-count', authController.restrictTo('manager', 'admin'), expenseController.getPendingCount);
router.get('/manager-approved', authController.restrictTo('admin'), expenseController.getManagerApprovedExpenses);
router.get('/manager-analytics', authController.restrictTo('manager', 'admin'), expenseController.getManagerAnalytics);

router
  .route('/:id')
  .get(expenseController.getExpense)
  .patch(expenseController.updateExpense)
  .delete(expenseController.deleteExpense);

// Routes for managers and admins
router.patch('/:id/approve', authController.restrictTo('manager', 'admin'), expenseController.approveExpense);
router.patch('/:id/reject', authController.restrictTo('manager', 'admin'), expenseController.rejectExpense);

module.exports = router;
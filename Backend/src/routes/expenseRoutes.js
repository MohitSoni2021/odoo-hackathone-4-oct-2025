const express = require('express');
const expenseController = require('../controllers/expenseController');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expense management API
 */

// Protect all routes
router.use(authController.protect);

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Get all expenses for the current user
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of expenses retrieved successfully
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - description
 *               - category
 *               - date
 *             properties:
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Expense created successfully
 */
router
  .route('/')
  .get(expenseController.getAllExpenses)
  .post(expenseController.createExpense);

/**
 * @swagger
 * /api/expenses/stats:
 *   get:
 *     summary: Get expense statistics for the current user
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Expense statistics retrieved successfully
 */
router.get('/stats', expenseController.getExpenseStats);

/**
 * @swagger
 * /api/expenses/pending-count:
 *   get:
 *     summary: Get count of pending expenses (Managers/Admins only)
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending count retrieved successfully
 */
router.get('/pending-count', authController.restrictTo('manager', 'admin'), expenseController.getPendingCount);

/**
 * @swagger
 * /api/expenses/manager-approved:
 *   get:
 *     summary: Get manager approved expenses (Admins only)
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Manager approved expenses retrieved successfully
 */
router.get('/manager-approved', authController.restrictTo('admin'), expenseController.getManagerApprovedExpenses);

/**
 * @swagger
 * /api/expenses/manager-analytics:
 *   get:
 *     summary: Get analytics for managers (Managers/Admins only)
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Manager analytics retrieved successfully
 */
router.get('/manager-analytics', authController.restrictTo('manager', 'admin'), expenseController.getManagerAnalytics);

/**
 * @swagger
 * /api/expenses/{id}:
 *   get:
 *     summary: Get a specific expense by ID
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense retrieved successfully
 *   patch:
 *     summary: Update an expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *   delete:
 *     summary: Delete an expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Expense deleted successfully
 */
router
  .route('/:id')
  .get(expenseController.getExpense)
  .patch(expenseController.updateExpense)
  .delete(expenseController.deleteExpense);

/**
 * @swagger
 * /api/expenses/{id}/approve:
 *   patch:
 *     summary: Approve an expense (Managers/Admins only)
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense approved successfully
 */
router.patch('/:id/approve', authController.restrictTo('manager', 'admin'), expenseController.approveExpense);

/**
 * @swagger
 * /api/expenses/{id}/reject:
 *   patch:
 *     summary: Reject an expense (Managers/Admins only)
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rejectionReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Expense rejected successfully
 */
router.patch('/:id/reject', authController.restrictTo('manager', 'admin'), expenseController.rejectExpense);

module.exports = router;
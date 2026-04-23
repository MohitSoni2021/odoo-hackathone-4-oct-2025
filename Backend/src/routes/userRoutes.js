const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management API
 */

// Protect all routes after this middleware
router.use(authController.protect);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */
router.get('/me', authController.getMe);

/**
 * @swagger
 * /api/users/updateMe:
 *   patch:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 */
router.patch('/updateMe', userController.updateMe);

/**
 * @swagger
 * /api/users/my-employees:
 *   get:
 *     summary: Get employees managed by the current user (Managers/Admins only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of employees retrieved successfully
 */
router.get('/my-employees', authController.restrictTo('manager', 'admin'), userController.getMyEmployees);

/**
 * @swagger
 * /api/users/my-team:
 *   get:
 *     summary: Get team members of the current user (Managers/Admins only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Team members retrieved successfully
 */
router.get('/my-team', authController.restrictTo('manager', 'admin'), userController.getMyTeam);

// Routes for admin only
router.use(authController.restrictTo('admin'));

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admins only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *   post:
 *     summary: Create a new user (Admins only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, manager, admin]
 *     responses:
 *       201:
 *         description: User created successfully
 */
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: Get user statistics (Admins only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 */
router.get('/stats', userController.getUserStats);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a specific user by ID (Admins only)
 *     tags: [Users]
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
 *         description: User retrieved successfully
 *   patch:
 *     summary: Update a user (Admins only)
 *     tags: [Users]
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, manager, admin]
 *     responses:
 *       200:
 *         description: User updated successfully
 *   delete:
 *     summary: Delete a user (Admins only)
 *     tags: [Users]
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
 *         description: User deleted successfully
 */
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
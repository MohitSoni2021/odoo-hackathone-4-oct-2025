const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Routes for current user
router.get('/me', authController.getMe);
router.patch('/updateMe', userController.updateMe);

// Routes for managers
router.get('/my-employees', authController.restrictTo('manager', 'admin'), userController.getMyEmployees);
router.get('/my-team', authController.restrictTo('manager', 'admin'), userController.getMyTeam);

// Routes for admin only
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.get('/stats', userController.getUserStats);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
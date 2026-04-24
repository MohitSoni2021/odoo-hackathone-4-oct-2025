const express = require('express');
const superAdminController = require('../controllers/superAdminController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo('superadmin'));

/**
 * @swagger
 * /api/superadmin/hierarchy:
 *   get:
 *     summary: Get all companies and their user hierarchy
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hierarchy retrieved successfully
 */
router.get('/hierarchy', superAdminController.getFullHierarchy);
router.post('/change-password', superAdminController.changeUserPassword);

module.exports = router;

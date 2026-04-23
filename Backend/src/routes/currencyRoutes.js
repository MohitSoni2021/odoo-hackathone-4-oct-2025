const express = require('express');
const currencyController = require('../controllers/currencyController');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Currency
 *   description: Currency and exchange rate API
 */

// Protect all routes
router.use(authController.protect);

/**
 * @swagger
 * /api/currency/currencies:
 *   get:
 *     summary: Get supported currencies
 *     tags: [Currency]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of supported currencies retrieved successfully
 */
router.get('/currencies', currencyController.getSupportedCurrencies);

/**
 * @swagger
 * /api/currency/rates:
 *   get:
 *     summary: Get exchange rates
 *     tags: [Currency]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Exchange rates retrieved successfully
 */
router.get('/rates', currencyController.getExchangeRates);

/**
 * @swagger
 * /api/currency/convert:
 *   get:
 *     summary: Convert amount between currencies
 *     tags: [Currency]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: amount
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Conversion successful
 */
router.get('/convert', currencyController.convertAmount);

module.exports = router;
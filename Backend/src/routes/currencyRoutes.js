const express = require('express');
const currencyController = require('../controllers/currencyController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

// Get supported currencies
router.get('/currencies', currencyController.getSupportedCurrencies);

// Get exchange rates
router.get('/rates', currencyController.getExchangeRates);

// Convert amount
router.get('/convert', currencyController.convertAmount);

module.exports = router;
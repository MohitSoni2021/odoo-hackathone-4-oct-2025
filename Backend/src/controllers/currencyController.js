const currencyService = require('../services/currencyService');

// Get supported currencies
exports.getSupportedCurrencies = async (req, res) => {
  try {
    const currencies = await currencyService.getSupportedCurrencies();
    
    res.status(200).json({
      status: 'success',
      results: currencies.length,
      data: {
        currencies,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get exchange rates
exports.getExchangeRates = async (req, res) => {
  try {
    const { from, to } = req.query;
    
    if (!from) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide base currency (from parameter)',
      });
    }
    
    const targetCurrencies = to ? to.split(',') : [];
    const rates = await currencyService.getExchangeRates(from, targetCurrencies);
    
    res.status(200).json({
      status: 'success',
      data: {
        rates,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Convert amount
exports.convertAmount = async (req, res) => {
  try {
    const { amount, from, to } = req.query;
    
    if (!amount || !from || !to) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide amount, from currency, and to currency',
      });
    }
    
    const result = await currencyService.convertCurrency(
      parseFloat(amount),
      from.toUpperCase(),
      to.toUpperCase()
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        conversion: result,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
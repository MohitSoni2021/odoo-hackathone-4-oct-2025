const axios = require('axios');

const FRANKFURTER_API_BASE = 'https://api.frankfurter.app';

/**
 * Currency Service for converting amounts using Frankfurter API
 */
class CurrencyService {
  /**
   * Get latest exchange rates
   * @param {string} baseCurrency - Base currency code (e.g., 'USD')
   * @param {string[]} targetCurrencies - Array of target currency codes
   * @returns {Promise<Object>} Exchange rates
   */
  async getExchangeRates(baseCurrency = 'USD', targetCurrencies = []) {
    try {
      let url = `${FRANKFURTER_API_BASE}/latest?from=${baseCurrency}`;
      
      if (targetCurrencies && targetCurrencies.length > 0) {
        url += `&to=${targetCurrencies.join(',')}`;
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching exchange rates:', error.message);
      throw new Error('Failed to fetch exchange rates');
    }
  }

  /**
   * Convert amount from one currency to another
   * @param {number} amount - Amount to convert
   * @param {string} fromCurrency - Source currency code
   * @param {string} toCurrency - Target currency code
   * @returns {Promise<Object>} Converted amount and rate
   */
  async convertCurrency(amount, fromCurrency, toCurrency) {
    try {
      // If currencies are the same, no conversion needed
      if (fromCurrency === toCurrency) {
        return {
          amount: amount,
          originalAmount: amount,
          originalCurrency: fromCurrency,
          convertedCurrency: toCurrency,
          rate: 1,
          date: new Date().toISOString().split('T')[0],
        };
      }

      const url = `${FRANKFURTER_API_BASE}/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`;
      const response = await axios.get(url);
      
      return {
        amount: response.data.rates[toCurrency],
        originalAmount: amount,
        originalCurrency: fromCurrency,
        convertedCurrency: toCurrency,
        rate: response.data.rates[toCurrency] / amount,
        date: response.data.date,
      };
    } catch (error) {
      console.error('Error converting currency:', error.message);
      // Return original amount if conversion fails
      return {
        amount: amount,
        originalAmount: amount,
        originalCurrency: fromCurrency,
        convertedCurrency: toCurrency,
        rate: 1,
        error: 'Conversion failed, showing original amount',
      };
    }
  }

  /**
   * Convert multiple expenses to target currency
   * @param {Array} expenses - Array of expense objects
   * @param {string} targetCurrency - Target currency code
   * @returns {Promise<Array>} Expenses with converted amounts
   */
  async convertExpenses(expenses, targetCurrency) {
    try {
      if (!expenses || expenses.length === 0) {
        return [];
      }

      // Get unique currencies from expenses
      const uniqueCurrencies = [...new Set(expenses.map(e => e.currency))];
      
      // If all expenses are already in target currency, return as is
      if (uniqueCurrencies.length === 1 && uniqueCurrencies[0] === targetCurrency) {
        return expenses.map(expense => ({
          ...expense,
          displayAmount: expense.amount,
          displayCurrency: targetCurrency,
          originalAmount: expense.amount,
          originalCurrency: expense.currency,
        }));
      }

      // Get exchange rates for all unique currencies
      const ratesPromises = uniqueCurrencies
        .filter(currency => currency !== targetCurrency)
        .map(currency => this.getExchangeRates(currency, [targetCurrency]));

      const ratesResults = await Promise.all(ratesPromises);
      
      // Create a rates map
      const ratesMap = {};
      ratesResults.forEach((result, index) => {
        const fromCurrency = uniqueCurrencies.filter(c => c !== targetCurrency)[index];
        ratesMap[fromCurrency] = result.rates[targetCurrency];
      });

      // Convert each expense
      const convertedExpenses = expenses.map(expense => {
        const expenseObj = expense.toObject ? expense.toObject() : expense;
        
        if (expenseObj.currency === targetCurrency) {
          return {
            ...expenseObj,
            displayAmount: expenseObj.amount,
            displayCurrency: targetCurrency,
            originalAmount: expenseObj.amount,
            originalCurrency: expenseObj.currency,
            conversionRate: 1,
          };
        }

        const rate = ratesMap[expenseObj.currency] || 1;
        const convertedAmount = expenseObj.amount * rate;

        return {
          ...expenseObj,
          displayAmount: convertedAmount,
          displayCurrency: targetCurrency,
          originalAmount: expenseObj.amount,
          originalCurrency: expenseObj.currency,
          conversionRate: rate,
        };
      });

      return convertedExpenses;
    } catch (error) {
      console.error('Error converting expenses:', error.message);
      // Return original expenses if conversion fails
      return expenses.map(expense => {
        const expenseObj = expense.toObject ? expense.toObject() : expense;
        return {
          ...expenseObj,
          displayAmount: expenseObj.amount,
          displayCurrency: expenseObj.currency,
          originalAmount: expenseObj.amount,
          originalCurrency: expenseObj.currency,
          conversionRate: 1,
        };
      });
    }
  }

  /**
   * Get list of supported currencies
   * @returns {Promise<Array>} Array of currency codes
   */
  async getSupportedCurrencies() {
    try {
      const response = await axios.get(`${FRANKFURTER_API_BASE}/currencies`);
      return Object.keys(response.data).map(code => ({
        code,
        name: response.data[code],
      }));
    } catch (error) {
      console.error('Error fetching supported currencies:', error.message);
      // Return common currencies as fallback
      return [
        { code: 'USD', name: 'US Dollar' },
        { code: 'EUR', name: 'Euro' },
        { code: 'GBP', name: 'British Pound' },
        { code: 'INR', name: 'Indian Rupee' },
        { code: 'JPY', name: 'Japanese Yen' },
        { code: 'AUD', name: 'Australian Dollar' },
        { code: 'CAD', name: 'Canadian Dollar' },
        { code: 'CHF', name: 'Swiss Franc' },
        { code: 'CNY', name: 'Chinese Yuan' },
      ];
    }
  }

  /**
   * Calculate total amount in target currency
   * @param {Array} expenses - Array of expense objects
   * @param {string} targetCurrency - Target currency code
   * @returns {Promise<Object>} Total amount and breakdown
   */
  async calculateTotal(expenses, targetCurrency) {
    try {
      const convertedExpenses = await this.convertExpenses(expenses, targetCurrency);
      
      const total = convertedExpenses.reduce((sum, expense) => {
        return sum + (expense.displayAmount || 0);
      }, 0);

      const breakdown = {};
      expenses.forEach(expense => {
        const currency = expense.currency;
        if (!breakdown[currency]) {
          breakdown[currency] = 0;
        }
        breakdown[currency] += expense.amount;
      });

      return {
        total,
        currency: targetCurrency,
        breakdown,
        expenseCount: expenses.length,
      };
    } catch (error) {
      console.error('Error calculating total:', error.message);
      throw new Error('Failed to calculate total');
    }
  }
}

module.exports = new CurrencyService();
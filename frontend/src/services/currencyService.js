import api from './api';

const currencyService = {
  // Get supported currencies
  getSupportedCurrencies: async () => {
    const response = await api.get('/currency/currencies');
    return response.data.data;
  },

  // Get exchange rates
  getExchangeRates: async (from, to = []) => {
    const params = { from };
    if (to.length > 0) {
      params.to = to.join(',');
    }
    const response = await api.get('/currency/rates', { params });
    return response.data.data;
  },

  // Convert amount
  convertAmount: async (amount, from, to) => {
    const response = await api.get('/currency/convert', {
      params: { amount, from, to },
    });
    return response.data.data;
  },

  // Format currency for display
  formatCurrency: (amount, currency = 'USD', locale = 'en-US') => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      // Fallback if currency is not supported by Intl
      return `${currency} ${amount.toFixed(2)}`;
    }
  },

  // Get currency symbol
  getCurrencySymbol: (currency = 'USD', locale = 'en-US') => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
      })
        .formatToParts(0)
        .find((part) => part.type === 'currency')?.value || currency;
    } catch (error) {
      return currency;
    }
  },
};

export default currencyService;
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import currencyService from '../services/currencyService';

/**
 * Custom hook for currency operations
 */
export const useCurrency = () => {
  const { user } = useSelector((state) => state.auth);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userCurrency = user?.preferredCurrency || 'USD';

  // Fetch supported currencies
  const fetchCurrencies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await currencyService.getSupportedCurrencies();
      setCurrencies(data.currencies || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching currencies:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Format amount in user's preferred currency
  const formatAmount = useCallback(
    (amount, currency = null) => {
      const displayCurrency = currency || userCurrency;
      return currencyService.formatCurrency(amount, displayCurrency);
    },
    [userCurrency]
  );

  // Format expense amount (handles conversion info)
  const formatExpenseAmount = useCallback(
    (expense) => {
      if (!expense) return '';

      // If expense has displayAmount (already converted), use it
      if (expense.displayAmount !== undefined && expense.displayCurrency) {
        const formatted = currencyService.formatCurrency(
          expense.displayAmount,
          expense.displayCurrency
        );

        // Show original amount if different
        if (
          expense.originalCurrency &&
          expense.originalCurrency !== expense.displayCurrency
        ) {
          const originalFormatted = currencyService.formatCurrency(
            expense.originalAmount || expense.amount,
            expense.originalCurrency
          );
          return `${formatted} (${originalFormatted})`;
        }

        return formatted;
      }

      // Otherwise use the expense's original currency
      return currencyService.formatCurrency(expense.amount, expense.currency);
    },
    []
  );

  // Get currency symbol
  const getCurrencySymbol = useCallback(
    (currency = null) => {
      const displayCurrency = currency || userCurrency;
      return currencyService.getCurrencySymbol(displayCurrency);
    },
    [userCurrency]
  );

  // Convert amount between currencies
  const convertAmount = useCallback(async (amount, from, to) => {
    try {
      const result = await currencyService.convertAmount(amount, from, to);
      return result.conversion;
    } catch (err) {
      console.error('Error converting amount:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  return {
    userCurrency,
    currencies,
    loading,
    error,
    formatAmount,
    formatExpenseAmount,
    getCurrencySymbol,
    convertAmount,
    refetchCurrencies: fetchCurrencies,
  };
};

export default useCurrency;
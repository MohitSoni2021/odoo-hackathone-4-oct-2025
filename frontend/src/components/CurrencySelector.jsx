import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useCurrency } from '../hooks/useCurrency';
import { updateUserProfile } from '../services/authService';
import { setUser } from '../store/slices/authSlice';
import './CurrencySelector.css';

const CurrencySelector = ({ showLabel = true, compact = false }) => {
  const dispatch = useDispatch();
  const { userCurrency, currencies, loading } = useCurrency();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleCurrencyChange = async (e) => {
    const newCurrency = e.target.value;
    
    if (newCurrency === userCurrency) return;

    try {
      setUpdating(true);
      setError(null);
      setSuccess(false);

      // Update user profile with new currency preference
      const response = await updateUserProfile({ preferredCurrency: newCurrency });
      
      // Update Redux store with new user data
      dispatch(setUser(response.data.user));
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      // Reload the page to refresh all data with new currency
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update currency preference');
      console.error('Error updating currency:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className={`currency-selector ${compact ? 'compact' : ''}`}>
        <span className="loading-text">Loading currencies...</span>
      </div>
    );
  }

  return (
    <div className={`currency-selector ${compact ? 'compact' : ''}`}>
      {showLabel && <label htmlFor="currency-select">Preferred Currency:</label>}
      
      <div className="currency-select-wrapper">
        <select
          id="currency-select"
          value={userCurrency}
          onChange={handleCurrencyChange}
          disabled={updating}
          className="currency-select"
        >
          {currencies.length > 0 ? (
            currencies.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.code} - {curr.name}
              </option>
            ))
          ) : (
            <option value={userCurrency}>{userCurrency}</option>
          )}
        </select>
        
        {updating && <span className="currency-updating">Updating...</span>}
      </div>

      {success && (
        <div className="currency-message success">
          Currency updated successfully! Refreshing...
        </div>
      )}

      {error && (
        <div className="currency-message error">
          {error}
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
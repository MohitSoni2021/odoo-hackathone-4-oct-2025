# Currency Conversion Feature Guide

## Overview
This application now supports multi-currency expense management with automatic currency conversion using the Frankfurter API. Users (employees, managers, and admins) can select their preferred currency, and all expense data will be automatically converted and displayed in that currency.

## Features

### 1. **User Currency Preference**
- Each user can select their preferred currency from a list of supported currencies
- The preference is saved to their profile and persists across sessions
- Currency selector is available on all dashboard pages

### 2. **Automatic Currency Conversion**
- When fetching expenses, the backend automatically converts all amounts to the user's preferred currency
- Conversion happens in real-time using current exchange rates from Frankfurter API
- Original currency information is preserved for transparency

### 3. **Multi-Currency Display**
- Expenses show both converted amount and original amount
- Format: `$100.00 USD (₹8,300.00 INR)` - shows converted amount first, original in parentheses
- If no conversion is needed, only the amount is shown

## Technical Implementation

### Backend Components

#### 1. Currency Service (`/backend/src/services/currencyService.js`)
Handles all currency-related operations:
- `getExchangeRates(base, symbols)` - Fetches exchange rates from Frankfurter API
- `convertCurrency(amount, from, to)` - Converts a single amount between currencies
- `convertExpenses(expenses, targetCurrency)` - Batch converts multiple expenses
- `getSupportedCurrencies()` - Returns list of all supported currencies
- `calculateTotal(expenses, targetCurrency)` - Calculates totals with currency breakdown

**Key Features:**
- Batch conversion to minimize API calls
- Graceful error handling with fallback to original amounts
- Caching-friendly design

#### 2. User Model Update (`/backend/src/models/userModel.js`)
- Added `preferredCurrency` field (default: 'USD')
- Automatically converts currency codes to uppercase

#### 3. Expense Controller Enhancement (`/backend/src/controllers/expenseController.js`)
- Modified `getAllExpenses` endpoint to support currency conversion
- Query parameter: `convert=true` (default: true)
- Adds conversion metadata to each expense:
  - `displayAmount` - Converted amount
  - `displayCurrency` - Target currency
  - `originalAmount` - Original amount
  - `originalCurrency` - Original currency
  - `conversionRate` - Exchange rate used

#### 4. Currency Controller (`/backend/src/controllers/currencyController.js`)
New endpoints:
- `GET /api/currency/currencies` - List all supported currencies
- `GET /api/currency/rates?base=USD&symbols=EUR,GBP` - Get exchange rates
- `GET /api/currency/convert?amount=100&from=USD&to=EUR` - Convert specific amount

#### 5. User Controller Update (`/backend/src/controllers/userController.js`)
- Enhanced `updateMe` endpoint to allow updating `preferredCurrency`

### Frontend Components

#### 1. Currency Service (`/frontend/src/services/currencyService.js`)
Frontend service for currency operations:
- `getSupportedCurrencies()` - Fetch available currencies
- `getExchangeRates(base, symbols)` - Get exchange rates
- `convertAmount(amount, from, to)` - Convert specific amounts
- `formatCurrency(amount, currency)` - Format amounts with proper symbols and locale
- `getCurrencySymbol(currency)` - Extract currency symbols

#### 2. Currency Hook (`/frontend/src/hooks/useCurrency.js`)
Custom React hook providing:
- `userCurrency` - Current user's preferred currency
- `currencies` - List of available currencies
- `formatAmount(amount, currency)` - Format amount in user's currency
- `formatExpenseAmount(expense)` - Format expense with conversion info
- `getCurrencySymbol(currency)` - Get currency symbol
- `convertAmount(amount, from, to)` - Convert between currencies

#### 3. Currency Selector Component (`/frontend/src/components/CurrencySelector.jsx`)
Reusable component for currency selection:
- Dropdown with all supported currencies
- Updates user profile when currency is changed
- Shows success/error messages
- Automatically refreshes page after currency change
- Props:
  - `showLabel` - Show/hide label (default: true)
  - `compact` - Compact mode for smaller spaces (default: false)

#### 4. Updated Dashboard Components
All dashboards now include currency selector and use converted amounts:
- **Employee Dashboard** (`/frontend/src/pages/employee/EmployeeDashboard.js`)
- **Manager Dashboard** (`/frontend/src/pages/manager/ManagerDashboard.js`)
- **Admin Dashboard** (`/frontend/src/pages/admin/AdminDashboard.js`)
- **My Expenses** (`/frontend/src/pages/employee/MyExpenses.js`)

## API Integration

### Frankfurter API
- **Base URL:** `https://api.frankfurter.app`
- **No API Key Required:** Free to use
- **Rate Limits:** Reasonable limits for production use
- **Supported Currencies:** 30+ major currencies

### Endpoints Used:
1. **Get Latest Rates:**
   ```
   GET https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,INR
   ```

2. **Get Supported Currencies:**
   ```
   GET https://api.frankfurter.app/currencies
   ```

## Usage Guide

### For Users

#### 1. Change Preferred Currency
1. Navigate to any dashboard page
2. Look for the currency selector in the top-right corner
3. Select your preferred currency from the dropdown
4. The page will automatically refresh with converted amounts

#### 2. View Expenses
- All expense amounts are displayed in your preferred currency
- Original currency is shown in parentheses if different
- Example: `$100.00 USD (₹8,300.00 INR)`

#### 3. Submit Expenses
- Submit expenses in any supported currency
- Other users will see the amount converted to their preferred currency
- Original currency is always preserved

### For Developers

#### 1. Using the Currency Hook
```javascript
import { useCurrency } from '../hooks/useCurrency';

function MyComponent() {
  const { 
    userCurrency, 
    formatAmount, 
    formatExpenseAmount 
  } = useCurrency();

  return (
    <div>
      <p>Your currency: {userCurrency}</p>
      <p>Amount: {formatAmount(100)}</p>
      <p>Expense: {formatExpenseAmount(expense)}</p>
    </div>
  );
}
```

#### 2. Adding Currency Selector
```javascript
import CurrencySelector from '../components/CurrencySelector';

function MyPage() {
  return (
    <div>
      <CurrencySelector showLabel={true} compact={false} />
    </div>
  );
}
```

#### 3. Backend Currency Conversion
```javascript
const CurrencyService = require('../services/currencyService');

// Convert expenses
const convertedExpenses = await CurrencyService.convertExpenses(
  expenses,
  'USD'
);

// Convert single amount
const converted = await CurrencyService.convertCurrency(
  100,
  'INR',
  'USD'
);
```

## Data Flow

1. **User selects currency** → Updates `preferredCurrency` in user profile
2. **User requests expenses** → Backend fetches expenses from database
3. **Backend converts** → Calls Frankfurter API for exchange rates
4. **Backend enriches data** → Adds conversion metadata to each expense
5. **Frontend displays** → Shows converted amounts with original currency info

## Error Handling

### Backend
- If Frankfurter API fails, expenses are returned with original amounts
- Conversion errors are logged but don't break the request
- Fallback to original currency if conversion fails

### Frontend
- Loading states while fetching currencies
- Error messages if currency update fails
- Graceful degradation if conversion data is missing

## Performance Considerations

1. **Batch Conversion:** All expenses are converted in a single API call
2. **Caching:** Exchange rates can be cached (consider implementing Redis)
3. **Lazy Loading:** Currencies are fetched once and cached in component state
4. **Minimal Re-renders:** Currency hook uses memoization

## Future Enhancements

1. **Exchange Rate Caching:** Implement Redis caching for exchange rates
2. **Historical Rates:** Show expenses with historical exchange rates
3. **Currency Trends:** Display currency trend charts
4. **Bulk Currency Update:** Allow admins to set default currency for organization
5. **Offline Support:** Cache recent exchange rates for offline use
6. **Custom Exchange Rates:** Allow manual override of exchange rates

## Supported Currencies

The Frankfurter API supports 30+ currencies including:
- USD - US Dollar
- EUR - Euro
- GBP - British Pound
- INR - Indian Rupee
- JPY - Japanese Yen
- AUD - Australian Dollar
- CAD - Canadian Dollar
- CHF - Swiss Franc
- CNY - Chinese Yuan
- And many more...

## Testing

### Manual Testing Steps

1. **Test Currency Selection:**
   - Login as any user
   - Change currency from selector
   - Verify page refreshes with new currency

2. **Test Expense Display:**
   - Create expenses in different currencies
   - Switch user currency
   - Verify amounts are converted correctly

3. **Test Multi-User Scenario:**
   - User A sets currency to USD
   - User B sets currency to EUR
   - Both submit expenses
   - Verify each sees amounts in their preferred currency

### API Testing
```bash
# Get supported currencies
curl http://localhost:5000/api/currency/currencies

# Get exchange rates
curl "http://localhost:5000/api/currency/rates?base=USD&symbols=EUR,GBP"

# Convert amount
curl "http://localhost:5000/api/currency/convert?amount=100&from=USD&to=EUR"
```

## Troubleshooting

### Issue: Currency not updating
**Solution:** Clear browser cache and sessionStorage, then login again

### Issue: Conversion showing incorrect amounts
**Solution:** Check Frankfurter API status, verify exchange rates are current

### Issue: Currency selector not showing
**Solution:** Ensure user is authenticated and component is imported correctly

### Issue: Backend conversion failing
**Solution:** Check backend logs, verify Frankfurter API is accessible

## Configuration

### Environment Variables
No additional environment variables needed. The Frankfurter API is free and doesn't require authentication.

### Optional Configuration
You can add these to `.env` if needed:
```
CURRENCY_API_URL=https://api.frankfurter.app
CURRENCY_CACHE_TTL=3600
DEFAULT_CURRENCY=USD
```

## Security Considerations

1. **API Rate Limiting:** Frankfurter API has rate limits, consider implementing caching
2. **Input Validation:** All currency codes are validated before API calls
3. **Error Handling:** Sensitive error details are not exposed to frontend
4. **Data Integrity:** Original currency data is always preserved

## Conclusion

The currency conversion feature provides a seamless multi-currency experience for all users. It's built with performance, reliability, and user experience in mind. The implementation is modular and can be easily extended with additional features.

For questions or issues, please refer to the main project documentation or contact the development team.
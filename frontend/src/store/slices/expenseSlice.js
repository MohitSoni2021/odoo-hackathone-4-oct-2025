import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import expenseService from '../../services/expenseService';

// Async thunks
export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (params, { rejectWithValue }) => {
    try {
      const response = await expenseService.getAllExpenses(params);
      return response; // Service already returns response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch expenses');
    }
  }
);

export const fetchExpenseStats = createAsyncThunk(
  'expenses/fetchExpenseStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await expenseService.getExpenseStats();
      return response; // Service already returns response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch expense stats');
    }
  }
);

export const createExpense = createAsyncThunk(
  'expenses/createExpense',
  async (expenseData, { rejectWithValue }) => {
    try {
      const response = await expenseService.createExpense(expenseData);
      return response; // Service already returns response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create expense');
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async ({ id, expenseData }, { rejectWithValue }) => {
    try {
      const response = await expenseService.updateExpense(id, expenseData);
      return response; // Service already returns response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update expense');
    }
  }
);

export const approveExpense = createAsyncThunk(
  'expenses/approveExpense',
  async (id, { rejectWithValue }) => {
    try {
      const response = await expenseService.approveExpense(id);
      return response; // Service already returns response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve expense');
    }
  }
);

export const rejectExpense = createAsyncThunk(
  'expenses/rejectExpense',
  async ({ id, rejectionReason }, { rejectWithValue }) => {
    try {
      const response = await expenseService.rejectExpense(id, rejectionReason);
      return response; // Service already returns response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject expense');
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id, { rejectWithValue }) => {
    try {
      await expenseService.deleteExpense(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete expense');
    }
  }
);

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    expenses: [],
    stats: null,
    loading: false,
    error: null,
    selectedExpense: null,
  },
  reducers: {
    setSelectedExpense: (state, action) => {
      state.selectedExpense = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload.expenses || []; // Extract expenses array from payload
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch expense stats
      .addCase(fetchExpenseStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseStats.fulfilled, (state, action) => {
        state.loading = false;
        // Safely destructure the payload with sensible defaults
        const {
          statusStats = [],
          categoryStats = [],
          totalExpenses = 0,
          totalAmount = 0,
        } = action.payload || {};

        // Convert statusStats array to byStatus object with fallback counts
        const byStatus = {};
        statusStats.forEach((stat) => {
          if (stat?._id) {
            byStatus[stat._id] = stat.count || 0;
          }
        });

        state.stats = {
          totalExpenses,
          totalAmount,
          byStatus,
          byCategory: categoryStats,
        };
      })
      .addCase(fetchExpenseStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create expense
      .addCase(createExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses.push(action.payload.expense); // Extract expense from payload
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update expense
      .addCase(updateExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.expenses.findIndex((expense) => expense._id === action.payload.expense._id);
        if (index !== -1) {
          state.expenses[index] = action.payload.expense; // Extract expense from payload
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Approve expense
      .addCase(approveExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveExpense.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.expenses.findIndex((expense) => expense._id === action.payload.expense._id);
        if (index !== -1) {
          state.expenses[index] = action.payload.expense; // Extract expense from payload
        }
      })
      .addCase(approveExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reject expense
      .addCase(rejectExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectExpense.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.expenses.findIndex((expense) => expense._id === action.payload.expense._id);
        if (index !== -1) {
          state.expenses[index] = action.payload.expense; // Extract expense from payload
        }
      })
      .addCase(rejectExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete expense
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = state.expenses.filter((expense) => expense._id !== action.payload);
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedExpense, clearError } = expenseSlice.actions;
export default expenseSlice.reducer;
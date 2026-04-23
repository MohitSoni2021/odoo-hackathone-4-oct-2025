import api from './api';

const expenseService = {
  // Get all expenses
  getAllExpenses: async (params = {}) => {
    const response = await api.get('/expenses', { params });
    return response.data.data; // Return the data object which contains expenses array
  },

  // Get expense by ID
  getExpenseById: async (id) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data.data; // Return the data object which contains expense
  },

  // Create expense
  createExpense: async (expenseData) => {
    const response = await api.post('/expenses', expenseData);
    return response.data.data; // Return the data object which contains expense
  },

  // Update expense
  updateExpense: async (id, expenseData) => {
    const response = await api.patch(`/expenses/${id}`, expenseData);
    return response.data.data; // Return the data object which contains expense
  },

  // Delete expense
  deleteExpense: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },

  // Approve expense
  approveExpense: async (id) => {
    const response = await api.patch(`/expenses/${id}/approve`);
    return response.data.data; // Return the data object which contains expense
  },

  // Reject expense
  rejectExpense: async (id, rejectionReason) => {
    const response = await api.patch(`/expenses/${id}/reject`, { rejectionReason });
    return response.data.data; // Return the data object which contains expense
  },

  // Get expense statistics
  getExpenseStats: async () => {
    const response = await api.get('/expenses/stats');
    return response.data.data; // Return the data object which contains stats
  },

  // Get pending expenses count
  getPendingCount: async () => {
    const response = await api.get('/expenses/pending-count');
    return response.data.data; // Return the data object which contains count
  },
};

export default expenseService;
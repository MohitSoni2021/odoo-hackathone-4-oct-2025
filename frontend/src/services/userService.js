import api from './api';

const userService = {
  // Get all users
  getAllUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data.data; // Return the data object which contains users array
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data.data; // Return the data object which contains user
  },

  // Create user
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data.data; // Return the data object which contains user
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data.data; // Return the data object which contains user
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await api.get('/users/stats');
    return response.data.data; // Return the data object which contains stats
  },

  // Get my team (manager only)
  getMyTeam: async () => {
    const response = await api.get('/users/my-team');
    return response.data.data; // Return the data object which contains team
  },

  // Get employees (for manager assignment)
  getEmployees: async () => {
    const response = await api.get('/users/employees');
    return response.data.data; // Return the data object which contains employees
  },

  // Assign manager to employee
  assignManager: async (userId, managerId) => {
    const response = await api.patch(`/users/${userId}`, { manager: managerId });
    return response.data.data; // Return the data object which contains user
  },
};

export default userService;
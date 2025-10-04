import api from './api';

const notificationService = {
  // Get all notifications
  getAllNotifications: async (params = {}) => {
    const response = await api.get('/notifications', { params });
    return response.data.data; // Return the data object which contains notifications array
  },

  // Mark notification as read
  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data.data; // Return the data object which contains notification
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data.data; // Return the data object
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data.data; // Return the data object which contains count
  },

  // Delete notification
  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};

export default notificationService;
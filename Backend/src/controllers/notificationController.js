const Notification = require('../models/notificationModel');

// Get all notifications for current user
exports.getMyNotifications = async (req, res) => {
  try {
    const { isRead, limit = 20 } = req.query;
    
    const query = { recipient: req.user._id };
    
    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }
    
    const notifications = await Notification.find(query)
      .populate('sender', 'firstName lastName')
      .populate('relatedExpense', 'title amount currency')
      .sort('-createdAt')
      .limit(parseInt(limit));
    
    res.status(200).json({
      status: 'success',
      results: notifications.length,
      data: {
        notifications,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        status: 'fail',
        message: 'No notification found with that ID',
      });
    }
    
    // Check if notification belongs to user
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to access this notification',
      });
    }
    
    notification.isRead = true;
    notification.readAt = Date.now();
    await notification.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        notification,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true, readAt: Date.now() }
    );
    
    res.status(200).json({
      status: 'success',
      message: 'All notifications marked as read',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        status: 'fail',
        message: 'No notification found with that ID',
      });
    }
    
    // Check if notification belongs to user
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to delete this notification',
      });
    }
    
    await Notification.findByIdAndDelete(req.params.id);
    
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        count,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
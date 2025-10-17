// controllers/notificationsController.js (Updated for SuperAdmin schema)
const SuperAdmin = require('../models/SuperAdmin');

// Get all notifications for super admin
const getAllNotifications = async (req, res) => {
    try {
        const superAdmin = await SuperAdmin.findOne({});
        
        if (!superAdmin) {
            return res.status(404).json({
                success: false,
                message: 'Super admin not found'
            });
        }

        // Transform data to match frontend expectations
        const notifications = superAdmin.Notifications.map(notification => ({
            _id: notification._id,
            message: notification.title,
            type: 'system', // Default type for super admin notifications
            from: notification.from,
            read: false, // You might want to add this field to your schema
            priority: 'medium',
            createdAt: notification.date,
            actionUrl: ''
        })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Create new notification for super admin
const createNotification = async (req, res) => {
    try {
        const { title, from, type = 'system' } = req.body;

        const superAdmin = await SuperAdmin.findOne({});
        
        if (!superAdmin) {
            return res.status(404).json({
                success: false,
                message: 'Super admin not found'
            });
        }

        const newNotification = {
            title,
            from,
            date: new Date(),
            type
        };

        superAdmin.Notifications.push(newNotification);
        await superAdmin.save();

        res.status(201).json({
            success: true,
            message: 'Notification created successfully',
            data: newNotification
        });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Mark notification as read (you'll need to update your schema)
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const superAdmin = await SuperAdmin.findOne({});
        
        if (!superAdmin) {
            return res.status(404).json({
                success: false,
                message: 'Super admin not found'
            });
        }

        // Note: You'll need to add a 'read' field to your notification schema
        const notification = superAdmin.Notifications.id(id);
        if (notification) {
            notification.read = true;
            await superAdmin.save();
        }

        res.status(200).json({
            success: true,
            message: 'Notification marked as read'
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Clear all notifications
const clearAllNotifications = async (req, res) => {
    try {
        const superAdmin = await SuperAdmin.findOne({});
        
        if (!superAdmin) {
            return res.status(404).json({
                success: false,
                message: 'Super admin not found'
            });
        }

        superAdmin.Notifications = [];
        await superAdmin.save();

        res.status(200).json({
            success: true,
            message: 'All notifications cleared successfully'
        });
    } catch (error) {
        console.error('Error clearing notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get unread notifications count
const getUnreadCount = async (req, res) => {
    try {
        const superAdmin = await SuperAdmin.findOne({});
        
        if (!superAdmin) {
            return res.status(404).json({
                success: false,
                message: 'Super admin not found'
            });
        }

        const unreadCount = superAdmin.Notifications.filter(notification => !notification.read).length;

        res.status(200).json({
            success: true,
            data: { unreadCount }
        });
    } catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    getAllNotifications,
    createNotification,
    markAsRead,
    clearAllNotifications,
    getUnreadCount
};
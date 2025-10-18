const admin = require('../config/firebaseAdmin');

class FCMService {
    async sendToUser(userId, message) {
        try {
            // Get user from database
            const user = await User.findById(userId);

            if (!user || !user.fcmToken) {
                console.log('No FCM token found for user:', userId);
                return;
            }

            const payload = {
                token: user.fcmToken,
                notification: {
                    title: message.title,
                    body: message.body,
                },
                data: {
                    type: message.type,
                    bookingId: message.bookingId || '',
                    click_action: 'FLUTTER_NOTIFICATION_CLICK'
                }
            };

            const response = await admin.messaging().send(payload);
            console.log('FCM notification sent successfully');
            return response;
        } catch (error) {
            console.error('Error sending FCM:', error);

            // Remove invalid token
            if (error.code === 'messaging/registration-token-not-registered') {
                await User.findByIdAndUpdate(userId, { $unset: { fcmToken: 1 } });
            }
        }
    }
}

module.exports = new FCMService();
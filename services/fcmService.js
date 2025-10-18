const admin = require('../config/firebaseAdmin');
const User = require('../models/User');
const SuperAdmin = require('../models/SuperAdmin');
const Mechanic = require('../models/Mechanic');


class FCMService {
    async sendToUser(fcmToken, message,type,userId) {
        try {

            if (!fcmToken) {
                console.log('No FCM token found for user:', userId);
                return;
            }

            const payload = {
                token: fcmToken,
                notification: {
                    title: message.title,
                    body: message.body,
                    
                },
                data: {
                    type: message.type || '',
                    bookingId: message.bookingId ? message.bookingId.toString() : '',
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
                if(type==='user'){
                await User.findByIdAndUpdate(userId, { $unset: { fcmToken: 1 } });
                }
                if(type==='mechanic'){
                await Mechanic.findByIdAndUpdate(userId, { $unset: { fcmToken: 1 } });
                }
                if(type==='admin'){
                await SuperAdmin.findByIdAndUpdate(userId, { $unset: { fcmToken: 1 } });
                }
            }
        }
    }
}

module.exports = new FCMService();
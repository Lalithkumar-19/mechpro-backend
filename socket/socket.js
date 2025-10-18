// socket/socket.js
let io;
const onlineUsers = new Map();
const onlineMechanics = new Map();

function initSocket(server) {
    const { Server } = require('socket.io');
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // Register user
        socket.on("register_user", (userId) => {
            onlineUsers.set(userId, socket.id);
            console.log(`User ${userId} connected with socket ${socket.id}`);
        });

        // Register mechanic
        socket.on("register_mechanic", (mechanicId) => {
            onlineMechanics.set(mechanicId, socket.id);
            console.log(`Mechanic ${mechanicId} connected with socket ${socket.id}`);
        });

        // Disconnect handling
        socket.on("disconnect", () => {
            for (let [userId, sId] of onlineUsers.entries()) {
                if (sId === socket.id) {
                    onlineUsers.delete(userId);
                    console.log(`User ${userId} disconnected`);
                    break;
                }
            }

            for (let [mechanicId, sId] of onlineMechanics.entries()) {
                if (sId === socket.id) {
                    onlineMechanics.delete(mechanicId);
                    console.log(`Mechanic ${mechanicId} disconnected`);
                    break;
                }
            }
        });
    });
}

// ✅ Helper functions
function sendNotificationToUser(userId, data) {
    const socketId = onlineUsers.get(userId);
    if (socketId && io) {
        io.to(socketId).emit("notification", data);
        console.log(`Notification sent to user ${userId}:`, data);
    } else {
        console.log(`User ${userId} not connected`);
    }
}

function sendNotificationToMechanic(mechanicId, data) {
    const socketId = onlineMechanics.get(mechanicId);
    if (socketId && io) {
        io.to(socketId).emit("notification", data);
        console.log(`Notification sent to mechanic ${mechanicId}:`, data);
    } else {
        console.log(`Mechanic ${mechanicId} not connected`);
    }
}

function sendNotificationToAllMechanics(data) {
    if (!io) return;
    onlineMechanics.forEach((socketId) => {
        io.to(socketId).emit("notification", data);
    });
    console.log(`Notification sent to all ${onlineMechanics.size} mechanics`);
}

module.exports = {
    initSocket,
    sendNotificationToUser,
    sendNotificationToMechanic,
    sendNotificationToAllMechanics
};

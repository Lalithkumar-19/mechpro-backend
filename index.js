// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const userRoutes = require('./routes/userRoutes');
// const mechanicRoutes = require("./routes/mechanicRoutes");
// const adminRoutes = require("./routes/superAdmin");
// const bookingRoutes = require("./routes/bookings");
// const sparePartsRoutes = require("./routes/sparePartsRoutes");
// const servicesRoutes = require("./routes/services");
// const analyticsRoutes = require("./routes/analytics");
// const authRoutes = require("./routes/authRoutes");
// const userprofile = require("./routes/userprofile");
// const { adminAuthmiddleware } = require("./middleware/authadmin")
// const amdinAuth = require("./routes/adminAuth");
// const publicRoutes = require("./routes/public");
// // Load environment variables
// dotenv.config();

// // Initialize Express app
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// mongoose.connect(
//     'mongodb+srv://admin:mechpro123@cluster0.wbp76kx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('MongoDB connection error:', err));

// // Routes
// // Test route
// app.get('/', (req, res) => {
//     res.send('MechanicPro API is running...');
// });
// app.use("/api/adminauth", amdinAuth);
// app.use("/api/mechanic", mechanicRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/user", userprofile);
// app.use("/api/public", publicRoutes);

// // app.use('/api/users', userRoutes);

// app.use(adminAuthmiddleware);
// app.use("/api/admin/user", userRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/admin/booking", bookingRoutes);
// app.use("/api/admin/spareParts", sparePartsRoutes);
// app.use("/api/admin/services", servicesRoutes);
// app.use("/api/admin/analytics", analyticsRoutes);





// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http'); // ✅ Add this
const { Server } = require('socket.io'); // ✅ Add this
const userRoutes = require('./routes/userRoutes');
const mechanicRoutes = require("./routes/mechanicRoutes");
const adminRoutes = require("./routes/superAdmin");
const bookingRoutes = require("./routes/bookings");
const sparePartsRoutes = require("./routes/sparePartsRoutes");
const servicesRoutes = require("./routes/services");
const analyticsRoutes = require("./routes/analytics");
const authRoutes = require("./routes/authRoutes");
const userprofile = require("./routes/userprofile");
const { adminAuthmiddleware } = require("./middleware/authadmin")
const amdinAuth = require("./routes/adminAuth");
const publicRoutes = require("./routes/public");
const { initSocket, sendNotificationToAllMechanics } = require('./socket/socket');

dotenv.config();
mongoose.connect(
    'mongodb+srv://admin:mechpro123@cluster0.wbp76kx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Create HTTP server
const server = http.createServer(app);



initSocket(server);
setTimeout(() => {
    sendNotificationToAllMechanics({
        message: 'Hello from the server!',
        type: 'notification'
    });
}, 3000);


app.get('/', (req, res) => {
    res.send('MechanicPro API is running...');
});

// // Routes
// // Test route
app.get('/', (req, res) => {
    res.send('MechanicPro API is running...');
});
app.use("/api/adminauth", amdinAuth);
app.use("/api/mechanic", mechanicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userprofile);
app.use("/api/public", publicRoutes);

// app.use('/api/users', userRoutes);

app.use(adminAuthmiddleware);
app.use("/api/admin/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/booking", bookingRoutes);
app.use("/api/admin/spareParts", sparePartsRoutes);
app.use("/api/admin/services", servicesRoutes);
app.use("/api/admin/analytics", analyticsRoutes);


// ✅ Start the HTTP + WebSocket server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


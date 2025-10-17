const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const mechanicRoutes = require("./routes/mechanicRoutes");
const adminRoutes = require("./routes/superAdmin");
const bookingRoutes = require("./routes/bookings");
const sparePartsRoutes = require("./routes/sparePartsRoutes");
const servicesRoutes = require("./routes/services");
const analyticsRoutes = require("./routes/analytics");
const authRoutes = require("./routes/authRoutes");
const userprofile = require("./routes/userprofile");
const {adminAuthmiddleware} = require("./middleware/authadmin")
const amdinAuth = require("./routes/adminAuth");
const publicRoutes = require("./routes/public");
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(
    'mongodb+srv://admin:mechpro123@cluster0.wbp76kx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
// Test route
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
app.use("/api/admin", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", bookingRoutes);
app.use("/api/admin", sparePartsRoutes);
app.use("/api/admin", servicesRoutes);
app.use("/api/admin", analyticsRoutes);





// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

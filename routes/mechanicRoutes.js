const express = require('express');
const router = express.Router();
const mechanicController = require('../contollers/MechanicControllers');
const authmechanic = require('../middleware/authmechanic');

// Authentication routes
router.post('/register', mechanicController.register);
router.post('/login', mechanicController.login);
router.get('/profile', authmechanic, mechanicController.getProfile);
router.put('/profile', authmechanic, mechanicController.updateProfile);

// Booking routes
router.get('/bookings', authmechanic, mechanicController.getBookings);
router.put('/bookings/:id/status', authmechanic, mechanicController.updateBookingStatus);
router.get('/bookings/:id', authmechanic, mechanicController.getBookingDetails);

// Spare parts routes
router.get('/spare-parts', authmechanic, mechanicController.getSpareParts);
router.post('/spare-parts', authmechanic, mechanicController.createSparePartRequest);
router.put('/spare-parts/:id/status', authmechanic, mechanicController.updateSparePartStatus);

// Dashboard stats
router.get('/dashboard-stats', authmechanic, mechanicController.getDashboardStats);

// Shop status
router.put('/shop-status', authmechanic, mechanicController.updateShopStatus);

module.exports = router;
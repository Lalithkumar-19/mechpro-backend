const express = require('express');
const router = express.Router();
const bookingsController = require('../contollers/BookingControllers');

// Get all bookings
router.get('/get-all-bookings', bookingsController.getAllBookings);

// Get booking by ID
router.get('/get-booking/:id', bookingsController.getBookingById);

// Handle booking actions (accept, decline, start, complete, cancel)
router.put('/handle-booking-action', bookingsController.handleBookingAction);

// Update booking status
router.put('/update-booking-status', bookingsController.updateBookingStatus);

// Reassign mechanic
router.put('/reassign-mechanic', bookingsController.reassignMechanic);

// Create new booking
router.post('/create-booking', bookingsController.createBooking);

// Delete booking
router.delete('/delete-booking/:id', bookingsController.deleteBooking);

module.exports = router;
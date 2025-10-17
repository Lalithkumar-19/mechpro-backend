const express = require('express');
const { addMechanic, BookingStatusUpdate, SparePartStatusUpdate, AddCustomer, AddService, loginAdmin, registerAdmin, GetAllmechanics, GetAllBookings, GetAllSpareparts, GetCustomers, GetServices, GetNotifications, updateMechanic, DeleteMechanic } = require('../contollers/SuperAdmin');
const {
    getAllBookings,
    updateBookingStatus,
    reassignMechanic,
    handleBookingAction,
    getBookingById
} = require('../contollers/BookingControllers');

const router = express.Router();



router.post("/login", loginAdmin);
router.post("/register", registerAdmin);
router.post("/addmechanic", addMechanic);
router.post("/update-booking", BookingStatusUpdate);
router.post("/update-sparepart-status", SparePartStatusUpdate);
router.post("/add-customer", AddCustomer);
router.post("/add-service", AddService);

router.get("/get-all-mechanics", GetAllmechanics);
router.get("/get-all-bookings", GetAllBookings);
router.get("/get-all-spareparts", GetAllSpareparts);
router.get("/get-customers", GetCustomers);
router.get("/get-services", GetServices);
router.get("/get-notifications", GetNotifications);



//updates
router.put("/updatemechanic", updateMechanic);
router.delete("/deletemechanic/:id", DeleteMechanic);



// Get all bookings
router.get('/get-all-bookings', getAllBookings);

// Get booking by ID
router.get('/get-booking/:id', getBookingById);

// Update booking status
router.put('/update-booking-status', updateBookingStatus);

// Reassign mechanic
router.put('/reassign-mechanic', reassignMechanic);

// Handle booking action (accept, decline, start, complete, cancel)
router.put('/handle-booking-action', handleBookingAction);


module.exports = router;
// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../contollers/UserControllers');
const { getMechanics } = require('../contollers/MechanicControllers');
const { protect } = require('../middleware/authMiddleware');
const {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomerStatus,
    deleteCustomer
} = require('../contollers/UserControllers');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile',getUserProfile);



router.get('/get-all-customers', getAllCustomers);

// Get customer by ID
router.get('/get-customer/:id', getCustomerById);

// Create new customer
router.post('/create-customer', createCustomer);

// Update customer status
router.put('/update-customer-status', updateCustomerStatus);

// Delete customer
router.delete('/delete-customer/:id', deleteCustomer);


module.exports = router; 
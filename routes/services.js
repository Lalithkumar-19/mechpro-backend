const express = require('express');
const router = express.Router();
const servicesController = require('../contollers/servicesController');

// Get all services
router.get('/get-all-services', servicesController.getAllServices);

// Get service by ID
router.get('/get-service/:id', servicesController.getServiceById);

// Create new service
router.post('/create-service', servicesController.createService);

// Update service
router.put('/update-service/:id', servicesController.updateService);

// Delete service
router.delete('/delete-service/:id', servicesController.deleteService);

// Toggle service status
router.patch('/toggle-service-status/:id', servicesController.toggleServiceStatus);

module.exports = router;
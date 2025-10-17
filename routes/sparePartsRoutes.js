const express = require('express');
const router = express.Router();
const {
    getAllSpareParts,
    updateSparePartStatus,
    getSparePartById,
    createSparePartRequest,
    deleteSparePartRequest
} = require('../contollers/sparePartsController');

// Get all spare parts requests
router.get('/get-all-spare-parts', getAllSpareParts);

// Get spare part by ID
router.get('/get-spare-part/:id', getSparePartById);

// Update spare part status
router.put('/update-spare-part-status', updateSparePartStatus);

// Create new spare part request
router.post('/create-spare-part-request', createSparePartRequest);

// Delete spare part request
router.delete('/delete-spare-part/:id', deleteSparePartRequest);

module.exports = router;
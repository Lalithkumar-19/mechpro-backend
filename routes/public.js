const express = require('express');
const router = express.Router();
const publicController = require('../contollers/PublicControllers');

// Public routes for finding mechanics
router.get('/find', publicController.findMechanics);
router.get('/:id', publicController.getMechanicDetails);

module.exports = router;
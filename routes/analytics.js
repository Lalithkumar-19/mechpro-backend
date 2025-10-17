// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const {
    getDashboardAnalytics,
    exportAnalytics
} = require('../contollers/AnalyticsControllers');

// Get dashboard analytics
router.get('/dashboard-analytics', getDashboardAnalytics);

// Export analytics data
router.get('/export-analytics', exportAnalytics);

module.exports = router;
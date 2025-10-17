const express = require("express");
const router = express.Router();

const userRoutes = require("../userRoutes");
const adminRoutes = require("../adminAuth");
const bookingRoutes = require("../bookings");
const sparePartsRoutes = require("../sparePartsRoutes");
const servicesRoutes = require("../services");
const analyticsRoutes = require("../analytics");

router.use("/api/admin", userRoutes);
router.use("/api/admin", adminRoutes);
router.use("/api/admin", bookingRoutes);
router.use("/api/admin", sparePartsRoutes);
router.use("/api/admin", servicesRoutes);
router.use("/api/admin", analyticsRoutes);

module.exports = router;

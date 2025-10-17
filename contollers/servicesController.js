// controllers/servicesController.js
const Services = require('../models/Services');

// Get all services
const getAllServices = async (req, res) => {
    try {
        const services = await Services.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: services
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get service by ID
const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Services.findById(id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.status(200).json({
            success: true,
            data: service
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Create new service
const createService = async (req, res) => {
    try {
        const {
            serviceName,
            description,
            Baseprice,
            duration,
            category,
            status = true
        } = req.body;

        // Validate required fields
        if (!serviceName || !description || !Baseprice || !duration || !category) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const newService = new Services({
            serviceName,
            description,
            Baseprice,
            duration,
            category,
            status
        });

        await newService.save();

        res.status(201).json({
            success: true,
            message: 'Service created successfully',
            data: newService
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Update service
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const service = await Services.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Service updated successfully',
            data: service
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Delete service
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Services.findByIdAndDelete(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Service deleted successfully'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Toggle service status
const toggleServiceStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Services.findById(id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        service.status = !service.status;
        await service.save();

        res.status(200).json({
            success: true,
            message: `Service ${service.status ? 'activated' : 'deactivated'} successfully`,
            data: service
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    toggleServiceStatus
};
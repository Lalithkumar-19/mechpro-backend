const SpareParts = require('../models/SpareParts');
const Mechanic = require('../models/Mechanic');
const fcmService = require('../services/fcmService');

// Get all spare parts requests
const getAllSpareParts = async (req, res) => {
    try {
        const spareParts = await SpareParts.find()
            .populate('mechanicId', 'name phone email')
            .sort({ createdAt: -1 });

        const formattedSpareParts = spareParts.map(part => ({
            _id: part._id,
            requestId: part.requestid,
            serviceId: part.serviceId,
            mechanic: part.mechanicId ? {
                id: part.mechanicId._id,
                name: part.mechanicId.name,
                phone: part.mechanicId.phone,
                email: part.mechanicId.email
            } : null,
            amount: part.amount,
            partName: part.partName,
            quantity: part.partQuantity,
            carModel: part.carName,
            year: part.manufactured_year,
            urgency: part.urgency,
            status: part.status,
            requestedAt: part.createdAt
        }));

        res.status(200).json(formattedSpareParts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update spare part status
const updateSparePartStatus = async (req, res) => {
    try {
        const { requestId, status } = req.body;

        const sparePart = await SpareParts.findByIdAndUpdate(
            requestId,
            { status },
            { new: true }
        ).populate('mechanicId', 'name phone email fcmToken');

        if (!sparePart) {
            return res.status(404).json({ message: 'Spare part request not found' });
        }

        const formattedSparePart = {
            _id: sparePart._id,
            requestId: sparePart.requestid,
            serviceId: sparePart.serviceId,
            mechanic: sparePart.mechanicId ? {
                id: sparePart.mechanicId._id,
                name: sparePart.mechanicId.name,
                phone: sparePart.mechanicId.phone,
                email: sparePart.mechanicId.email
            } : null,
            amount: sparePart.amount,
            partName: sparePart.partName,
            quantity: sparePart.partQuantity,
            carModel: sparePart.carName,
            year: sparePart.manufactured_year,
            urgency: sparePart.urgency,
            status: sparePart.status,
            requestedAt: sparePart.createdAt
        };

        if (sparePart.mechanicId.fcmToken != "") {
            fcmService.sendToUser(sparePart.mechanicId.fcmToken, {
                title: 'Spare part request status updated',
                body: `Your spare part request status has been updated to ${sparePart.status}`,
                type: 'notification',
                bookingId: sparePart._id
            }, "mechanic", sparePart.mechanicId._id);
        }


        res.status(200).json(formattedSparePart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get spare part by ID
const getSparePartById = async (req, res) => {
    try {
        const { id } = req.params;

        const sparePart = await SpareParts.findById(id)
            .populate('mechanicId', 'name phone email');

        if (!sparePart) {
            return res.status(404).json({ message: 'Spare part request not found' });
        }

        const formattedSparePart = {
            _id: sparePart._id,
            requestId: sparePart.requestid,
            serviceId: sparePart.serviceId,
            mechanic: sparePart.mechanicId ? {
                id: sparePart.mechanicId._id,
                name: sparePart.mechanicId.name,
                phone: sparePart.mechanicId.phone,
                email: sparePart.mechanicId.email
            } : null,
            amount: sparePart.amount,
            partName: sparePart.partName,
            quantity: sparePart.partQuantity,
            carModel: sparePart.carName,
            year: sparePart.manufactured_year,
            urgency: sparePart.urgency,
            status: sparePart.status,
            requestedAt: sparePart.createdAt
        };

        res.status(200).json(formattedSparePart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create new spare part request
const createSparePartRequest = async (req, res) => {
    try {
        const {
            serviceId,
            mechanicId,
            partName,
            partQuantity,
            carName,
            manufactured_year,
            urgency
        } = req.body;

        // Generate request ID
        const requestid = `SPR${Date.now()}`;

        const newSparePart = new SpareParts({
            requestid,
            serviceId,
            mechanicId,
            amount: "0",
            partName,
            partQuantity,
            carName,
            manufactured_year,
            urgency: urgency || "Medium",
            status: "pending"
        });

        await newSparePart.save();

        const savedSparePart = await SpareParts.findById(newSparePart._id)
            .populate('mechanicId', 'name phone email');

        const formattedSparePart = {
            id: savedSparePart._id,
            requestId: savedSparePart.requestid,
            serviceId: savedSparePart.serviceId,
            mechanic: savedSparePart.mechanicId ? {
                id: savedSparePart.mechanicId._id,
                name: savedSparePart.mechanicId.name,
                phone: savedSparePart.mechanicId.phone,
                email: savedSparePart.mechanicId.email
            } : null,
            amount: savedSparePart.amount,
            partName: savedSparePart.partName,
            quantity: savedSparePart.partQuantity,
            carModel: savedSparePart.carName,
            year: savedSparePart.manufactured_year,
            urgency: savedSparePart.urgency,
            status: savedSparePart.status,
            requestedAt: savedSparePart.createdAt
        };

        res.status(201).json(formattedSparePart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete spare part request
const deleteSparePartRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const sparePart = await SpareParts.findByIdAndDelete(id);

        if (!sparePart) {
            return res.status(404).json({ message: 'Spare part request not found' });
        }

        res.status(200).json({ message: 'Spare part request deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllSpareParts,
    updateSparePartStatus,
    getSparePartById,
    createSparePartRequest,
    deleteSparePartRequest
};
const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: [true, 'Service name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    Baseprice: {
        type: String,
        required: [true, 'Base price is required'],
        trim: true
    },
    duration: {
        type: String,
        required: [true, 'Duration is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Services", servicesSchema);
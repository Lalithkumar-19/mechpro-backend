const mongoose = require("mongoose");
const superAdminSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    revenue: [{
        month: { type: String },
        year: { type: String },
        amount: { type: String }
    }],
    Notifications: [{
        title: String,
        date: { type: Date, default: Date.now },
        from: String,
    }],
    fcmToken: { type: String, default: "" }


})

module.exports = mongoose.model("SuperAdmin", superAdminSchema);

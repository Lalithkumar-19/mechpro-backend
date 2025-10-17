const mongoose = require("mongoose");
const sparePartsSchema = new mongoose.Schema({
    requestid: { type: String },
    serviceId: { type: String },
    mechanicId: { type: mongoose.Schema.Types.ObjectId, ref: "Mechanic" },//who raied the request
    amount: { type: String },//basically it is 0 ,it is not used
    partName: { type: String },//name of the part
    partQuantity: { type: String },//quantity of the part
    carName: { type: String },//name of the car
    manufactured_year: { type: String },//manufactured year of the car
    urgency: { type: String, default: "Medium" },//urgency of the request
    status: { type: String, default: "pending" }

}, { timestamps: true })
module.exports = mongoose.model("SpareParts", sparePartsSchema);

const mongoose = require('mongoose');

const serviceRecordSchema = new mongoose.Schema({
    fileNumber: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerContactNo: {
        type: String,
        required: true
    },
    locationOnMap: {
        type: String,
        required: true
    },
    vehNo: {
        type: String,
        required: true
    },
    benefit: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    nearTo: {
        type: String,
        required: true
    },
    carModel: {
        type: String,
        required: true
    },
    carColor: {
        type: String,
        default: '' // Optional field, so default is empty
    },
    repairingDealer: {
        type: String,
        required: true
    }
}, { timestamps: true });

const ServiceRecord = mongoose.model('ServiceRecord', serviceRecordSchema);

module.exports = ServiceRecord;

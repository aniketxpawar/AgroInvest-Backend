// Harvest Schema
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Reference to the user who is the farmer
    },
    crop: {
        type: String,
        required: true,
    },
    expectedHarvestDate: {
        type: Date,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    totalInvestment: {
        type: Number,
        required: true,
    },
    stage: {
        type: String,
        required: true,
    }
});

const request = mongoose.model('request', requestSchema);

module.exports = request;

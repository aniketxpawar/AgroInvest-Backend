// Harvest Schema
const mongoose = require('mongoose');

const harvestSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Reference to the user who is the farmer
  },
  investments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'investment', // Array of references to investors
  }],
  crop: {
    type: String,
    required: true,
  },
  expectedHarvestDate: {
    type: Date,
    required: true,
  },
  totalInvestment: {
    type: Number,
    required: true,
  },
  amountPerKg: {
    type: Number
  },
  harvested: {
    type: Boolean,
    default: false, // Default to false indicating not yet harvested
  },
  soldOut: {
    type: Boolean,
    default:false
  },
  quantity: Number,
});

const Harvest = mongoose.model('harvest', harvestSchema);

module.exports = Harvest;

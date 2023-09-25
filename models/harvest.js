// Harvest Schema
const mongoose = require('mongoose');

const harvestSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Reference to the user who is the farmer
  },
  investors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Array of references to investors
  }],
  cropType: {
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
  harvested: {
    type: Boolean,
    default: false, // Default to false indicating not yet harvested
  },
  harvestDate: Date,
  wholesalePrice: Number,
  quantity: Number,
  investedAmount: [{
    investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user', // Reference to the investor
    },
    amount: Number,
  }],
});

const Harvest = mongoose.model('harvest', harvestSchema);

module.exports = Harvest;

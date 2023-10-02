// Investment Schema
const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Reference to the user who is the investor
  },
  harvest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'harvest', // Reference to the Harvest in which the investor has invested
  },
  quantity: Number,
  amount: {
    type: Number,
    required: true,
  },
  investmentDate: {
    type: Date,
    required: true,
  },
});

const Investment = mongoose.model('investment', investmentSchema);

module.exports = Investment;

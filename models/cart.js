// Cart Schema
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  investorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Reference to the user who is the investor
  },
  harvestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'harvest', // Reference to the Harvest in which the investor wants to invest
  },
  quantity: Number,
});

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;


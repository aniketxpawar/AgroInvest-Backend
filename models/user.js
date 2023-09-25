const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        enum: ['investor', 'farmer'],
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0, // Default balance to 0 for investors
    },
    harvests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'harvest',
    }],
});

const User = mongoose.model('user', userSchema);

module.exports = User;

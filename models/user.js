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
    fullName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        //required: true,
    },
    location: {
        type:String
    },
    area: {
        type: String
    },
    phone: {
        type: String,
        required: true,
    },
    otp: {
        value: String,
        epoch: Number,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false
    },
    balance: {
        type: Number,
        default: 0, // Default balance to 0 for investors
    },
    harvests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'harvest',
    }],
    img: {
        type: String,
        default:null
    }
});

const User = mongoose.model('user', userSchema);

module.exports = User;
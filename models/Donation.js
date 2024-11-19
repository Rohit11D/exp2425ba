// models/Donation.js
const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    donorInfo: {
        name: String,
        email: String,
        address: String,
        city: String,
        state: String,
        country: String,
        pinCode: String
    },
    amount: Number,
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String
}, { timestamps: true });

module.exports = mongoose.model('Donation', DonationSchema);

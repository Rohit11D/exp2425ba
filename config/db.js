const mongoose = require('mongoose');
const dotenv = require("dotenv");
require('dotenv').config({ path: './config.env' });
const DB_URL = require('../config.env');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
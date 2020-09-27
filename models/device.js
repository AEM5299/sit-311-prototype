const mongoose = require('mongoose');
// const GpsData = require('./gps_data');

module.exports = mongoose.model(
    'Device',
    new mongoose.Schema({
        deakin_id: { type: String, unique: true },
        email: { type: String },
        gps_data: { type: Array}
    }),
);
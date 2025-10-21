const mongoose = require('mongoose');


const flightSchema = new mongoose.Schema(
    {
        departure_airport_code  : String,
        arrival_airport_code : String,
        departure_time: Date,
        arrival_time: Date,
        duration_minutes : Number,
        airplane_id : String,
        ticket_price: Number
    },
    { timestamps: true }
);

const Flight = mongoose.model('Flight', flightSchema, 'flights');

module.exports = Flight;
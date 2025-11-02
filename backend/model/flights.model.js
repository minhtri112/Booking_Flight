const mongoose = require('mongoose');


const flightSchema = new mongoose.Schema(
    {
        departure_airport_code  : String,
        arrival_airport_code : String,
        departure_time: Date,
        arrival_time: Date,
        seat_layout : [{seat_number : String,value : Number,class : String, status : Boolean}],
        duration_minutes : Number,
        airplane_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Airplane' },
        ticket_price: Number
    },
    { timestamps: true }
);

const Flight = mongoose.model('Flight', flightSchema, 'flights');

module.exports = Flight;
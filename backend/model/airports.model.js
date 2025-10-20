const mongoose = require('mongoose');


const airportSchema = new mongoose.Schema(
    {
        airport_code : String,
        airport_name : String,
        city : String,
        country : String
    },
    { timestamps: true }
);

const Airport = mongoose.model('Airport', airportSchema, 'airports');

module.exports = Airport;
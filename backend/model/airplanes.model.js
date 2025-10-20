const mongoose = require('mongoose');


const accountSchema = new mongoose.Schema(
    {
        capacity : Number,
        seat_layout : [
            {
                seat_number : String,
                value : Number,
                class : String
            }
        ],
        airline_name : String,
    },
    { timestamps: true }
);

const Airplane = mongoose.model('Airplane', accountSchema, 'airplanes');

module.exports = Airplane;
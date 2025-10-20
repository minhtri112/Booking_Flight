const mongoose = require('mongoose');


const orderDetailsSchema = new mongoose.Schema(
    {
        flight_id : String,
        seat_number : [String],
        price : Number,
        status : Boolean
    },
    { timestamps: true }
);

const OrderDetails = mongoose.model('OrderDetails', orderDetailsSchema, 'orderDetails');

module.exports = OrderDetails;
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
       order_details : [String],
       account_id : String,
       passenger_count : Number,
       passenger_details : [
        {
            passenger_type : String,
            quantity : Number
        }
       ],
       date_created : String,
       total_price : Number,
       payment_method : String,
       contact_name : String,
       baggage_option: {
           type: { type: String, required: true },
           price: { type: Number, required: true }
       }
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema, 'orders');

module.exports = Order;

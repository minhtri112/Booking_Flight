
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        order_details: [{ type: mongoose.Schema.Types.String, ref: 'OrderDetails' }],
        account_id: { type: mongoose.Schema.Types.String, ref: 'Account' },
        passenger_count: Number,
        passenger_details: [
            {
                passenger_type: String,
                quantity: Number
            }
        ],
        total_price: Number,
        payment_method: String,
        contact_name: String,
        phone: String,
        baggage_option: {
            type: {
                type: String,
                default: ""
            },
            price: {
                type: Number,
                default: 0
            }
        },
        type_trip : String,
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema, 'orders');


module.exports = Order;
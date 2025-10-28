
const Flight = require('../model/flights.model');
const Order = require('../model/orders.model');
const OrderDetails = require('../model/orderDetails.model');

async function bookingFlight(data) {
    const { flight_id, account_id, seat_numbers, passenger_details, payment_method, contact_name, baggage_option } = data;

    const flight = await Flight.findById(flight_id);
    if (!flight) throw new Error('Không tìm thấy chuyến bay');

    
    const orderDetail = await OrderDetails.create({
        flight_id,
        seat_number: seat_numbers,
        price: flight.ticket_price * seat_numbers.length,
        status: true 
    });

   
    const order = await Order.create({
        order_details: [orderDetail._id],
        account_id,
        passenger_count: seat_numbers.length,
        passenger_details,
        total_price: orderDetail.price + (baggage_option?.price || 0), 
        payment_method,
        contact_name,
        baggage_option,
        date_created: new Date().toISOString()
    });

    return {
        order_id: order._id,
        contact_name: order.contact_name,
        total_price: order.total_price,
        payment_method: order.payment_method,
        flight: {
            from: flight.departure_airport_code,
            to: flight.arrival_airport_code,
            departure_time: flight.departure_time,
            arrival_time: flight.arrival_time,
            price: flight.ticket_price
        },
        seats: seat_numbers,
        passenger_details,
        baggage_option,
        status: true
    };
}

module.exports = bookingFlight;

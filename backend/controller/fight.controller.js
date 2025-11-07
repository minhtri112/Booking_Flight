const Flight = require('../model/flights.model.js');
const Airphane = require('../model/airplanes.model.js');
const OrderDetails = require('../model/orderDetails.model.js');
const Order = require('../model/orders.model.js');
const findOneWayFight = require('../helper/findOneWayFight');

// [POST] /flights/one-way
module.exports.oneWayFight = async (req, res) => {
   try {
      const { from, to, date, filter } = req.body;


      let result = await findOneWayFight(from, to, date);

      if (filter) {
         const { stops, time, airlines } = filter;
         if (stops != null) result = result.filter(item => item.totalStops <= parseInt(stops));
         if (time != null) result = result.filter(item => item.totalTime <= parseInt(time));
         if (airlines != null) {
            result = result.filter(item => {
               return airlines.includes(item.airline);
            });
         }
      }

      res.json(
         {
            status: "200",
            data: result
         }
      )

   }
   catch (err) {
      res.json(
         {
            status: "500",
            message: "Internal Server Error"
         }
      )
   }
}


module.exports.getFightById = async (req, res) => {
   try {
      const { id } = req.params;
      const flight = await Flight.findById(id);
      res.json({
         status: "200",
         data: flight
      });
   }
   catch (err) {
      res.json({
         status: "500",
         message: "Internal Server Error"
      });
   }
}

// [POST] /flights/booking
module.exports.bookingFlight = async (req, res) => {
   try {
      const { orderDetails, order } = req.body;
      let orderDetailsIds = [];
      for (const item of orderDetails) {
         await Flight.updateOne(
            { _id: item._id },
            {
               $set: { "seat_layout.$[elem].status": true }
            },
            {
               arrayFilters: [{
                  "elem.seat_number": { $in: item.seats }
               }]
            }
         );
         const orderDetail = {
            flight_id: item.id,
            seat_number: item.seats,
            price: item.price,
            status: true
         }
         const newOrderDetails = new OrderDetails(orderDetail);
         const savedOrderDetails = await newOrderDetails.save();
         orderDetailsIds.push(savedOrderDetails._id);
      }

      let passengerDetailsFormatted = order.passenger_details;

      if (
         order.passenger_details &&
         !Array.isArray(order.passenger_details)
      ) {
         passengerDetailsFormatted = Object.entries(order.passenger_details).map(
            ([key, value]) => ({
               passenger_type: key,
               quantity: value,
            })
         );
      }

      const newOrder = new Order({
         order_details: orderDetailsIds,
         account_id: order.account_id,
         passenger_count: order.passenger_count,
         passenger_details: passengerDetailsFormatted,
         total_price: order.total_price,
         payment_method: order.payment_method,
         contact_name: order.contact_name,
         phone: order.phone,
         baggage_option: order.baggage_option,
         type_trip : order.type_trip,
      });
      const savedOrder = await newOrder.save();
      res.json({
         status: "200",
         data: savedOrder
      });
   }
   catch (err) {
      console.log(err);
      res.json({
         status: "500",
         message: "Internal Server Error"
      });
   }
}
// // // Thay thế toàn bộ file helper/bookingFlight.js bằng nội dung này
// // const Flight = require('../model/flights.model');
// // const Order = require('../model/orders.model');
// // const OrderDetails = require('../model/orderDetails.model');
// // const mongoose = require('mongoose');

// // function normalizeSeatNumber(s) {
// //   if (typeof s !== 'string') return String(s);
// //   return s.trim().toUpperCase();
// // }

// // // chuyển mọi dạng status sang boolean "isBooked"
// // function isBookedValue(val) {
// //   if (val === true) return true;
// //   if (typeof val === 'string') {
// //     const x = val.trim().toLowerCase();
// //     // những giá trị coi là "đã đặt"
// //     return x === 'true' || x === '1' || x === 'yes' || x === 'booked' || x === 'đã đặt';
// //   }
// //   return false;
// // }

// // async function bookingFlight(data) {
// //   const session = await mongoose.startSession();
// //   session.startTransaction();

// //   try {
// //     const { flight_id, account_id, seat_numbers = [], passenger_details, payment_method, contact_name, baggage_option } = data;

// //     if (!flight_id) throw new Error('Thiếu flight_id');
// //     if (!Array.isArray(seat_numbers) || seat_numbers.length === 0) throw new Error('Vui lòng chọn ghế');

// //     // chuẩn hoá danh sách ghế từ client
// //     const seatNums = seat_numbers.map(normalizeSeatNumber);

// //     // 1) Tìm chuyến bay
// //     const flight = await Flight.findById(flight_id).session(session);
// //     if (!flight) throw new Error('Không tìm thấy chuyến bay');

// //     // 2) Kiểm tra ghế đã đặt bằng cách inspect seat_layout trong document
// //     // (ở đây đọc từ flight đã load)
// //     const bookedSeats = [];
// //     for (const seat of flight.seat_layout) {
// //       const sn = normalizeSeatNumber(seat.seat_number);
// //       if (seatNums.includes(sn) && isBookedValue(seat.status)) {
// //         bookedSeats.push(sn);
// //       }
// //     }

// //     if (bookedSeats.length > 0) {
// //       throw new Error(`Các ghế đã được đặt: ${bookedSeats.join(', ')}`);
// //     }

// //     // 3) Nếu muốn an toàn hơn trong môi trường nhiều client, ta có thể dùng update with $elemMatch
// //     // nhưng ở đây ta cập nhật local flight.seat_layout rồi save (với transaction)
// //     flight.seat_layout = flight.seat_layout.map((seat) => {
// //       const sn = normalizeSeatNumber(seat.seat_number);
// //       if (seatNums.includes(sn)) {
// //         // đảm bảo cập nhật thành Boolean true (đã được đặt)
// //         // nếu bạn muốn status = false nghĩa là đã đặt -> đổi logic tương ứng
// //         return {
// //           ...((typeof seat.toObject === 'function') ? seat.toObject() : seat),
// //           seat_number: sn,
// //           status: true
// //         };
// //       }
// //       return {
// //         ...((typeof seat.toObject === 'function') ? seat.toObject() : seat),
// //         seat_number: sn,
// //         status: isBookedValue(seat.status) // chuẩn hoá kiểu
// //       };
// //     });

// //     // đánh dấu nếu cần: flight.markModified('seat_layout');
// //     await flight.save({ session });

// //     // 4) Tính tổng giá
// //     const basePrice = (flight.ticket_price || 0) * seatNums.length;
// //     const baggagePrice = (baggage_option && baggage_option.price) ? baggage_option.price : 0;
// //     const totalPrice = basePrice + baggagePrice;

// //     // 5) Tạo order detail
// //     const orderDetail = await OrderDetails.create([{
// //       flight_id,
// //       seat_number: seatNums,
// //       price: basePrice,
// //       status: true
// //     }], { session });

// //     // 6) Tạo order chính
// //     const order = await Order.create([{
// //       order_details : [orderDetail[0]._id.toString()],
// //       account_id,
// //       passenger_count: seatNums.length,
// //       passenger_details,
// //       total_price: totalPrice,
// //       payment_method,
// //       contact_name,
// //       baggage_option,
// //       date_created: new Date().toISOString()
// //     }], { session });

// //     await session.commitTransaction();
// //     session.endSession();

// //     // 7) Trả kết quả
// //     return {
// //       order_id: order[0]._id,
// //       contact_name,
// //       total_price: totalPrice,
// //       payment_method,
// //       flight: {
// //         from: flight.departure_airport_code,
// //         to: flight.arrival_airport_code,
// //         departure_time: flight.departure_time,
// //         arrival_time: flight.arrival_time,
// //         ticket_price: flight.ticket_price,
// //         seat_layout: flight.seat_layout,
// //       },
// //       seats: seatNums,
// //       passenger_details,
// //       baggage_option,
// //       status: true,
// //       message: 'Đặt vé thành công!',
// //     };

// //   } catch (err) {
// //     await session.abortTransaction();
// //     session.endSession();
// //     throw err;
// //   }
// // }

// // module.exports = bookingFlight;
// // helper/bookingFlight.js
// const mongoose = require('mongoose');
// const Flight = require('../model/flights.model');
// const Order = require('../model/orders.model');
// const OrderDetails = require('../model/orderDetails.model');

// // 🔹 Chuẩn hoá số ghế
// function normalizeSeatNumber(s) {
//   if (typeof s !== 'string') return String(s);
//   return s.trim().toUpperCase();
// }

// // 🔹 Chuyển mọi dạng status sang boolean "đã đặt"
// function isBookedValue(val) {
//   if (val === true) return true;
//   if (typeof val === 'string') {
//     const x = val.trim().toLowerCase();
//     return ['true', '1', 'yes', 'booked', 'đã đặt'].includes(x);
//   }
//   return false;
// }

// async function bookingFlight(data) {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { flight_id, account_id, seat_numbers = [], passenger_details, payment_method, contact_name, baggage_option } = data;

//     if (!flight_id) throw new Error('Thiếu flight_id');
//     if (!Array.isArray(seat_numbers) || seat_numbers.length === 0) throw new Error('Vui lòng chọn ghế');

//     const seatNums = seat_numbers.map(normalizeSeatNumber);

//     // 1️⃣ Tìm chuyến bay
//     const flight = await Flight.findById(flight_id).session(session);
//     if (!flight) throw new Error('Không tìm thấy chuyến bay');

//     // 2️⃣ Kiểm tra ghế đã được đặt
//     const bookedSeats = [];
//     for (const seat of flight.seat_layout || []) {
//       const sn = normalizeSeatNumber(seat.seat_number);
//       if (seatNums.includes(sn) && isBookedValue(seat.status)) {
//         bookedSeats.push(sn);
//       }
//     }

//     if (bookedSeats.length > 0) {
//       throw new Error(`Các ghế đã được đặt: ${bookedSeats.join(', ')}`);
//     }

//     // 3️⃣ Cập nhật trạng thái ghế
//     flight.seat_layout = (flight.seat_layout || []).map((seat) => {
//       const sn = normalizeSeatNumber(seat.seat_number);
//       if (seatNums.includes(sn)) {
//         return {
//           ...((typeof seat.toObject === 'function') ? seat.toObject() : seat),
//           seat_number: sn,
//           status: true,
//         };
//       }
//       return {
//         ...((typeof seat.toObject === 'function') ? seat.toObject() : seat),
//         seat_number: sn,
//         status: isBookedValue(seat.status),
//       };
//     });

//     await flight.save({ session });

//     // 4️⃣ Tính tổng giá
//     const ticketPrice = flight.ticket_price || 0;
//     const basePrice = ticketPrice * seatNums.length;
//     const baggagePrice = (baggage_option && baggage_option.price) ? baggage_option.price : 0;
//     const totalPrice = basePrice + baggagePrice;

//     // 5️⃣ Tạo order detail
//     const orderDetail = await OrderDetails.create([{
//       flight_id,
//       seat_number: seatNums,
//       price: basePrice,
//       status: true,
//     }], { session });

//     // 6️⃣ Tạo order
//     const order = await Order.create([{
//       order_details: [orderDetail[0]._id.toString()],
//       account_id,
//       passenger_count: seatNums.length,
//       passenger_details,
//       total_price: totalPrice,
//       payment_method,
//       contact_name,
//       baggage_option,
//       date_created: new Date().toISOString(),
//     }], { session });

//     await session.commitTransaction();
//     session.endSession();

//     // 7️⃣ Trả kết quả
//     return {
//       order_id: order[0]._id,
//       contact_name,
//       total_price: totalPrice,
//       payment_method,
//       flight: {
//         from: flight.departure_airport_code || flight.departureAirportCode || 'UNKNOWN',
//         to: flight.arrival_airport_code || flight.arrivalAirportCode || 'UNKNOWN',
//         departure_time: flight.departure_time,
//         arrival_time: flight.arrival_time,
//         ticket_price: flight.ticket_price || 0,
//         seat_layout: flight.seat_layout,
//       },
//       seats: seatNums,
//       passenger_details,
//       baggage_option,
//       status: true,
//       message: 'Đặt vé thành công!',
//     };

//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error('❌ Lỗi bookingFlight:', err.message);
//     throw err;
//   }
// }

// module.exports = bookingFlight;



// helper/bookingFlight.js
const mongoose = require('mongoose');
const Flight = require('../model/flights.model');
const Order = require('../model/orders.model');
const OrderDetails = require('../model/orderDetails.model');

// 🔹 Chuẩn hoá số ghế
function normalizeSeatNumber(s) {
  if (typeof s !== 'string') return String(s);
  return s.trim().toUpperCase();
}

// 🔹 Chuyển mọi dạng status sang boolean "đã đặt"
function isBookedValue(val) {
  if (val === true) return true;
  if (typeof val === 'string') {
    const x = val.trim().toLowerCase();
    return ['true', '1', 'yes', 'booked', 'đã đặt'].includes(x);
  }
  return false;
}

// 🔹 Hàm xử lý đặt nhiều chuyến (1 chiều hoặc khứ hồi)
async function bookingFlight(data) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      account_id,
      payment_method,
      contact_name,
      baggage_option,
      flights = [],
    } = data;

    if (!Array.isArray(flights) || flights.length === 0) {
      throw new Error('Vui lòng cung cấp ít nhất một chuyến bay.');
    }

    let totalPrice = 0;
    const allOrderDetails = [];
    const flightSummaries = [];

    // 🔸 Xử lý từng chuyến bay
    for (const f of flights) {
      const { flight_id, seat_numbers = [], passenger_details } = f;

      if (!flight_id) throw new Error('Thiếu flight_id trong chuyến bay.');
      if (!Array.isArray(seat_numbers) || seat_numbers.length === 0)
        throw new Error('Vui lòng chọn ghế cho từng chuyến bay.');

      const seatNums = seat_numbers.map(normalizeSeatNumber);

      // 1️⃣ Tìm chuyến bay
      const flight = await Flight.findById(flight_id).session(session);
      if (!flight) throw new Error(`Không tìm thấy chuyến bay ${flight_id}`);

      // 2️⃣ Kiểm tra ghế trùng
      const bookedSeats = [];
      for (const seat of flight.seat_layout || []) {
        const sn = normalizeSeatNumber(seat.seat_number);
        if (seatNums.includes(sn) && isBookedValue(seat.status)) {
          bookedSeats.push(sn);
        }
      }
      if (bookedSeats.length > 0) {
        throw new Error(`Các ghế đã được đặt (${flight_id}): ${bookedSeats.join(', ')}`);
      }

      // 3️⃣ Cập nhật ghế
      flight.seat_layout = (flight.seat_layout || []).map((seat) => {
        const sn = normalizeSeatNumber(seat.seat_number);
        if (seatNums.includes(sn)) {
          return {
            ...((typeof seat.toObject === 'function') ? seat.toObject() : seat),
            seat_number: sn,
            status: true,
          };
        }
        return {
          ...((typeof seat.toObject === 'function') ? seat.toObject() : seat),
          seat_number: sn,
          status: isBookedValue(seat.status),
        };
      });
      await flight.save({ session });

      // 4️⃣ Tính giá vé từng chuyến
      const basePrice = (flight.ticket_price || 0) * seatNums.length;
      const baggagePrice = (baggage_option && baggage_option.price) ? baggage_option.price : 0;
      const flightTotal = basePrice + baggagePrice;
      totalPrice += flightTotal;

      // 5️⃣ Tạo OrderDetail cho chuyến hiện tại
      const orderDetail = await OrderDetails.create([{
        flight_id,
        seat_number: seatNums,
        price: basePrice,
        status: true,
      }], { session });

      allOrderDetails.push(orderDetail[0]._id.toString());

      // 6️⃣ Ghi thông tin tóm tắt chuyến bay
      flightSummaries.push({
        flight_id,
        from: flight.departure_airport_code || flight.departureAirportCode || 'UNKNOWN',
        to: flight.arrival_airport_code || flight.arrivalAirportCode || 'UNKNOWN',
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        ticket_price: flight.ticket_price,
        seat_layout: flight.seat_layout,
        seats: seatNums,
        passenger_details,
      });
    }

    // 7️⃣ Tạo Order tổng hợp
    const order = await Order.create([{
      order_details: allOrderDetails,
      account_id,
      passenger_count: flightSummaries.reduce((acc, f) => acc + f.seats.length, 0),
      passenger_details: flights.flatMap(f => f.passenger_details || []),
      total_price: totalPrice,
      payment_method,
      contact_name,
      baggage_option,
      date_created: new Date().toISOString(),
    }], { session });

    await session.commitTransaction();
    session.endSession();

    // 8️⃣ Trả về thông tin kết quả
    return {
      order_id: order[0]._id,
      contact_name,
      total_price: totalPrice,
      payment_method,
      baggage_option,
      flights: flightSummaries,
      status: true,
      message: flights.length > 1 ? 'Đặt vé khứ hồi thành công!' : 'Đặt vé thành công!',
    };

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('❌ Lỗi bookingFlight:', err.message);
    throw err;
  }
}

module.exports = bookingFlight;


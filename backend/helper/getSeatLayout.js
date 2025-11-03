const Flight = require('../model/flights.model');

/**
 * Lấy danh sách seat_layout của 1 hoặc nhiều chuyến bay
 * @param {string|string[]} flightIds - 1 ID hoặc mảng ID
 * @returns {Promise<Array>} mảng seat layout
 */
async function getSeatLayouts(flightIds) {
  if (!flightIds) throw new Error('flightIds is required');

  // Nếu chỉ 1 ID, chuyển thành mảng
  if (!Array.isArray(flightIds)) flightIds = [flightIds];

  // Lấy thông tin các chuyến bay
  const flights = await Promise.all(
    flightIds.map(async (id) => {
      const flight = await Flight.findById(id);
      if (!flight) throw new Error(`Không tìm thấy chuyến bay với ID: ${id}`);
      return {
        flight_id: flight._id,
        airplane_id: flight.airplane_id,
        from: flight.departure_airport_code,
        to: flight.arrival_airport_code,
        ticket_price: flight.ticket_price,
        seat_layout: flight.seat_layout,
      };
    })
  );

  return flights;
}

module.exports = getSeatLayouts;

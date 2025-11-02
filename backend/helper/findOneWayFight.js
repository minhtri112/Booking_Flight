const dayjs = require('dayjs');
const Flight = require('../model/flights.model.js');
const Queue = require('collections/Deque');

module.exports = async function findOneWayFight(from, to, date) {
  let results = [];
  let check = new Map();

  try {
    const queue = new Queue();

    const startOfDay = new Date(`${date}T00:00:00Z`);
    const endOfDay = new Date(`${date}T23:59:59Z`);



    const flights = await Flight.find({
      departure_airport_code: from,
      departure_time: { $gte: startOfDay, $lte: endOfDay },
    })
      .select('-seat_layout')
      .populate('airplane_id', 'airline_name'); 


    flights.forEach(item => {
      if (
        item.arrival_airport_code === to
      ) {
        results.push({
          currentFight: item,
          path: [item],
          totalStops: 0,
          totalPrice: item.ticket_price,
          totalTime: item.duration_minutes,
          airline: item.airplane_id?.airline_name || 'Unknown' 
        });
      } else {
        queue.push({
          currentFight: item,
          path: [item],
          totalStops: 0,
          totalPrice: item.ticket_price,
          totalTime: item.duration_minutes
        });
      }
    });

    while (queue.length !== 0) {
      const current = queue.shift();

      if (!check[current.currentFight.departure_airport_code]) {
        check[current.currentFight.departure_airport_code] = true;

        if (current.totalStops >= 7) continue; 

        const nextFlights = await Flight.find({
          departure_airport_code: current.currentFight.arrival_airport_code,
          departure_time: { $gte: current.currentFight.arrival_time },
        })
          .select('-seat_layout')
          .populate('airplane_id', 'airline_name');

        nextFlights.forEach(item => {
          if (
            item.arrival_airport_code === to
          ) {
            results.push({
              currentFight: item,
              path: [...current.path, item],
              totalStops: current.totalStops + 1,
              totalPrice: current.totalPrice + item.ticket_price,
              totalTime: current.totalTime + item.duration_minutes,
              airline: item.airplane_id?.airline_name || 'Unknown'
            });
          } else {
            if (!check[item.departure_airport_code])
              queue.push({
                currentFight: item,
                path: [...current.path, item],
                totalStops: current.totalStops + 1,
                totalPrice: current.totalPrice + item.ticket_price,
                totalTime: current.totalTime + item.duration_minutes
              });
          }
        });
      }
    }
  } catch (err) {
    console.error(err);
  }

  return results;
};

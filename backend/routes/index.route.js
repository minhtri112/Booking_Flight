const flightRoute = require('./fight.route');
const airportRoute = require('./airport.route');

module.exports = (app) => {
  app.use('/api/flights', flightRoute);   // thêm /api prefix cho chuẩn REST
  app.use('/api/airports', airportRoute);
};

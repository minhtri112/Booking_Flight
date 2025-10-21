const flightRoute = require('./fight.route');
const airportRoute = require('./airport.route');
module.exports = (app)=>{
    app.use('/flights', flightRoute);
    app.use('/airports',airportRoute);
}
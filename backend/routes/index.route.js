const flightRoute = require('./fight.route');
const airportRoute = require('./airport.route');
const accountRoute = require('./account.route');
const airplaneRoute = require('./airplane.route');
module.exports = (app)=>{
    app.use('/flights', flightRoute);
    app.use('/airports',airportRoute);
    app.use('/accounts', accountRoute);
    app.use('/airplanes', airplaneRoute);
}
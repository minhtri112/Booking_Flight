const flightRoute = require('./fight.route');
const airportRoute = require('./airport.route');
const accountRoute = require('./account.route');
module.exports = (app)=>{
    app.use('/flights', flightRoute);
    app.use('/airports',airportRoute);
    app.use('/accounts', accountRoute);
}
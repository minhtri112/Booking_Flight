const flightRoute = require('./fight.route');

module.exports = (app)=>{
    app.use('/', flightRoute);
}
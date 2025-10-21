const express = require('express');
const router = express.Router();

const controller = require('../controller/airport.controller');

router.get('/search',controller.getAirportsByName);


module.exports = router;
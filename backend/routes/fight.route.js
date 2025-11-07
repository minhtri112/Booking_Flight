const express = require('express');
const router = express.Router();

const controller = require('../controller/fight.controller');

router.post('/one-way',controller.oneWayFight);
router.get('/:id', controller.getFightById);
router.post('/booking', controller.bookingFlight);


module.exports = router;
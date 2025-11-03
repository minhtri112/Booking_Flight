const express = require('express');
const router = express.Router();

const controller = require('../controller/fight.controller');


router.post('/one-way',controller.oneWayFight);

router.post('/booking', controller.booking);

// Lấy seat layout cho 1 hoặc nhiều chuyến bay
// 1 chuyến: /api/flights/seats?flight_id=ID
// 2 chuyến: /api/flights/seats?flight_id=ID1,ID2
router.get('/seats', controller.getSeatsByFlight);

module.exports = router;
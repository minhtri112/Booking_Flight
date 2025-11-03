const express = require('express');
const router = express.Router();

const controller = require('../controller/fight.controller');

router.post('/one-way',controller.oneWayFight);


module.exports = router;
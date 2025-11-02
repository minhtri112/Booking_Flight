const express = require('express');
const router = express.Router();

const controller = require("../controller/airplane.controller");

router.get('/airlines',controller.getAirlines);


module.exports = router;

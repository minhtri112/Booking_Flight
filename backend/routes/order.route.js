const express = require('express');
const router = express.Router();

const controller = require('../controller/order.controller');

router.get('/:id', controller.getOrderById);

module.exports = router;
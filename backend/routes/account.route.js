const express = require('express');
const router = express.Router();
const controller = require('../controller/account.controller.js');


router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/:token', controller.findByToken);
router.get('/orders/:userID', controller.findOrdersByUserID);



module.exports = router;
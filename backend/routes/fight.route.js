const express = require('express');
const router = express.Router();

const controller = require('../controller/fight.controller');

router.get('/',controller.index);


module.exports = router;
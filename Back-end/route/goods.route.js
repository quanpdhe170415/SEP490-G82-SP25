const express = require('express');
const router = express.Router();
const controller = require('../controller/index');

//Searching goods
router.get('/search', controller.goodsController.filterByPriceRange);

module.exports = router;
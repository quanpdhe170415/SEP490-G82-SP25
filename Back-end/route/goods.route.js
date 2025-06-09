const express = require('express');
const router = express.Router();
const controller = require('../controller/index');

//Searching goods
router.get('/searchGoods', controller.goodsController.searchGoods);
router.get('/filterByCategory', controller.goodsController.filterByCategory);
router.get('/filterByStatus', controller.goodsController.filterByStatus);
router.get('/filterGoodsByPriceRange', controller.goodsController.filterGoodsByPriceRange);

module.exports = router;
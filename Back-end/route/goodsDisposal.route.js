const express = require('express');
const router = express.Router();
const controller = require('../controller/index');

router.get('/list', controller.goodsDisposalController.getListDisposal);
router.get('/detail/:id', controller.goodsDisposalController.getDetailDisposal);

module.exports = router;
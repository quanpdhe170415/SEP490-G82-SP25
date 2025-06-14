const express = require('express');
const router = express.Router();
const controller = require('../controller/index');
router.get('/products-for-retail', controller.productController.getProductsForRetail);
module.exports = router;

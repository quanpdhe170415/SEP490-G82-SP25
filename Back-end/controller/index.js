const authenController = require('./authen.controller');
const goodsController = require('./goods.controller');
const productController = require('./product.controller');
const shiftController = require('./shift.controller');
const paymentController = require('./pay.controller');

module.exports = {
    goodsController,
    authenController,
    shiftController,
    paymentController,
    productController
};
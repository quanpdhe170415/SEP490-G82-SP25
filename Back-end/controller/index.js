const authenController = require('./authen.controller');
const productController = require('./product.controller');
const shiftController = require('./shift.controller');
const paymentController = require('./pay.controller');
const billController = require('./bill.controller');
module.exports = {
    authenController,
    shiftController,
    paymentController
    billController,
    productController
};
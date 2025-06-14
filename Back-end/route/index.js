const express = require('express');
const router = express.Router();

const authenRouter = require('./authen.route');
const productRouter = require('./product.route');
const shiftRouter = require('./shift.route');
const goodsRoute = require('./goods.route');
const paymentRouter = require('./pay.route');

router.use('/product', productRouter);
router.use('/goods', goodsRoute);
router.use('/auth', authenRouter);
router.use('/shift', shiftRouter); 
router.use('/payment', paymentRouter);

module.exports = router;
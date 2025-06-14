const express = require('express');
const router = express.Router();

const authenRouter = require('./authen.route');
const shiftRouter = require('./shift.route')
const paymentRouter = require('./pay.route');

router.use('/auth', authenRouter);
router.use('/shift', shiftRouter); 
router.use('/payment', paymentRouter);

module.exports = router;
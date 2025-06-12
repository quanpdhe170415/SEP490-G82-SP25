const express = require('express');
const router = express.Router();

const authenRouter = require('./authen.route');
const productRouter = require('./product.route');

router.use('/auth', authenRouter);
router.use('/product', productRouter);

module.exports = router;
const express = require('express');
const router = express.Router();

const authenRoute = require('./authen.route');
const goodsRoute = require('./goods.route');

router.use('/authen', authenRoute);
router.use('/goods', goodsRoute);

module.exports = router;
const express = require('express');
const router = express.Router();

const billRoute = require('./bill.route');

router.use('/bill', billRoute);

module.exports = router;
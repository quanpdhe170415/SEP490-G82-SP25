const express = require('express');
const router = express.Router();

router.use('/invoice', require('./invoice.route'));

// Thêm các route khác nếu có

module.exports = router;
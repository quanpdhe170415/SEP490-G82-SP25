const express = require('express');
const router = express.Router();

const authenRouter = require('./authen.route');

router.use('/auth', authenRouter);

module.exports = router;
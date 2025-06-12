const express = require('express');
const router = express.Router();

const authenRouter = require('./authen.route');
const shiftRouter = require('./shift.route')

router.use('/auth', authenRouter);
router.use('/shift', shiftRouter); 

module.exports = router;
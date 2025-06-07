const express = require('express');
const router = express.Router();

const authenRoute = require('./authen.route');


router.use('/authen', authenRoute);


module.exports = router;
const express = require('express');
const router = express.Router();
const changepassController = require('../controller/changepass.controller');

router.post('/change-password', changepassController.changePassword);

module.exports = router;
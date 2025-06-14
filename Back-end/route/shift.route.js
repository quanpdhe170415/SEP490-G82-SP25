const express = require('express');
const router = express.Router();
const controller = require('../controller/index');
router.post('/openshift', controller.shiftController.openShift);
module.exports = router;
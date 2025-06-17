const express = require('express');
const router = express.Router();
const controller = require('../controller/index');

router.post('/export', controller.exportController.createExportRequest);

module.exports = router;
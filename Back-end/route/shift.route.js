const express = require('express');
const router = express.Router();
const controller = require('../controller/index');
router.post('/handover', controller.shiftController.handoverShift);
router.post('/openshift', controller.shiftController.openShift);
router.post('/closeshift/:shiftId', controller.shiftController.closeShift);
router.post('/export/:shiftId', controller.shiftController.exportShiftReport);
module.exports = router;
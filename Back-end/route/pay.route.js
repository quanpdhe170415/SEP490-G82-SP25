const express = require('express');
const router = express.Router();
const controller = require('../controller/index');
router.get('/:billId', controller.payController.getPaymentDetails);
router.post('/:billId/add-item',  controller.payController.addItemToBill);
router.put('/:billId/hold',  controller.payController.holdBill);
router.post('/:billId/cash',  controller.payController.processCashPayment);
module.exports = router;
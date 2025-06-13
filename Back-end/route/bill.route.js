const express = require('express');
const router = express.Router();
const controller = require('../controller/index');

router.post('/create', controller.billController.createBill);
//search bill with billNumber, customer name or phone
router.get('/search', controller.billController.searchBills);
//filter bill by status
router.get('/filter/status', controller.billController.filterBillsByStatus);
//filter bill by payment method
router.get('/filter/payment', controller.billController.filterBillsByPaymentMethod);
module.exports = router;
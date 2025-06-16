const express = require('express');
const router = express.Router();
const controller = require('../controller/index');
// router.get('/:billId', controller.payController.getPaymentDetails);
// router.post('/:billId/add-item',  controller.payController.addItemToBill);
// router.put('/:billId/hold',  controller.payController.holdBill);
// router.post('/:billId/cash',  controller.payController.processPayment);

// router.post('/createbill', controller.paymentController.createBill); // Tạo đơn hàng mới
router.get('/:billId', controller.paymentController.getPaymentDetails); // Lấy chi tiết thanh toán
// router.post('/:billId/add-item', controller.paymentController.addItemToBill); // Thêm hàng hóa vào đơn
router.post('/:billId/process', controller.paymentController.processPayment); // Xử lý thanh toán
router.post('/take-to-display', controller.paymentController.takeToDisplay);
router.post('/createbill', controller.paymentController.manageBill);
module.exports = router;
const express = require("express");
const router = express.Router();
const controller = require("../controller/index");

// Lấy danh sách hóa đơn có thể trả hàng
router.get("/bills", controller.returnOrderController.getBillsForReturn);

// Lấy chi tiết hóa đơn để trả hàng
router.get(
  "/bills/:bill_id",
  controller.returnOrderController.getBillDetailsForReturn
);

// Tạo yêu cầu trả hàng
router.post("/", controller.returnOrderController.createReturnOrder);

// Lấy danh sách return orders đã tạo
router.get("/", controller.returnOrderController.getReturnOrders);

// Lấy chi tiết return order
router.get(
  "/:return_order_id",
  controller.returnOrderController.getReturnOrderDetails
);

module.exports = router;

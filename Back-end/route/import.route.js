const express = require("express");
const router = express.Router();
const controller = require("../controller/index");

// Lấy danh sách phiếu nhập
router.get("/", controller.importController.getAllPurchases);

// Lấy chi tiết phiếu nhập
router.get("/:id", controller.importController.getPurchaseDetails);
router.put("/:id", controller.importController.updatePurchaseDetails);
module.exports = router;

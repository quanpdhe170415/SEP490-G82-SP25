const express = require("express");
const router = express.Router();
const controller = require("../controller/index");

router.post("/assigned", controller.purchaseOrderController.getAssignedPurchaseOrders);
router.get("/:id", controller.purchaseOrderController.getPurchaseOrderDetail);
router.get("/:id/batches", controller.purchaseOrderController.getPurchaseOrderImportBatches);
router.patch("/:id/pin", controller.purchaseOrderController.togglePurchaseOrderPin);

module.exports = router;

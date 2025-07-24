const express = require('express');
const router = express.Router();
const controller = require('../controller/index');

router.get('/checks/areas',   controller.inventoryCheckController.getInventoryAreas);
router.post('/checks/:inventoryCode/start',  controller.inventoryCheckController.startInventory);
router.post('/checks/:inventoryCode/complete',   controller.inventoryCheckController.completeInventory);
router.post('/checks/:inventoryCode/cancel',   controller.inventoryCheckController.cancelInventory);
router.get('/checks/:inventoryCode/areas/:areaId',   controller.inventoryCheckController.getInventoryAreaDetails);
router.put('/items/:itemId',   controller.inventoryCheckController.updateItemQuantity);
router.put('/items/:itemId/defect',   controller.inventoryCheckController.updateItemDefect);
router.get('/checks/:inventoryCode/report',   controller.inventoryCheckController.exportInventoryReport);
router.get('/checks/:checkId',  controller.inventoryCheckController.getInventoryCheckDetails);

module.exports = router;
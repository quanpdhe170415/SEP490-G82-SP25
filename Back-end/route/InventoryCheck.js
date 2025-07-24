const express = require('express');
const router = express.Router();
const controller = require('../controller/index');

router.get('/checks/:id/areas',   controller.inventoryCheckController.getInventoryAreas);
router.post('/checks/:id/start',  controller.inventoryCheckController.startInventory);
router.post('/checks/:id/complete',   controller.inventoryCheckController.completeInventory);
router.post('/checks/:id/cancel',   controller.inventoryCheckController.cancelInventory);
router.get('/checks/:id/areas/:areaId',   controller.inventoryCheckController.getInventoryAreaDetails);
router.put('/items/:itemId',   controller.inventoryCheckController.updateItemQuantity);
router.put('/items/:itemId/defect',   controller.inventoryCheckController.updateItemDefect);
router.get('/checks/:id/report',   controller.inventoryCheckController.exportInventoryReport);
router.get('/checks/:id',  controller.inventoryCheckController.getInventoryCheckDetails);
router.post('/inventory/tasks', controller.inventoryTaskController.createInventoryTask);
router.put('/inventory/tasks/:id', controller.inventoryTaskController.updateInventoryTask);
router.get('/inventory/tasks/:taskId', controller.inventoryTaskController.getInventoryTaskById);
module.exports = router;
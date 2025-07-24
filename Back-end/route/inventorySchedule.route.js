const express = require('express');
const router = express.Router();
const controller = require('../controller/index');

// Tạo lịch kiểm kho
router.post('/create', controller.inventoryScheduleController.createInventorySchedule);

// Xem danh sách lịch kiểm kho
router.get('/view', controller.inventoryScheduleController.getInventorySchedules);

// Xem chi tiết lịch kiểm kho
router.get('/view/:id', controller.inventoryScheduleController.getInventoryScheduleById);

module.exports = router;
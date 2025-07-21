const express = require('express');
const router = express.Router();
const controller = require('../controller/index');



// Lấy danh sách các công việc được giao cho user đang đăng nhập
// GET /api/receiving-tasks
router.post('/' ,controller.ReceiveGoodsController.getAssignedTasks);

// Lấy chi tiết một công việc theo ID
// GET /api/receiving-tasks/60d21b4667d0d8992e610c85
router.get('/:id', controller.ReceiveGoodsController.getTaskDetails);

module.exports = router;
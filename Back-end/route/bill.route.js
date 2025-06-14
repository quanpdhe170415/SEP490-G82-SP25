const Router = require('express').Router();
const { billController } = require('../controller');

Router.get('/checkStatus', billController.isBillPaid);

// GET: Lấy danh sách tất cả hóa đơn
Router.get("/", billController.getAllBills);

// GET: Lấy thông tin một hóa đơn theo ID
Router.get("/:id", billController.getBillById);

module.exports = Router;
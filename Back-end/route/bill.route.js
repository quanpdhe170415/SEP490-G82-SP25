const Router = require('express').Router();
const { billController } = require('../controller');
Router.post("/create", billController.createBill); // Thêm dòng này

Router.get('/checkStatus', billController.isBillPaid);

// GET: Lấy danh sách tất cả hóa đơn
Router.get("/", billController.getAllBills);

// GET: Lấy thông tin một hóa đơn theo ID
Router.get("/:id", billController.getBillDetailById);

module.exports = Router;
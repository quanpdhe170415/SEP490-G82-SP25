const authenController = require('./authen.controller');
const goodsController = require('./goods.controller');
const productController = require('./product.controller');
const shiftController = require('./shift.controller');
const paymentController = require('./pay.controller');
const invoiceController = require('./invoice.controller');
const billController = require('./bill.controller');
const returnOrderController = require("./returnrorder.controller");
const importController = require("./import.controller");
const exportController = require("./export.controller");
const goodsDisposalController = require('./goodsDisposal.controller');

module.exports = {
  goodsController,
  authenController,
  shiftController,
  paymentController,
  authenController,
  productController,
  invoiceController,
  billController,
  goodsDisposalController,
  productController,
  returnOrderController,
  importController,
  exportController
};
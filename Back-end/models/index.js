const mongoose = require('mongoose');
const Account = require('./account');
const Role = require('./role');
const UserDetail = require('./userDetail');
const Permission = require('./permission');
const Goods = require('./goods');
const ImportBatch = require('./import_batch');
const ImportDetail = require('./import_detail');
const PriceHistory = require('./price_history');
const Category = require('./category');
const Stockmovement = require('./stockmovement');
const Shift = require('./shift');
const CashDenomination = require('./cashdenomination');
const Bill = require('./bill');
const Status = require('./statusBill');
const BillDetail = require('./billDetail');
const ReturnOrder = require("./returnOrder"); 
const ReturnDetail = require("./returndetail");
const PurchaseOrder = require("./purchaseOrder");
const StatusWarehouse = require("./statuswarehouse")
const Supplier = require("./supplier");

const GoodsDisposal = require('./goodsDisposal');
const DisposalItem = require('./disposalItem');
const Session = require('./session');
const ShiftType = require('./shiftType');

mongoose.Promise = global.Promise;

const db = {
  Account,
  Role,
  Goods,
  ImportBatch,
  ImportDetail,
  PriceHistory,
  Permission,
  Category,
  Stockmovement,
  Shift,
  CashDenomination,
  Bill,
  Status,
  BillDetail,
  ReturnOrder,
  ReturnDetail,
  PurchaseOrder,
  Supplier,
  StatusWarehouse,
  GoodsDisposal,
  DisposalItem,
  UserDetail,
  Session,
  ShiftType
};
  

module.exports = db;

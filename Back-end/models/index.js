const mongoose = require('mongoose');
require('dotenv').config();

const Account = require('./account');
const Role = require('./role');
const Good = require('./goods');
const ImportBatch = require('./import_batch');
const ImportDetail = require('./import_detail');
const Permission = require('./permission');
const Category = require('./category');
const Stockmovement = require('./stockmovement');
const Shift = require('./shift');
const CashDenomination = require('./cashdenomination');

mongoose.Promise = global.Promise;

const db = {
  Account,
  Role,
  Good,
  ImportBatch,
  ImportDetail,
  Permission,
  Category,
  Stockmovement,
  Shift,
  CashDenomination,
};


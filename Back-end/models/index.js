const mongoose = require('mongoose');
require('dotenv').config();

const Account = require('./account');
const Role = require('./role');
const ImportBatch = require('./import_batch');
const ImportDetail = require('./import_detail');
const PriceHistory = require('./price_history');
const Goods = require('./goods');
const Category = require('./category');

mongoose.Promise = global.Promise;

const db = {
  Account,
  Role,
  ImportBatch,
  ImportDetail,
  PriceHistory,
  Goods,
  Category
};
  

db.connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URL;
    console.log(`Connecting to MongoDB at ${mongoURI}`);
    
    await mongoose.connect(mongoURI);
    
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};


module.exports = db;
const mongoose = require('mongoose');
require('dotenv').config();

const Account = require('./account');
const Role = require('./role');
const Bill = require('./bill');
const BillStatus = require('./billStatus');
const BillDetail = require('./billDetail');
mongoose.Promise = global.Promise;

const db = {
  Account,
  Role,
  Bill,
  BillStatus,
  BillDetail
};

db.connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URL;
    
    await mongoose.connect(mongoURI);
    
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};


module.exports = db;
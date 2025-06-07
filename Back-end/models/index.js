const mongoose = require('mongoose');
require('dotenv').config();

const Account = require('./account');
const Role = require('./role');
const Consignment = require('./consignment');
const Price = require('./price');
const Goods = require('./goods');
const Category = require('./category');

mongoose.Promise = global.Promise;

const db = {
  Account,
  Role,
  Consignment,
  Price,
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
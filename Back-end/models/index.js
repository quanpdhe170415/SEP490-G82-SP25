const mongoose = require('mongoose');
require('dotenv').config();

const Account = require('./account');
const Role = require('./role');
const Bill = require('./bill');

mongoose.Promise = global.Promise;

const db = {
  Account,
  Role,
  Bill
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
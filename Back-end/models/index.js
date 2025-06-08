const mongoose = require('mongoose');
const Account = require('./account');
const Role = require('./role');
const UserDetail = require('./userDetail');
const Permission = require('./permission');

mongoose.Promise = global.Promise;

const db = {};
db.Account = Account;
db.Role = Role;
db.UserDetail = UserDetail;
db.Permission = Permission;

module.exports = db;


// db.connectDB = async () => {
//   try {
//     const mongoURI = process.env.MONGODB_URL;
    
//     await mongoose.connect(mongoURI);
    
//   } catch (err) {
//     console.error('Error connecting to MongoDB:', err.message);
//     process.exit(1);
//   }
// };


// filepath: /C:/Users/i-quanpd/Desktop/wdp/WDP301_Group1_SE1761-NJ/back-end/models/Account.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  user_name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role_id: { type: Schema.Types.ObjectId, ref: 'Role' },
  start_working: { type: Date, default: Date.now },
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number },
  isVerified: { type: Boolean, default: false },
});

AccountSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

const Account = mongoose.model('Account', AccountSchema);
module.exports = Account;
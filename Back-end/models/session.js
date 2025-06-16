const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  deviceId: { type: String, required: true },
  deviceType: { type: String, required: true }, // "web", "mobile", ...
  refreshToken: { type: String, required: true },
  isActive: { type: Boolean, default: true }, // Để thu hồi token
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastSyncAt: { type: Date } // Nếu muốn đồng bộ realtime
});

module.exports = mongoose.model('Session', sessionSchema);
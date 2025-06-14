const mongoose = require('mongoose');

const StockMovementSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  goodsId: { type: String, ref: 'Goods', required: true },
  batchId: { type: String, ref: 'ImportBatch' },
  quantity: { type: Number, required: true },
  movedAt: { type: Date, default: Date.now },
  reason: { type: String } // e.g., "Xuất bán"
});

module.exports = mongoose.model('StockMovement', StockMovementSchema);
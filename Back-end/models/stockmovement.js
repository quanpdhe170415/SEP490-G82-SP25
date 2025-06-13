const mongoose = require('mongoose');

const StockMovementSchema = new mongoose.Schema({
  goodsId: { type: String, ref: 'Goods', required: true },
  batch_id: { type: String, ref: 'ImportBatch' },
  quantity: { type: Number, required: true },
  movedAt: { type: Date, default: Date.now },
  reason: { type: String } // e.g., "Xuất bán"
});

module.exports = mongoose.model('StockMovement', StockMovementSchema);
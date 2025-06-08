const mongoose = require('mongoose');

const consignmentSchema = new mongoose.Schema({
  consignmentCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  supplier: { type: String, required: true },
  receivedDate: { type: Date },
  manufactureDate: { type: Date },
  expiryDate: { type: Date },
  productionBatch: { type: String },
  batchNumber: { type: String },
  importCost: { type: Number },
  isActive: { type: Boolean, default: true },
});

const Consignment = mongoose.model('Consignment', consignmentSchema);

module.exports = Consignment;
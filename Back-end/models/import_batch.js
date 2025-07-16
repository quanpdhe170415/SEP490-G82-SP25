const mongoose = require('mongoose');

const ImportBatchSchema = new mongoose.Schema(
  {
    purchase_order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PurchaseOrder',
        required: true
    },
    //Các đợt giao hàng
    delivery_code: {
        type: String,
        required: true,
    },
    import_receipt_number: {
      type: String,
      required: true,
      unique: true,
    },
    import_date: {
      type: Date,
      required: true,
    },
    imported_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    total_value: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const ImportBatch = mongoose.model('ImportBatch', ImportBatchSchema);

module.exports = ImportBatch;
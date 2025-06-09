const mongoose = require('mongoose');

const ImportBatchSchema = new mongoose.Schema({
    import_receipt_number: {
        type: String,
        required: true,
        unique: true
    },
    supplier_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    import_date: {
        type: Date,
        required: true
    },
    imported_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    total_value: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending',
        required: true
    },
    notes: {
        type: String,
        required: false
    },
    conditions_checked:{
        type: Boolean,
        default: false,
        required: true
    }
}, {
    timestamps: true
});

const ImportBatch = mongoose.model('ImportBatch', ImportBatchSchema);

module.exports = ImportBatch;
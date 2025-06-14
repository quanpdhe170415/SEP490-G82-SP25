const mongoose = require('mongoose');
const ImportDetailSchema = new mongoose.Schema({
    import_batch_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ImportBatch',
        required: true
    },
    goods_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goods',
        required: true
    },
    quantity_imported: {
        type: Number,
        required: true
    },
    unit_import_price: {
        type: Number,
        required: true
    },
    total_amount: {
        type: Number,
        required: true
    },
    expiry_date: {
        type: Date,
        required: false
    },
    manufacturing_batch_number: {
        type: String,
        required: false
    },
    manufacturing_date: {
        type: Date,
        required: false
    },
    notes: {
        type: String,
        required: false
    },
    meets_conditions: {
        type: Boolean,
        default: true,
        required: true
    }
});

const ImportDetail = mongoose.model('ImportDetail', ImportDetailSchema);
module.exports = ImportDetail;
const mongoose = require('mongoose');

const ImportDetailSchema = new mongoose.Schema({
    
    import_batch_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ImportBatch',
        required: true
    },
    
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goods',
        required: true
    },
    
    quantity_expected: {
        type: Number,
        required: true
    },

    quantity_received: {
        type: Number,
        required: true
    },
    //thông tin về sự cố
    discrepancy_type: {
        type: String,
        enum: ['none', 'shortage', 'overage', 'damage'],
        default: 'none'
    },
    discrepancy_notes: {
        type: String
    },
    
    //thông tin về lô và hạn của sản phẩm
    expiry_date: {
        type: Date,
        required: false
    },
    lot_number: { 
        type: String,
        required: false
    },
    manufacturing_date: {
        type: Date,
        required: false
    },

});

const ImportDetail = mongoose.model('ImportDetail', ImportDetailSchema);
module.exports = ImportDetail;
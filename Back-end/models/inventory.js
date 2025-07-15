const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    goods_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goods',
        required: true,
    },
    // nhập từ lô hàng nào
    import_batch_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ImportBatch',
        required: true,
    },
    //số lượng còn lại trong lô hàng đang nhập
    quantity_remain: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    manufacturing_batch_number: {
        type: String,
        required: false
    },
    expiry_date: {
        type: Date,
        required: false
    },

}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
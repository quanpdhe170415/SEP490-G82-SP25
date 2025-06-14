const mongoose = require('mongoose');

const PriceHistorySchema = new mongoose.Schema({
    goods_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goods',
        required: true
    },
    batch_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ImportBatch',
        required: true
    },
    supplier_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    import_price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    import_date: {
        type: Date,
        required: true
    },
    previous_average_price: {
        type: Number,
        required: true
    },
    new_average_price: {
        type: Number,
        required: true
    },
}, {
    timestamps: true                                       
});

const PriceHistory = mongoose.model('PriceHistory', PriceHistorySchema);

module.exports = PriceHistory;
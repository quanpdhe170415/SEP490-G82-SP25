const mongoose = require('mongoose');

const DisposalItemSchema = new mongoose.Schema({
    goods_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goods',
        required: true,
    },
    product_name: {
        type: String,
        required: true,
    },
    batch_number: {
        type: String,
        required: true,
    },
    unit_of_measure: {
        type: String, // Ví dụ: "lon", "thùng", "gói"
        required: true,
    },
    quantity_disposed: {
        type: Number,
        required: true,
        min: 1,
    },
    cost_price: {
        type: Number,
        required: true,
        min: 0,
    },
    item_disposal_reason: {
        type: String,
        required: true,
    },
    item_images: [String], // Hình ảnh chứng minh lý do huỷ
    import_batch_number: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ImportBatch',
        required: true
    },
    import_detail_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ImportDetail',
        required: true
    },
}, { timestamps: true });


const  DisposalItem = mongoose.model('DisposalItem', DisposalItemSchema);
module.exports = DisposalItem;
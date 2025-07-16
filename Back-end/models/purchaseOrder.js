const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
    order_number: {
        type: String,
        required: true,
        unique: true
    },
    supplier_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    items: [{
        goods_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Goods',
            required: true
        },
        // Số lượng đặt hàng theo PO
        quantity_order: {
            type: Number,
            required: true
        },
        unit_price: {
            type: Number,
            required: true
        }
    }],
    total_price: {
        type: Number,
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },

    receiving_status: {
        type: String,
        enum: ['pending_receipt', 'partially_received', 'fully_received', 'over_received', 'completed'],
        default: 'pending_receipt'
    },

    expected_delivery_date: {
        type: Date,
        required: true
    },
    is_pinned: {
        type: Boolean,
        default: false
    },
    total_expected_batches: { 
        type: Number,
        required: true,
        default: 1
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
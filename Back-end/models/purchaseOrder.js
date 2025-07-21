const mongoose = require('mongoose');

const PurchaseOrderSchema = new mongoose.Schema({
    po_code: {
        type: String,
        required: true,
        unique: true
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },

    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Goods',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        unit_price: {
            type: Number,
            required: true
        }
    }],
    total_amount: {
        type: Number,
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    // Trạng thái của chính PO này, không phải trạng thái nhận hàng
    status: {
        type: String,
        enum: ['draft', 'approved', 'completed', 'cancelled'],
        default: 'draft'
    }
}, { timestamps: true });

const PurchaseOrder = mongoose.model('PurchaseOrder', PurchaseOrderSchema);

module.exports = PurchaseOrder;
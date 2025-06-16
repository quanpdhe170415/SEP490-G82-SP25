const mongoose = require('mongoose');

const GoodsDisposalSchema = new mongoose.Schema({
    disposal_number: {
        type: String,
        required: true,
        unique: true,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    disposal_date: {
        type: Date,
        required: true,
    },
    reason_for_disposal: {
        type: String,
        required: true,
    },
    disposal_items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DisposalItem',
        required: true,
    }],
    total_disposal_value: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'completed', 'cancelled'],
        default: 'pending',
        required: true,
    },
    approved_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account', // Quản lý phê duyệt
        required: false,
    },
    confirmed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account', // Người phụ trách xác nhận hủy
        required: false,
    },
    notes: String,
}, { timestamps: true });



const GoodsDisposal = mongoose.model('GoodsDisposal', GoodsDisposalSchema);
module.exports = GoodsDisposal;
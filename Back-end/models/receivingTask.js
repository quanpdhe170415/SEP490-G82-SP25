const mongoose = require('mongoose');

const ReceivingTaskSchema = new mongoose.Schema({
    task_code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PurchaseOrder',
        required: true
    },
    
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    expected_items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Goods',
            required: true
        },
        quantity_expected: {
            type: Number,
            required: true
        }
    }],
    expected_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'issue', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

const ReceivingTask = mongoose.model('ReceivingTask', ReceivingTaskSchema);

module.exports = ReceivingTask;
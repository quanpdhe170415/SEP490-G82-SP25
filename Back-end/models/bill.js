const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BillSchema = new Schema({
    bill_id: { type: String, required: true, unique: true },
    total_amount: { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: ['cash', 'transfer'],
        default: 'cash'
    },
    payment_status: {
        type: String,
        enum: ['paid', 'unpaid', 'pending'],
        default: 'unpaid'
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Bill = mongoose.model('Bill', BillSchema);
module.exports = Bill;
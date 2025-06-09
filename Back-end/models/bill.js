const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BillSchema = new Schema({
    bill_detail_id: { type: Schema.Types.ObjectId, ref: 'BillDetail', required: true },
    total_amount: { type: Number, required: true },
    payment_method: {
        type: String,
        enum: ['cash', 'transfer'],
        default: 'cash'
    },
    payment_status: {
        type: String,
        enum: ['paid', 'unpaid', 'pending'],
        default: 'unpaid'
    }
},{
    timestamps: true
});

const Bill = mongoose.model('Bill', BillSchema);
module.exports = Bill;
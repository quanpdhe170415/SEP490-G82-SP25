const mongoose = require('mongoose');

const exportRequestSchema = new mongoose.Schema({
    goods: [
        {
            goods_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Goods', required: true },
            quantity: { type: Number, required: true },
            unit_of_measure: { type: String, required: true }
        }
    ],
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }, // Thu ngân
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    note: { type: String },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExportRequest', exportRequestSchema);
const mongoose = require('mongoose');

const ImportBatchSchema = new mongoose.Schema({

    receiving_task_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReceivingTask',
        required: true
    },
    
    receipt_code: { 
        type: String,
        required: true,
        unique: true,
    },
    
    receipt_date: {
        type: Date,
        required: true,
        default: Date.now,
    },
   
    received_by: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account", 
        required: true,
    },
    notes: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

const ImportBatch = mongoose.model('ImportBatch', ImportBatchSchema);
module.exports = ImportBatch;
const mongoose = require('mongoose');


const supplierSchema = new mongoose.Schema({
    suplier_name: {
        type: String,
        required: true
    },
    tax_number: {
        type: String,
        required: true,
        unique: true
    },
    contact_person: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        trim: true
    },
    phone_number: {
        type: String,
        required: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Supplier', supplierSchema);
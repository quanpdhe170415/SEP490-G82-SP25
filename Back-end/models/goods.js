const mongoose = require('mongoose');

const goodsSchema = new mongoose.Schema({
    goods_name: {
        type: String,
        required: true
    }, 
    barcode: {
        type: String,
        required: true,
        unique: true
    },
    unit_of_measure: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    category_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    },
    selling_price: {
        type: Number,
        required: true
    },
    average_import_price: {
        type: Number,
        required: true
    },
    last_import_price: {
        type: Number,
        required: true
    },
    last_import_date:{
        type: Date,
        required: true
    },
    stock_quantity: {
        type: Number,     
    },
    selling_price: {
        type: Number,
        
    },
    average_import_price: {
        type: Number,
        
    },
    last_import_price: {
        type: Number,
        
    },
    last_import_date:{
        type: Date,
       
    },
    stock_quantity: {
        type: Number,
       
        default: 0
    },
    display_quantity: {
        type: Number,
    },
    minimum_stock_quantity: {
        type: Number,
        required: true,
        default: 0
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true
    },
},{
    timestamps: true,
});

const Goods = mongoose.model('Goods', goodsSchema);

module.exports = Goods;
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
        
    },
    description: {
        type: String,
        
    },
    category_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        
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
        
        default: 0
    },
    minimum_stock_quantity: {
        type: Number,
        
        default: 0
    },
    is_active: {
        type: Boolean,
        required: true,
        default: false
    },
},{
    timestamps: true,
});

const Goods = mongoose.model('Goods', goodsSchema);

module.exports = Goods;
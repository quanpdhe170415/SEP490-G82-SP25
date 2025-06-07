const mongoose = require('mongoose');

const goodsSchema = new mongoose.Schema({
    barcode: { type: String, unique: true, required: true },      // Mã định danh barcode
    productCode: { type: String, required: true },                       // Mã hàng hóa 
    name: { type: String, required: true },
    description: { type: String },
    physicalAtributes: {
        weight: { type: Number },
        //thêm các thuộc tính mở rộng khác nếu cần                            
    },
    consignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consignment'
    }, 
    unit: { type: String },                                      
    price: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Price'
    },                                                  // Giá thành (tham chiếu bảng giá)
    status: {
        type: String, enum: ['in_stock', 'out_of_stock', 'low_stock'],
        default: 'in_stock'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category'
    }
});

const Goods = mongoose.model('Goods', goodsSchema);

module.exports = Goods;
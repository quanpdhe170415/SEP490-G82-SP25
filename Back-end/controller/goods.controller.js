const Goods = require('../models/goods');

// Searching function
exports.searchGoods = async (req, res) => {
    const { searchQuery } = req.body;

    if (!searchQuery) {
        return res.status(400).json({ message: 'Vui lòng cung cấp từ khóa tìm kiếm.' });
    }

    try {
        // Tìm kiếm đồng thời trên goods_name và barcode
        const goods = await Goods.find({
            $or: [
                { goods_name: { $regex: searchQuery, $options: 'i' } },
                { barcode: { $regex: searchQuery, $options: 'i' } }
            ]
        }).populate('category_id');

        if (goods.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy hàng hóa phù hợp.' });
        }

        // Lọc ra những thông tin cần thiết
        const filteredGoods = goods.map(item => ({
            barcode: item.barcode,
            goods_name: item.goods_name,
            description: item.description,
            unit_of_measure: item.unit_of_measure,
            selling_price: item.selling_price,
            average_import_price: item.average_import_price,
            last_import_price: item.last_import_price,
            stock_quantity: item.stock_quantity,
            minimum_stock_quantity: item.minimum_stock_quantity,
            is_active: item.is_active,
            category: item.category_id ? item.category_id.name : null
        }));

        res.status(200).json(filteredGoods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Lỗi khi tìm kiếm hàng hóa. ${error.message}` });
    }
};

// Lọc theo danh mục
exports.filterByCategory = async (req, res) => {
    const { categoryId } = req.body;

    try {
        const goods = await Goods.find({
            category_id: categoryId
        }).populate('category_id', 'name');

        if (goods.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy hàng hóa trong danh mục này.' });
        }

        const filteredGoods = goods.map(item => ({
            barcode: item.barcode,
            goods_name: item.goods_name,
            description: item.description,
            unit_of_measure: item.unit_of_measure,
            selling_price: item.selling_price,
            average_import_price: item.average_import_price,
            last_import_price: item.last_import_price,
            stock_quantity: item.stock_quantity,
            minimum_stock_quantity: item.minimum_stock_quantity,
            is_active: item.is_active,
            category: item.category_id ? item.category_id.name : null 
        }));
        
        res.status(200).json(filteredGoods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lọc hàng hóa theo danh mục.' });
    }
}

// Lọc theo trạng thái hoạt động
exports.filterByStatus = async (req, res) => {
    const { is_active } = req.body;

    try {
        const goods = await Goods.find({ is_active })
            .populate('category_id', 'name');

        if (goods.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy hàng hóa với trạng thái này.' });
        }

        const filteredGoods = goods.map(item => ({
            barcode: item.barcode,
            goods_name: item.goods_name,
            description: item.description,
            unit_of_measure: item.unit_of_measure,
            selling_price: item.selling_price,
            average_import_price: item.average_import_price,
            last_import_price: item.last_import_price,
            stock_quantity: item.stock_quantity,
            minimum_stock_quantity: item.minimum_stock_quantity,
            is_active: item.is_active,
            category: item.category_id ? item.category_id.name : null 
        }));
        
        res.status(200).json(filteredGoods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lọc hàng hóa theo trạng thái.' });
    }
}

// Lọc theo khoảng giá bán
exports.filterGoodsByPriceRange = async (req, res) => {
    let { minPrice, maxPrice } = req.body;
    minPrice = parseFloat(minPrice);
    maxPrice = parseFloat(maxPrice);

    // Validate minPrice and maxPrice
    if (typeof minPrice !== 'number' || typeof maxPrice !== 'number' || minPrice < 0 || maxPrice < 0 || minPrice > maxPrice) {
        return res.status(400).json({ message: 'Giá trị minPrice và maxPrice không hợp lệ.' });
    }

    try {
        const goods = await Goods.find({
            selling_price: {
                $gte: minPrice,
                $lte: maxPrice
            }
        }).populate('category_id', 'name');

        if (goods.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy mặt hàng trong khoảng giá này.' });
        }

        const filteredGoods = goods.map(item => ({
            barcode: item.barcode,
            goods_name: item.goods_name,
            description: item.description,
            unit_of_measure: item.unit_of_measure,
            selling_price: item.selling_price,
            average_import_price: item.average_import_price,
            last_import_price: item.last_import_price,
            stock_quantity: item.stock_quantity,
            minimum_stock_quantity: item.minimum_stock_quantity,
            is_active: item.is_active,
            category: item.category_id ? item.category_id.name : null
        }));

        res.status(200).json(filteredGoods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Lỗi khi lọc hàng hóa theo khoảng giá: ${error.message}` });
    }
}


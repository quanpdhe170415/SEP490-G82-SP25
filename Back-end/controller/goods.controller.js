const Goods = require('../models/goods');

// Searching function
exports.searchGoods = async (req, res) => {
    const { searchQuery } = req.body;

    if (!searchQuery) {
        return res.status(400).json({ message: 'Vui lòng cung cấp từ khóa tìm kiếm.' });
    }

    try {
        // Tìm kiếm đồng thời trên name, barcode và productCode
        const goods = await Goods.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { barcode: { $regex: searchQuery, $options: 'i' } },
                { productCode: { $regex: searchQuery, $options: 'i' } }
            ]
        }).populate('category').populate('price').populate('consignment');

        if (goods.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy hàng hóa phù hợp.' });
        }

        // Lọc ra những thông tin cần thiết
        const filteredGoods = goods.map(item => ({
            barcode: item.barcode,
            productCode: item.productCode,
            name: item.name,
            description: item.description,
            image: item.image,
            physicalAtributes: item.physicalAtributes,
            unit: item.unit,
            retailPrice: item.price?.retailPrice,
            status: item.status,
            category: item.category ? item.category.name : null
        }));

        res.status(200).json(filteredGoods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Lỗi khi tìm kiếm hàng hóa. ${error.message}` });
    }
};


//Filter goods

// Lọc theo danh mục
exports.filterByCategory = async (req, res) => {
    const { categoryId } = req.body;

    try {
        const goods = await Goods.find({
            category: categoryId
        })
            .populate('category', 'name')
            .populate('price')
            .populate('consignment');

        if (goods.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy hàng hóa trong danh mục này.' });
        }

        const filteredGoods = goods.map(item => ({
            barcode: item.barcode,
            productCode: item.productCode,
            name: item.name,
            description: item.description,
            image: item.image,
            physicalAtributes: item.physicalAtributes,
            unit: item.unit,
            price: item.price?.retailPrice, 
            status: item.status,
            category: item.category ? item.category.name : null 
        }));
        res.status(200).json(filteredGoods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lọc hàng hóa theo danh mục.' });
    }
}

// Lọc theo trạng thái
exports.filterByStatus = async (req, res) => {
    const { status } = req.body;


    try {
        const goods = await Goods.find({ status })
            .populate('category', 'name')
            .populate('price')
            .populate('consignment')

        if (goods.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy hàng hóa với trạng thái này.' });
        }

        const filteredGoods = goods.map(item => ({
            barcode: item.barcode,
            productCode: item.productCode,
            name: item.name,
            description: item.description,
            image: item.image,
            physicalAtributes: item.physicalAtributes,
            unit: item.unit,
            price: item.price?.retailPrice, 
            status: item.status,
            category: item.category ? item.category.name : null 
        }));
        res.status(200).json(filteredGoods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lọc hàng hóa theo trạng thái.' });
    }
}

// Lọc theo khoảng giá
exports.filterGoodsByPriceRange = async (req, res) => {
    let { minPrice, maxPrice } = req.body;
    minPrice = parseFloat(minPrice);
    maxPrice = parseFloat(maxPrice);

    // Validate minPrice and maxPrice
    if (typeof minPrice !== 'number' || typeof maxPrice !== 'number' || minPrice < 0 || maxPrice < 0 || minPrice > maxPrice) {
        return res.status(400).json({ message: 'Giá trị minPrice và maxPrice không hợp lệ.' });
    }

    try {
        const pipeline = [
            {
                $lookup: {
                    from: 'prices',
                    localField: 'price',
                    foreignField: '_id',
                    as: 'priceInfo'
                }
            },
            {
                $match: {
                    'priceInfo.retailPrice': {
                        $gte: minPrice,
                        $lte: maxPrice
                    }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            {
                $lookup: {
                    from: 'consignments',
                    localField: 'consignment',
                    foreignField: '_id',
                    as: 'consignmentInfo'
                }
            }
        ];

        const goods = await Goods.aggregate(pipeline);

        if (goods.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy mặt hàng trong khoảng giá này.' });
        }

        // Format dữ liệu cho aggregate result
        const filteredGoods = goods.map(item => ({
            barcode: item.barcode,
            productCode: item.productCode,
            name: item.name,
            description: item.description,
            image: item.image,
            physicalAtributes: item.physicalAtributes,
            unit: item.unit,
            retailPrice: item.priceInfo[0]?.retailPrice,
            status: item.status,
            category: item.categoryInfo[0]?.name || null
        }));

        res.status(200).json(filteredGoods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Lỗi khi lọc hàng hóa theo khoảng giá: ${error.message}` });
    }
}


const Goods = require('../models/goods');
const ImportDetail = require('../models/import_detail');
const StockMovement = require('../models/stockmovement');
const ImportBatch = require('../models/import_batch');

exports.getProductsForRetail = async (req, res) => {
  try {
    // Lấy tất cả sản phẩm active và populate category
    const products = await Goods.find({ is_active: true })
      .populate('category_id', 'category_name')
      .lean();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm nào!' });
    }

    // Tính total_stock cho mỗi sản phẩm và trả về đúng format
    const productsWithStock = await Promise.all(products.map(async (product) => {
      // Lấy import details liên quan
      const importDetails = await ImportDetail.find({ goods_id: product._id });
      // Lấy stock movements liên quan
      const stockMovements = await StockMovement.find({ goods_id: product._id });

      // Tính total_stock: (Tổng nhập - Tổng xuất)
      const totalImported = importDetails.reduce((sum, detail) => sum + detail.quantity_imported, 0);
      const totalSold = stockMovements.reduce((sum, movement) => sum + movement.quantity, 0);
      const totalStock = totalImported - totalSold;

      return {
        id: product._id,
        name: product.goods_name,
        price: product.selling_price,
        image: product.image_url,
        type: product.category_id ? product.category_id.category_name : null,
        total_stock: totalStock >= 0 ? totalStock : 0 // Nếu bạn vẫn muốn trả về tồn kho
      };
    }));

    // Nếu chỉ muốn trả về đúng format, bỏ total_stock khỏi object trả về
    const result = productsWithStock.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      type: p.type
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi máy chủ');
  }
};
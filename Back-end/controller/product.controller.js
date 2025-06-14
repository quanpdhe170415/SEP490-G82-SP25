const Goods = require('../models/goods');
const ImportDetail = require('../models/import_detail');
const StockMovement = require('../models/stockmovement');
const ImportBatch = require('../models/import_batch');

exports.getProductsForRetail = async (req, res) => {
  try {
    // Lấy tất cả sản phẩm active và populate category
    const products = await Goods.find({ is_active: true })
      .populate('category_id', 'category_name') // Chỉ lấy category_name từ Category
      .lean();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm nào!' });
    }

    // Tính total_stock cho mỗi sản phẩm
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
        goods_name: product.goods_name,
        barcode: product.barcode,
        unit_of_measure: product.unit_of_measure,
        categoryId: product.categoryId ? product.categoryId.category_name : null, // Lấy category_name từ populate
        selling_price: product.selling_price,
        total_stock: totalStock >= 0 ? totalStock : 0 // Đảm bảo total_stock không âm
      };
    }));

    res.status(200).json(productsWithStock);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi máy chủ');
  }
};
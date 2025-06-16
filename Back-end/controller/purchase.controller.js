const Purchase = require("../models");
const PurchaseItem = require("../models");
const Goods = require("../models");

// Lấy danh sách phiếu nhập
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .select(
        "purchaseNumber createdAt supplierId supplierName totalAmount status"
      )
      .lean();

    res.status(200).json({
      success: true,
      data: purchases,
    });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách phiếu nhập",
    });
  }
};

// Lấy chi tiết phiếu nhập
exports.getPurchaseDetails = async (req, res) => {
  try {
    const purchaseId = req.params.id;

    // Kiểm tra phiếu nhập tồn tại
    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phiếu nhập",
      });
    }

    // Lấy danh sách mặt hàng
    const items = await PurchaseItem.find({ purchaseId })
      .select("goodsId goodsName quantity unitPrice totalAmount")
      .lean();

    // Chuyển đổi goodsId thành đối tượng để khớp với frontend
    const formattedItems = items.map((item) => ({
      _id: item._id,
      goods_id: { _id: item.goodsId },
      goods_name: item.goodsName,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_amount: item.totalAmount,
    }));

    res.status(200).json({
      success: true,
      data: formattedItems,
    });
  } catch (error) {
    console.error("Error fetching purchase details:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết phiếu nhập",
    });
  }
};
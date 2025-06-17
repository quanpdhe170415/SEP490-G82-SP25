const {ImportBatch} = require("../models");
const {ImportDetail} = require("../models");

// Lấy danh sách phiếu nhập
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await ImportBatch.find()
      .select("import_receipt_number import_date supplier total_value status")
      .lean();

    // Ánh xạ status để khớp với frontend
    const formattedPurchases = purchases.map((purchase) => ({
      _id: purchase._id,
      purchaseNumber: purchase.import_receipt_number,
      createdAt: purchase.import_date,
      supplierName: purchase.supplier,
      totalAmount: purchase.total_value,
      status: purchase.status === "completed" ? "received" : purchase.status,
    }));

    res.status(200).json({
      success: true,
      data: formattedPurchases,
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
    const purchase = await ImportBatch.findById(purchaseId);
    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phiếu nhập",
      });
    }

    // Lấy danh sách mặt hàng
    const items = await ImportDetail.find({ import_batch_id: purchaseId })
      .select("goods_id quantity_imported unit_import_price total_amount expiry_date manufacturing_batch_number manufacturing_date ")
      .populate("goods_id", "goods_name barcode")
      .lean();

    // Chuyển đổi để khớp với frontend
    const formattedItems = items.map((item) => ({
      _id: item._id,
      goods_id: { _id: item.goods_id._id },
      goods_name: item.goods_id.goods_name,
      barcode: item.goods_id.barcode,
      quantity: item.quantity_imported,
      unit_price: item.unit_import_price,
      total_amount: item.total_amount,
      expiry_date: item.expiry_date,
      manufacturing_batch_number: item.manufacturing_batch_number,
      manufacturing_date: item.manufacturing_date,
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

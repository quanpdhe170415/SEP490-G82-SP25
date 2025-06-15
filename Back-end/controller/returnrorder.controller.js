
const { Bill } = require("../models");
const { BillDetail } = require("../models");
const { ReturnOrder } = require("../models");
const { ReturnDetail } = require("../models");
const { Goods } = require("../models");
exports.createReturnOrder = async (req, res) => {
  try {
    const { bill_id, return_reason, items, created_by } = req.body;

    if (!bill_id || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Thiếu dữ liệu hóa đơn hoặc danh sách hàng trả." });
    }

    const total_refund = items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );

    const returnOrder = await ReturnOrder.create({
      bill_id,
      return_reason,
      total_refund,
      created_by,
    });

    const returnDetails = items.map((item) => ({
      return_order_id: returnOrder._id,
      goods_id: item.goods_id,
      goods_name: item.goods_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_refund: item.quantity * item.unit_price,
    }));

    await ReturnDetail.insertMany(returnDetails);

    for (const item of items) {
      await Goods.findByIdAndUpdate(item.goods_id, {
        $inc: { stock_quantity: item.quantity },
      });
    }

    await Bill.findByIdAndUpdate(
      bill_id,
      { statusId: "684e681169eef140a496f7cb" } // Đã trả hàng
    );

    res.status(201).json({ message: "Trả hàng thành công" });
  } catch (err) {
    console.error("Lỗi khi trả hàng:", err);
    res
      .status(500)
      .json({ message: "Lỗi khi trả hàng", error: err.message || err });
  }
};

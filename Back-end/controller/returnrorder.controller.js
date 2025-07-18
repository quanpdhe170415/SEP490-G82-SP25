const { Bill } = require("../models");
const { BillDetail } = require("../models");
const { ReturnOrder } = require("../models");
const { ReturnDetail } = require("../models");
const { Goods } = require("../models");
const { Shift } = require("../models");
const { Status } = require("../models");

// Lấy danh sách hóa đơn theo thời gian/ca làm việc cho return order
exports.getBillsForReturn = async (req, res) => {
  try {
    const { shift_id, date_filter, time_slot } = req.query;

    let query = {};

    // Nếu có shift_id, lọc theo ca làm việc
    if (shift_id) {
      query.shift_id = shift_id;
    }

    // Nếu có date_filter, lọc theo ngày (24 giờ gần đây)
    if (date_filter === "24h") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      query.createdAt = { $gte: yesterday };
    }

    // Lọc theo time slot nếu có
    if (time_slot && time_slot !== "all") {
      const [startHour, endHour] = time_slot.split("-").map((h) => parseInt(h));
      const today = new Date();
      const startTime = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        startHour,
        0,
        0
      );
      const endTime = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        endHour,
        0,
        0
      );

      query.createdAt = {
        ...query.createdAt,
        $gte: startTime,
        $lt: endTime,
      };
    }

    // Chỉ lấy hóa đơn đã hoàn thành và chưa bị trả hàng
    const completedStatus = await Status.findOne({ name: "Đã thanh toán" });
    if (completedStatus) {
      query.statusId = completedStatus._id;
    }

    // Loại bỏ các bill đã được return
    query.has_been_returned = false;

    const bills = await Bill.find(query)
      .populate("statusId", "name")
      .populate("shift_id", "account_id")
      .select("billNumber totalAmount finalAmount createdAt statusId")
      .sort({ createdAt: -1 })
      .limit(50);

    // Format data để match với frontend
    const formattedBills = bills.map((bill) => ({
      id: bill.billNumber,
      date: bill.createdAt.toISOString().replace("T", " ").substring(0, 19),
      totalAmount: bill.finalAmount,
      _id: bill._id,
      billNumber: bill.billNumber,
    }));

    res.status(200).json({
      success: true,
      data: formattedBills,
    });
  } catch (error) {
    console.error("Error fetching bills for return:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách hóa đơn",
      error: error.message,
    });
  }
};

// Lấy chi tiết hóa đơn và sản phẩm có thể trả
exports.getBillDetailsForReturn = async (req, res) => {
  try {
    const { bill_id } = req.params;

    // Lấy thông tin hóa đơn
    const bill = await Bill.findById(bill_id)
      .populate("statusId", "name")
      .populate("shift_id", "account_id");

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hóa đơn",
      });
    }

    // Lấy chi tiết sản phẩm trong hóa đơn
    const billDetails = await BillDetail.find({ bill_id: bill_id })
      .populate("goods_id", "goods_name barcode selling_price")
      .select("goods_id goods_name quantity unit_price total_amount");

    if (!billDetails || billDetails.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi tiết hóa đơn",
      });
    }

    // Format data để match với frontend
    const items = billDetails.map((detail) => ({
      name: detail.goods_name || detail.goods_id.goods_name,
      quantity: detail.quantity,
      price: detail.unit_price,
      goods_id: detail.goods_id._id,
      goods_name: detail.goods_name || detail.goods_id.goods_name,
      total_amount: detail.total_amount,
    }));

    const orderData = {
      id: bill.billNumber,
      date: bill.createdAt.toISOString().replace("T", " ").substring(0, 19),
      totalAmount: bill.finalAmount,
      items: items,
      _id: bill._id,
    };

    res.status(200).json({
      success: true,
      data: orderData,
    });
  } catch (error) {
    console.error("Error fetching bill details for return:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết hóa đơn",
      error: error.message,
    });
  }
};

// Cập nhật API tạo return order
exports.createReturnOrder = async (req, res) => {
  try {
    const { bill_id, return_reason, items, created_by } = req.body;

    if (!bill_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Thiếu dữ liệu hóa đơn hoặc danh sách hàng trả.",
      });
    }

    // Kiểm tra bill đã được return trước đó chưa
    const existingBill = await Bill.findById(bill_id);
    if (!existingBill) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hóa đơn",
      });
    }

    if (existingBill.has_been_returned) {
      return res.status(400).json({
        success: false,
        message:
          "Hóa đơn này đã được trả hàng trước đó. Mỗi hóa đơn chỉ cho phép trả hàng một lần.",
      });
    }

    // Validate each item
    for (const item of items) {
      if (!item.goods_id || !item.quantity || !item.unit_price) {
        return res.status(400).json({
          success: false,
          message: "Thông tin sản phẩm không đầy đủ",
        });
      }
    }

    const total_refund = items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );

    // Tạo return order
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

    // Cập nhật lại số lượng tồn kho
    for (const item of items) {
      await Goods.findByIdAndUpdate(item.goods_id, {
        $inc: { stock_quantity: item.quantity },
      });
    }

    // Cập nhật BillDetail - giảm quantity hoặc xóa item
    let isFullReturn = true;
    const originalBillDetails = await BillDetail.find({ bill_id: bill_id });

    for (const returnItem of items) {
      const billDetail = await BillDetail.findOne({
        bill_id: bill_id,
        goods_id: returnItem.goods_id,
      });

      if (billDetail) {
        const newQuantity = billDetail.quantity - returnItem.quantity;

        if (newQuantity <= 0) {
          // Xóa item khỏi bill detail nếu return hết
          await BillDetail.findByIdAndDelete(billDetail._id);
        } else {
          // Cập nhật quantity và total_amount
          await BillDetail.findByIdAndUpdate(billDetail._id, {
            quantity: newQuantity,
            total_amount: newQuantity * billDetail.unit_price,
          });
          isFullReturn = false; // Còn sản phẩm chưa return hết
        }
      }
    }

    // Kiểm tra còn sản phẩm nào trong bill không
    const remainingBillDetails = await BillDetail.find({ bill_id: bill_id });
    if (remainingBillDetails.length > 0) {
      isFullReturn = false;
    }

    // Cập nhật bill amount và status
    const newFinalAmount = existingBill.finalAmount - total_refund;
    const originalAmount =
      existingBill.originalAmount || existingBill.finalAmount;

    let newStatus;
    if (isFullReturn) {
      newStatus = await Status.findOne({ name: "Đã trả hàng" });
    } else {
      newStatus = await Status.findOne({ name: "Đã trả hàng một phần" });
    }

    await Bill.findByIdAndUpdate(bill_id, {
      finalAmount: Math.max(0, newFinalAmount), // Đảm bảo không âm
      originalAmount: originalAmount, // Lưu số tiền gốc nếu chưa có
      statusId: newStatus ? newStatus._id : existingBill.statusId,
      has_been_returned: true, // Đánh dấu đã return
    });

    res.status(201).json({
      success: true,
      message: "Trả hàng thành công",
      data: {
        return_order_id: returnOrder._id,
        total_refund: total_refund,
        is_full_return: isFullReturn,
        new_bill_amount: Math.max(0, newFinalAmount),
      },
    });
  } catch (err) {
    console.error("Lỗi khi trả hàng:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi khi trả hàng",
      error: err.message || err,
    });
  }
};

// Lấy danh sách return orders đã tạo
exports.getReturnOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, date_filter } = req.query;

    let query = {};

    // Lọc theo ngày nếu có
    if (date_filter === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      query.createdAt = {
        $gte: today,
        $lt: tomorrow,
      };
    } else if (date_filter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query.createdAt = { $gte: weekAgo };
    }

    const returnOrders = await ReturnOrder.find(query)
      .populate({
        path: "bill_id",
        select: "billNumber createdAt finalAmount",
        populate: {
          path: "statusId",
          select: "name",
        },
      })
      .select("return_reason total_refund created_by createdAt")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ReturnOrder.countDocuments(query);

    // Format data
    const formattedReturnOrders = returnOrders.map((order) => ({
      _id: order._id,
      bill_number: order.bill_id.billNumber,
      return_reason: order.return_reason,
      total_refund: order.total_refund,
      created_by: order.created_by,
      created_at: order.createdAt,
      bill_date: order.bill_id.createdAt,
      original_amount: order.bill_id.finalAmount,
    }));

    res.status(200).json({
      success: true,
      data: formattedReturnOrders,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_records: total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching return orders:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách trả hàng",
      error: error.message,
    });
  }
};

// Lấy chi tiết return order
exports.getReturnOrderDetails = async (req, res) => {
  try {
    const { return_order_id } = req.params;

    const returnOrder = await ReturnOrder.findById(return_order_id).populate({
      path: "bill_id",
      select: "billNumber createdAt finalAmount",
      populate: {
        path: "statusId",
        select: "name",
      },
    });

    if (!returnOrder) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn trả hàng",
      });
    }

    const returnDetails = await ReturnDetail.find({
      return_order_id: return_order_id,
    })
      .populate("goods_id", "goods_name barcode selling_price")
      .select("goods_id goods_name quantity unit_price total_refund");

    const formattedDetails = returnDetails.map((detail) => ({
      goods_name: detail.goods_name,
      quantity: detail.quantity,
      unit_price: detail.unit_price,
      total_refund: detail.total_refund,
      barcode: detail.goods_id.barcode,
    }));

    res.status(200).json({
      success: true,
      data: {
        return_order: {
          _id: returnOrder._id,
          bill_number: returnOrder.bill_id.billNumber,
          return_reason: returnOrder.return_reason,
          total_refund: returnOrder.total_refund,
          created_by: returnOrder.created_by,
          created_at: returnOrder.createdAt,
          bill_date: returnOrder.bill_id.createdAt,
          original_amount: returnOrder.bill_id.finalAmount,
        },
        return_items: formattedDetails,
      },
    });
  } catch (error) {
    console.error("Error fetching return order details:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết trả hàng",
      error: error.message,
    });
  }
};


const {Bill} = require('../models');
const { BillDetail } = require("../models");
const { UserDetail } = require("../models");

const { Status } = require("../models");
const { Shift } = require("../models");
const { Goods } = require("../models");
const { Account } = require("../models");

//Check bill status for Bank Transfer payment
exports.isBillPaid = async (req, res) => {
    try {
        const { bill_id } = req.body;

        if (!bill_id) {
            return res.status(400).json({
                success: false,
                message: 'Bill ID is required'
            });
        }

        const bill = await Bill.findOne({ 
            _id: bill_id,
            payment_method: 'transfer' 
        });
        
        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found or not a Bank Transfer payment'
            });
        }

        const isPaid = bill.payment_status === 'paid';

        return res.status(200).json({
            success: true,
            bill_id: bill._id,
            is_paid: isPaid
        });

    } catch (error) {
        console.error('Error checking if bill is paid:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

exports.createBill = async (req, res) => {
  try {
    const {
      items, // [{ productId, quantity, price, discount, discountType }]
      cashier, // userId
      paymentMethod,
      shift_id,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Danh sách sản phẩm không hợp lệ" });
    }
    if (!cashier) {
      return res.status(400).json({ error: "Thiếu thông tin thu ngân" });
    }
    if (!shift_id) {
      shift_id = "6850a3a83310a456cb629450"; // Nếu không có shift_id, có thể để null
    }

    // Lấy tên thu ngân
    const account = await Account.findById(cashier);
    const seller = account ? account.full_name || account.username : "Không rõ";

    // Tính tổng tiền
    let totalAmount = 0;
    for (const item of items) {
      let finalPrice = item.price;
      if (item.discountType === "VND") {
        finalPrice -= item.discount || 0;
      } else if (item.discountType === "%") {
        finalPrice -= (item.price * (item.discount || 0)) / 100;
      }
      totalAmount += finalPrice * item.quantity;
    }

    // Tạo billNumber tự động (ví dụ: theo timestamp)
    const billNumber = "HD" + Date.now();

    // Lấy statusId cho "Đã thanh toán"
    const status = await Status.findOne({ name: "Đã thanh toán" });
    const statusId = "68508c242bc4aadea688b7f5";

    // Tạo bill mới
    const bill = new Bill({
      billNumber,
      seller,
      totalAmount,
      finalAmount: totalAmount,
      paymentMethod,
      statusId,
      shift_id,
    });
    await bill.save();

    // Lưu chi tiết hóa đơn
    for (const item of items) {
      // Lấy tên sản phẩm từ DB nếu chưa có
      let goodsName = item.name;
      if (!goodsName) {
        const goods = await Goods.findById(item.productId);
        goodsName = goods ? goods.goods_name : "";
      }
      await BillDetail.create({
        bill_id: bill._id,
        goods_id: item.productId,
        goods_name: goodsName,
        quantity: item.quantity,
        unit_price: item.price,
        total_amount: item.price * item.quantity,
      });
    }

    res.status(201).json({ billId: bill._id, billNumber });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tạo hóa đơn: " + error.message });
  }
};

// Lấy danh sách tất cả hóa đơn
exports.getAllBills = async (req, res) => {
  try {
    // Lấy tất cả hóa đơn, populate statusId và account_id từ shift_id
    const bills = await Bill.find()
      .populate("statusId", "name")
      .populate({
        path: "shift_id",
        select: "account_id",
        populate: {
          path: "account_id",
          select: "_id",
        },
      });

    // Lấy full_name từ UserDetail cho từng hóa đơn
    const formattedBills = await Promise.all(
      bills.map(async (bill) => {
        const userDetail = await UserDetail.findOne({
          user_id: bill.shift_id?.account_id?._id,
        }).select("full_name");
        return {
          ...bill.toObject(),
          shift_id: {
            account_id: {
              _id: bill.shift_id?.account_id?._id,
              full_name: userDetail?.full_name || "Không có thông tin",
            },
          },
        };
      })
    );

    // Trả về danh sách hóa đơn với trạng thái thành công
    res.status(200).json({
      success: true,
      data: formattedBills,
    });
  } catch (error) {
    // Xử lý lỗi khi lấy danh sách hóa đơn
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách hóa đơn",
      error: error.message,
    });
  }
};
  
  // Lấy thông tin một hóa đơn theo ID
  exports.getBillById = async (req, res) => {
    try {
      const bill = await Bill.findById(req.params.id).populate('statusId', 'status_name');
      if (!bill) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy hóa đơn',
        });
      }
      res.status(200).json({
        success: true,
        data: bill,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin hóa đơn',
        error: error.message,
      });
    }
  };

  // Lấy một chi tiết hóa đơn theo ID
exports.getBillDetailById = async (req, res) => {
  try {
    const billDetail = await BillDetail.find({ bill_id: req.params.id })
      .populate("bill_id") // Lấy toàn bộ thông tin của Bill
      .populate("goods_id", "goods_name barcode"); // Giữ nguyên để lấy goods_name
    if (!billDetail || billDetail.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi tiết hóa đơn",
      });
    }
    return res.status(200).json({
      success: true,
      data: billDetail,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};
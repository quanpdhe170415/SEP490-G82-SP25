const Bill = require('../models/bill');
const BillDetail = require('../models/billDetail');
const Goods = require('../models/goods');
const Category = require('../models/category');
const Shift = require('../models/shift');
const Account = require('../models/account');
const CashDenomination = require('../models/cashdenomination');
const StockMovement = require('../models/stockmovement');
const mongoose = require('mongoose');
const Status = require('../models/statusBill');
const ImportDetail = require('../models/import_detail');

exports.createBill = async (req, res) => {
  try {
    const { notes, shift_id } = req.body;
    // const account_id = req.user._id; // Giả định từ middleware auth

        // Kiểm tra trạng thái của ca
    if (shift_id) {
      const shift = await Shift.findById(shift_id);
      if (!shift) return res.status(404).json({ message: 'Ca không tồn tại' });
      if (shift.status === 'closed') {
        return res.status(400).json({ message: 'Ca đã đóng, không thể tạo hóa đơn' });
      }
    }

    const pendingStatus = await Status.findOne({ name: 'Pending' });
    if (!pendingStatus) return res.status(404).json({ message: 'Pending status not found' });

    const bill = new Bill({
      billNumber: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      totalAmount: 0,
      discount: 0,
      finalAmount: 0,
      statusId: pendingStatus._id,
      paymentMethod: '',
      notes,
      shift_id,
    });
    await bill.save();
    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: 'Error creating bill', error: error.message });
  }
};

exports.takeToDisplay = async (req, res) => {
  try {
    const { goodsId, quantity } = req.body;

    const goods = await Goods.findById(goodsId);
    if (!goods || !goods.is_active) return res.status(404).json({ message: 'Goods not found or inactive' });

    if (goods.stock_quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock quantity' });
    }

    goods.stock_quantity -= quantity;
    goods.display_quantity += quantity;
    await goods.save();

    const latestImport = await ImportDetail.findOne({ goods_id: goodsId }).sort({ createdAt: -1 });
    const batch_id = latestImport ? latestImport.import_batch_id : null;

    const stockMovement = new StockMovement({
      goodsId: goodsId,
      batch_id: batch_id,
      quantity: quantity,
      movedAt: new Date(),
      reason: 'Lấy ra bày bán',
    });
    await stockMovement.save();

    res.status(200).json(goods);
  } catch (error) {
    res.status(500).json({ message: 'Error taking goods to display', error: error.message });
  }
};

exports.addItemToBill = async (req, res) => {
  try {
    const billId = req.params.billId;
    const { goodsId, quantity } = req.body;

    const bill = await Bill.findById(billId);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });

    const goods = await Goods.findById(goodsId);
    if (!goods || !goods.is_active) return res.status(404).json({ message: 'Goods not found or inactive' });

    if (goods.display_quantity >= quantity) {
      goods.display_quantity -= quantity;
    } else if (goods.stock_quantity + goods.display_quantity >= quantity) {
      const remaining = quantity - goods.display_quantity;
      goods.display_quantity = 0;
      goods.stock_quantity -= remaining;
    } else {
      return res.status(400).json({ message: 'Insufficient stock and display quantity' });
    }

    await goods.save();

    // Kiểm tra xem BillDetail đã tồn tại cho goodsId này chưa
    let billDetail = await BillDetail.findOne({ bill_id: billId, goods_id: goodsId });
    if (billDetail) {
      // Cập nhật quantity và total_amount
      billDetail.quantity += quantity;
      billDetail.total_amount = billDetail.quantity * billDetail.unit_price;
      await billDetail.save();
    } else {
      // Tạo mới nếu không tồn tại
      billDetail = new BillDetail({
        bill_id: billId,
        goods_id: goodsId,
        quantity,
        unit_price: goods.selling_price,
        total_amount: quantity * goods.selling_price,
      });
      await billDetail.save();
    }

    const details = await BillDetail.find({ bill_id: billId });
    const totalAmount = details.reduce((sum, d) => sum + d.total_amount, 0);
    bill.totalAmount = totalAmount;
    bill.finalAmount = totalAmount - bill.discount;
    await bill.save();

    const latestImport = await ImportDetail.findOne({ goods_id: goodsId }).sort({ createdAt: -1 });
    const batch_id = latestImport ? latestImport.import_batch_id : null;

    const stockMovement = new StockMovement({
      goodsId: goodsId,
      batch_id: batch_id,
      quantity: -quantity,
      movedAt: new Date(),
      reason: 'Bán lẻ',
    });
    await stockMovement.save();

    res.status(201).json( billDetail );
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to bill', error: error.message });
  }
};

exports.getPaymentDetails = async (req, res) => {
  try {
    const { billId } = req.params;

    const bill = await Bill.findById(billId)
      .populate({
        path: 'shift_id',
        populate: {
          path: 'account_id',
          model: 'Account'
        }
      })
      .populate('statusId');
    if (!bill) return res.status(404).json({ message: 'Bill not found' });

    const billDetails = await BillDetail.find({ bill_id: billId })
      .populate('goods_id');

    const paymentDetails = {
      items: billDetails.map(detail => {
        const goods = detail.goods_id;
        return {
          code: goods.barcode,
          name: goods.goods_name,
          category: goods.category_id.category_name,
          stockQuantity: goods.stock_quantity,
          quantity: detail.quantity,
          sellingPrice: goods.selling_price,
          unit: goods.unit_of_measure,
        };
      }),
      employeeName: bill.shift_id ? bill.shift_id.account_id.username : 'Unknown',
      dateTime: new Date().toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).replace(/(\d+)\/(\d+)\/(\d+),/, '$2/$1/$3,'),
      totalAmount: bill.totalAmount,
      discount: bill.discount,
      finalAmount: bill.finalAmount,
      paymentMethod: bill.paymentMethod,
      cashPaid: 0,
      change: 0,
    };

    res.status(200).json(paymentDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment details', error: error.message });
  }
};

// exports.processPayment = async (req, res) => {
//   try {
//     const billId = req.params.billId;
//     const { paymentMethod, cashPaid } = req.body;

//     const bill = await Bill.findById(billId)
//       .populate('shift_id')
//       .populate('statusId');
//     if (!bill) return res.status(404).json({ message: 'Bill not found' });
//     if (bill.statusId && bill.statusId.name === 'Completed') return res.status(400).json({ message: 'Bill already completed' });

//     if (!paymentMethod) return res.status(400).json({ message: 'Payment method is required' });
//     if (paymentMethod === 'cash' && !cashPaid) return res.status(400).json({ message: 'Cash paid is required for cash payment' });

//     const change = paymentMethod === 'cash' ? Math.max(0, cashPaid - bill.finalAmount) : 0;

//     bill.paymentMethod = paymentMethod;
//     bill.cashPaid = paymentMethod === 'cash' ? cashPaid : 0;
//     bill.change = change;

//     // Cập nhật statusId thành Completed
//     const completedStatus = await Status.findOne({ name: 'Completed' });
//     if (completedStatus) {
//       bill.statusId = completedStatus._id;
//     } else {
//       return res.status(500).json({ message: 'Completed status not found' });
//     }
//     await bill.save();

//     // Cập nhật Shift (nếu có)
//     if (bill.shift_id) {
//       const shift = await Shift.findById(bill.shift_id._id);
//       if (shift) {
//         shift.total_transactions += 1;
//         if (paymentMethod === 'cash') {
//           shift.cash_transactions += 1;
//           shift.cash_change_given += change;
//           // Cập nhật final_cash_amount: initial_cash_amount + finalAmount - change
//           // shift.final_cash_amount = (shift.initial_cash_amount || 0) + bill.finalAmount - change;
//         }
//         await shift.save();
//       }
//     }

//     res.status(200).json({
//       paymentDetails: {
//         totalAmount: bill.totalAmount,
//         discount: bill.discount,
//         finalAmount: bill.finalAmount,
//         paymentMethod: bill.paymentMethod,
//         cashPaid: bill.cashPaid,
//         change: bill.change,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error processing payment', error: error.message });
//   }
// };

exports.processPayment = async (req, res) => {
  try {
    const billId = req.params.billId;
    const { paymentMethod, cashPaid } = req.body;

    const bill = await Bill.findById(billId)
      .populate('shift_id')
      .populate('statusId');
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    if (bill.statusId && bill.statusId.name === 'Completed') return res.status(400).json({ message: 'Bill already completed' });

    if (!paymentMethod) return res.status(400).json({ message: 'Payment method is required' });
    if (paymentMethod === 'Tiền mặt' && !cashPaid) return res.status(400).json({ message: 'Cash paid is required for cash payment' });

    const change = paymentMethod === 'Tiền mặt' ? cashPaid - bill.finalAmount : 0;

    bill.paymentMethod = paymentMethod;
    bill.cashPaid = paymentMethod === 'Tiền mặt' ? cashPaid : 0;
    bill.change = change;

    // Cập nhật statusId thành Completed
    const completedStatus = await Status.findOne({ name: 'Completed' });
    if (completedStatus) {
      bill.statusId = completedStatus._id;
    } else {
      return res.status(500).json({ message: 'Completed status not found' });
    }
    await bill.save();

    // Cập nhật Shift (nếu có)
    if (bill.shift_id) {
      const shift = await Shift.findById(bill.shift_id._id);
      if (shift) {
        shift.total_transactions += 1;
        if (paymentMethod === 'Tiền mặt') {
          shift.cash_transactions += 1;
          shift.cash_change_given += change;
          // Cập nhật final_cash_amount
          shift.final_cash_amount = (shift.initial_cash_amount || 0) + bill.finalAmount - change;
        }
        await shift.save();
      }
    }

    res.status(200).json({
      paymentDetails: {
        totalAmount: bill.totalAmount,
        discount: bill.discount,
        finalAmount: bill.finalAmount,
        paymentMethod: bill.paymentMethod,
        cashPaid: bill.cashPaid,
        change: bill.change,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
};

exports.manageBill = async (req, res) => {
  try {
    const { shift_id, notes, items, billId, paymentMethod } = req.body;

    // Kiểm tra trạng thái của ca
    if (!shift_id) return res.status(400).json({ message: 'shift_id is required' });
    const shift = await Shift.findById(shift_id);
    if (!shift) return res.status(404).json({ message: 'Ca không tồn tại' });
    if (shift.status === 'closed') {
      return res.status(400).json({ message: 'Ca đã đóng, không thể tạo hoặc cập nhật hóa đơn' });
    }

    let bill;
    if (billId) {
      // Tìm hóa đơn hiện có
      bill = await Bill.findById(billId);
      if (!bill) return res.status(404).json({ message: 'Bill not found' });
    } else {
      // Tạo hóa đơn mới nếu không có billId
      const pendingStatus = await Status.findOne({ name: 'Pending' });
      if (!pendingStatus) return res.status(404).json({ message: 'Pending status not found' });

      bill = new Bill({
        billNumber: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        totalAmount: 0,
        discount: 0,
        finalAmount: 0,
        statusId: pendingStatus._id,
        paymentMethod: paymentMethod || 'Tiền mặt',
        notes,
        shift_id,
      });
      await bill.save();
    }

    // Xử lý thêm hoặc cập nhật mặt hàng nếu có items
    if (items && Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        const { goodsId, quantity } = item;
        if (!goodsId || !quantity || quantity <= 0) {
          return res.status(400).json({ message: 'goodsId and valid quantity are required for each item' });
        }

        const goods = await Goods.findById(goodsId);
        if (!goods || !goods.is_active) return res.status(404).json({ message: 'Goods not found or inactive' });

        if (goods.display_quantity >= quantity) {
          goods.display_quantity -= quantity;
        } else if (goods.stock_quantity + goods.display_quantity >= quantity) {
          const remaining = quantity - goods.display_quantity;
          goods.display_quantity = 0;
          goods.stock_quantity -= remaining;
        } else {
          return res.status(400).json({ message: 'Insufficient stock and display quantity' });
        }
        await goods.save();

        // Kiểm tra xem BillDetail đã tồn tại cho goodsId này chưa
        let billDetail = await BillDetail.findOne({ bill_id: bill._id, goods_id: goodsId });
        if (billDetail) {
          billDetail.quantity += quantity;
          billDetail.total_amount = billDetail.quantity * billDetail.unit_price;
          await billDetail.save();
        } else {
          billDetail = new BillDetail({
            bill_id: bill._id,
            goods_id: goodsId,
            goods_name: goods.name,
            quantity,
            unit_price: goods.selling_price,
            total_amount: quantity * goods.selling_price,
          });
          await billDetail.save();
        }

        const latestImport = await ImportDetail.findOne({ goods_id: goodsId }).sort({ createdAt: -1 });
        const batch_id = latestImport ? latestImport.import_batch_id : null;

        const stockMovement = new StockMovement({
          goodsId: goodsId,
          batch_id: batch_id,
          quantity: -quantity,
          movedAt: new Date(),
          reason: 'Bán lẻ',
        });
        await stockMovement.save();
      }

      // Cập nhật totalAmount và finalAmount của bill
      const details = await BillDetail.find({ bill_id: bill._id });
      const totalAmount = details.reduce((sum, d) => sum + (d.total_amount || 0), 0); // Đảm bảo không NaN
      bill.totalAmount = totalAmount;
      const discount = Number(bill.discount) || 0; // Đảm bảo discount là số
      bill.finalAmount = totalAmount - discount; // Tính finalAmount
      if (isNaN(bill.finalAmount)) bill.finalAmount = 0; // Phòng trường hợp NaN
      await bill.save();
    }

    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: 'Error managing bill', error: error.message });
  }
};



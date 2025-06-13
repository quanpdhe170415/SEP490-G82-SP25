const Bill = require('../models/bill');
const BillDetail = require('../models/billDetail');
const Goods = require('../models/goods');
const Category = require('../models/category');
const Shift = require('../models/shift');
const Account = require('../models/account');
const CashDenomination = require('../models/cashdenomination');
const StockMovement = require('../models/stockmovement');

exports.getPaymentDetails = async (req, res) => {
  try {
    const { billId } = req.params;

    const bill = await Bill.findById(billId)
      .populate('shift_id')
      .populate('statusId')
      .populate('createdBy');
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
      employeeName: bill.createdBy.name,
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
    };

    res.status(200).json(paymentDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment details', error: error.message });
  }
};

exports.addItemToBill = async (req, res) => {
  try {
    const { billId, goodsId, quantity } = req.body;

    const bill = await Bill.findById(billId);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });

    const goods = await Goods.findById(goodsId);
    if (!goods || !goods.is_active) return res.status(404).json({ message: 'Goods not found or inactive' });

    if (goods.stock_quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock quantity' });
    }

    const billDetail = new BillDetail({
      bill_id: billId,
      goods_id: goodsId,
      quantity,
      unit_price: goods.selling_price,
    });
    await billDetail.save();

    // Cập nhật totalAmount trong bill
    const details = await BillDetail.find({ bill_id: billId });
    const totalAmount = details.reduce((sum, d) => sum + d.total_amount, 0);
    bill.totalAmount = totalAmount;
    bill.finalAmount = totalAmount - bill.discount;
    await bill.save();

    // Cập nhật stock_quantity
    goods.stock_quantity -= quantity;
    await goods.save();

    // Ghi nhận stock movement
    const stockMovement = new StockMovement({
      _id: mongoose.Types.ObjectId().toString(),
      goodsId: goodsId,
      quantity: -quantity,
      movedAt: new Date(),
      reason: 'Xuất bán',
    });
    await stockMovement.save();

    res.status(201).json({ message: 'Item added to bill', billDetail });
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to bill', error: error.message });
  }
};



exports.holdBill = async (req, res) => {
  try {
    const { billId } = req.params;
    const bill = await Bill.findById(billId);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });

    // Đặt trạng thái Pending nếu chưa có
    const pendingStatus = await Status.findOne({ name: 'Pending' });
    if (!pendingStatus) return res.status(404).json({ message: 'Pending status not found' });

    bill.statusId = pendingStatus._id;
    await bill.save();

    res.status(200).json({ message: 'Bill held', bill });
  } catch (error) {
    res.status(500).json({ message: 'Error holding bill', error: error.message });
  }
};

exports.processCashPayment = async (req, res) => {
  try {
    const { billId, denominations } = req.body;

    const bill = await Bill.findById(billId)
      .populate('shift_id')
      .populate('statusId');
    if (!bill) return res.status(404).json({ message: 'Bill not found' });

    if (bill.statusId.name !== 'Pending') {
      return res.status(400).json({ message: 'Bill must be in Pending status' });
    }

    const totalFromDenominations = denominations.reduce((sum, denom) => sum + (denom.denomination_value * denom.count), 0);
    if (totalFromDenominations < bill.finalAmount) {
      return res.status(400).json({ message: 'Insufficient cash amount' });
    }

    // Cập nhật CashDenomination
    const cashDenom = await CashDenomination.findOne({ shift_id: bill.shift_id._id });
    if (cashDenom) {
      cashDenom.denominations = cashDenom.denominations.map(d => {
        const newCount = denominations.find(n => n.denomination_value === d.denomination_value)?.count || d.count;
        return { denomination_value: d.denomination_value, count: newCount };
      });
      await cashDenom.save();
    }

    // Cập nhật Shift
    const shift = await Shift.findById(bill.shift_id._id);
    shift.cash_transactions += bill.finalAmount;
    shift.total_transactions += 1;
    await shift.save();

    // Cập nhật Bill
    const completedStatus = await Status.findOne({ name: 'Completed' });
    bill.statusId = completedStatus._id;
    bill.paymentMethod = 'cash';
    await bill.save();

    res.status(200).json({ message: 'Payment processed', bill });
  } catch (error) {
    res.status(500).json({ message: 'Error processing cash payment', error: error.message });
  }
};
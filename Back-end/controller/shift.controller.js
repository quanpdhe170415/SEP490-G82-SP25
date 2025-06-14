const Shift = require('../models/shift');
const CashDenomination = require('../models/cashdenomination');
const Account = require('../models/account');

exports.openShift = async (req, res) => {
  try {
    const { account_id, initial_cash_amount, notes, denominations } = req.body;

    // Validate input
    if (!denominations || !Array.isArray(denominations) || denominations.length === 0) {
      return res.status(400).json({ message: 'Hãy nhập số lượng mệnh giá tiền mặt khi mở ca' });
    }

    // Calculate total from denominations
    const totalFromDenominations = denominations.reduce((sum, denom) => {
      return sum + (denom.denomination_value * denom.count);
    }, 0);

    // Handle difference between initial_cash_amount and total from denominations
    let cashDifference = initial_cash_amount - totalFromDenominations;
    let updatedNotes = notes || '';
    if (cashDifference !== 0) {
      const differenceText = cashDifference > 0 ? `Thiếu ${cashDifference} VND`: `Số dư ${Math.abs(cashDifference)} VND`;
updatedNotes += ` | Cảnh báo: ${differenceText} so với số tiền mặt ban đầu (${initial_cash_amount} VND). Tổng số mệnh giá: ${totalFromDenominations} VND.`;
    }

    // Find the previous shift (latest closed shift)
    const previousShift = await Shift.findOne({ status: 'closed' }).sort({ shift_end_time: -1 });

    if (previousShift && previousShift.final_cash_amount) {
      const prevCashDifference = previousShift.final_cash_amount - initial_cash_amount;
      if (prevCashDifference > 0) {
        updatedNotes += ` |Cảnh báo: Số tiền mặt ban đầu (${initial_cash_amount} VND) ít hơn số tiền cuối cùng của ca trước (${previousShift.final_cash_amount} VND) là ${prevCashDifference} VND.`;
      } else if (prevCashDifference < 0) {
        updatedNotes += ` | Lưu ý: Số dư ${Math.abs(prevCashDifference)} VND so với số tiền cuối cùng của ca trước (${previousShift.final_cash_amount} VND).`;
      }
    }

    // Create new Shift
    const shift = new Shift({
      account_id,
      shift_start_time: new Date(),
      initial_cash_amount,
      status: 'open',
      notes: updatedNotes,
    });
    await shift.save();

    // Create new CashDenomination
    const cashDenomination = new CashDenomination({
      shift_id: shift._id,
      denominations,
    });
    await cashDenomination.save();

    // Fetch account details
    const account = await Account.findById(account_id);
    const response = {
      employeeName: account.username,
      cashReceived: shift.initial_cash_amount,
      shiftStartTime: shift.shift_start_time.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Sử dụng giờ 24h
      }).replace(/(\d+)\/(\d+)\/(\d+),/, '$2/$1/$3,'),
      notes: shift.notes,
      status: shift.status,
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error opening shift', error: error.message });
  }
};
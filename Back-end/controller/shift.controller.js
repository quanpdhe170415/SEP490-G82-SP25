const Shift = require('../models/shift');
const CashDenomination = require('../models/cashdenomination');
const Account = require('../models/account');
const { generateShiftReportExcel } = require('./util');
const Bill = require('../models/bill');

exports.handoverShift = async (req, res) => {
  try {
    const { previous_shift_id, new_shift_id, previous_account_id, confirmation, handed_over_amount } = req.body;

    // Validate input
    if (!previous_shift_id || !new_shift_id || !handed_over_amount) {
      return res.status(400).json({ message: 'previous_shift_id, new_shift_id, and handed_over_amount are required' });
    }

    // Find previous and new shifts
    const previousShift = await Shift.findById(previous_shift_id);
    const newShift = await Shift.findById(new_shift_id);
    if (!previousShift || !newShift) {
      return res.status(404).json({ message: 'One or both shifts not found' });
    }
    if (previousShift.status !== 'closed' || newShift.status !== 'open') {
      return res.status(400).json({ message: 'Previous shift must be closed and new shift must be open' });
    }

    let updatedNotes = newShift.notes || '';
    let handoverNotes = '';

    // Hiển thị và so sánh số tiền ca trước
    const prevFinalCash = previousShift.final_cash_amount || 0; // Cho phép 0
    if (prevFinalCash !== handed_over_amount) {
      const diffText = prevFinalCash > handed_over_amount ? `Thiếu ${prevFinalCash - handed_over_amount} VND` : `Số dư ${handed_over_amount - prevFinalCash} VND`;
      handoverNotes = ` | Bàn giao: Số tiền cuối ca trước (${prevFinalCash} VND) ${diffText} so với số tiền bàn giao (${handed_over_amount} VND).`;
      
      // Kiểm tra xác nhận
      if (!confirmation || !Array.isArray(confirmation) || confirmation.length < 2) {
        updatedNotes += `${handoverNotes} | Cảnh báo: Chưa có xác nhận đầy đủ từ 2 nhân viên. Yêu cầu đối soát với quản lý.`;
      } else {
        const [prevAccountId, newAccountId] = confirmation;
        if (prevAccountId !== previous_account_id || newAccountId !== newShift.account_id.toString()) {
          updatedNotes += `${handoverNotes} | Cảnh báo: Xác nhận không khớp với nhân viên ca trước và ca mới.`;
        } else {
          updatedNotes += `${handoverNotes} | Xác nhận bàn giao từ ${prevAccountId} và ${newAccountId} hợp lệ.`;
          newShift.isHandoverConfirmed = true; // Xác nhận thành công
        }
      }
    } else {
      handoverNotes = ` | Bàn giao: Số tiền cuối ca trước (${prevFinalCash} VND) khớp với số tiền bàn giao (${handed_over_amount} VND).`;
      if (confirmation && Array.isArray(confirmation) && confirmation.length === 2) {
        const [prevAccountId, newAccountId] = confirmation;
        if (prevAccountId !== previous_account_id || newAccountId !== newShift.account_id.toString()) {
          updatedNotes += `${handoverNotes} | Cảnh báo: Xác nhận không khớp với nhân viên ca trước và ca mới.`;
        } else {
          updatedNotes += `${handoverNotes} | Xác nhận bàn giao từ ${prevAccountId} và ${newAccountId} hợp lệ.`;
          newShift.isHandoverConfirmed = true; // Xác nhận thành công
        }
      } else {
        updatedNotes += `${handoverNotes} | Cảnh báo: Chưa có xác nhận đầy đủ từ 2 nhân viên. Yêu cầu đối soát với quản lý.`;
      }
    }

    // Cập nhật notes và trạng thái xác nhận
    newShift.notes = updatedNotes;
    await newShift.save();

    res.status(200).json({
      message: 'Handover processed successfully',
      previousFinalCash: prevFinalCash, // Hiển thị số tiền ca trước
      handedOverAmount: handed_over_amount,
      shiftId: new_shift_id,
      notes: updatedNotes,
      isHandoverConfirmed: newShift.isHandoverConfirmed,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing handover', error: error.message });
  }
};
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
      const differenceText = cashDifference > 0 ? `Thiếu ${cashDifference} VND` : `Số dư ${Math.abs(cashDifference)} VND`;
      updatedNotes += ` | Cảnh báo: ${differenceText} so với số tiền mặt ban đầu (${initial_cash_amount} VND). Tổng số mệnh giá: ${totalFromDenominations} VND.`;
    }

    // Create new Shift
    const shift = new Shift({
      account_id,
      shift_start_time: new Date(),
      initial_cash_amount,
      status: 'open',
      notes: updatedNotes,
      isHandoverConfirmed: false, // Mặc định chưa xác nhận bàn giao
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
        hour12: false,
      }).replace(/(\d+)\/(\d+)\/(\d+),/, '$2/$1/$3,'),
      notes: shift.notes,
      status: shift.status,
      shiftId: shift._id,
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error opening shift', error: error.message });
  }
};

exports.closeShift = async (req, res) => {
  try {
    const shiftId = req.params.shiftId;
    const { denominations } = req.body; // Yêu cầu nhập denominations khi đóng ca

    if (!denominations || !Array.isArray(denominations) || denominations.length === 0) {
      return res.status(400).json({ message: 'Hãy nhập số lượng mệnh giá tiền mặt cuối ca' });
    }

    const shift = await Shift.findById(shiftId).populate('account_id');
    if (!shift) return res.status(404).json({ message: 'Shift not found' });
    if (shift.status !== 'open') return res.status(400).json({ message: 'Shift is not open' });

    // Kiểm tra tất cả Bill liên quan đã hoàn tất, sử dụng populate
    const bills = await Bill.find({ shift_id: shiftId }).populate('statusId');
    const incompleteBills = bills.filter(bill => bill.statusId && bill.statusId.name !== 'Completed');
    if (incompleteBills.length > 0) {
      return res.status(400).json({ message: 'All bills must be completed before closing shift' });
    }

    // Tính doanh thu từ các Bill đã thanh toán
    const completedBills = await Bill.find({ shift_id: shiftId }).populate('statusId');
    const revenue = completedBills.reduce((sum, bill) => bill.statusId && bill.statusId.name === 'Completed' ? sum + bill.finalAmount : sum, 0);

    // Tính tổng tiền mặt cuối ca từ denominations
    const totalFromDenominations = denominations.reduce((sum, denom) => sum + (denom.denomination_value * denom.count), 0);

    // Cập nhật thông tin ca
    shift.shift_end_time = new Date();
    shift.final_cash_amount = totalFromDenominations; // Dựa trên denominations nhập vào
    shift.cash_change_given = shift.initial_cash_amount + revenue - totalFromDenominations; // Tính lại cashChangeGiven
    shift.cash_transactions = completedBills.filter(bill => bill.paymentMethod === 'Tiền mặt').length;
    shift.transfer_transactions = completedBills.filter(bill => bill.paymentMethod === 'transfer').length;
    shift.total_transactions = shift.cash_transactions + shift.transfer_transactions;
    shift.status = 'closed';
    await shift.save();

    // Lưu thông tin denominations cuối ca
    await CashDenomination.findOneAndUpdate(
      { shift_id: shiftId },
      { denominations },
      { upsert: true }
    );

    // Chuẩn bị dữ liệu trả về
    const employeeName = shift.account_id.username;
    const shiftStartTime = shift.shift_start_time.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).replace(/(\d+)\/(\d+)\/(\d+),/, '$2/$1/$3,');
    const shiftEndTime = shift.shift_end_time.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).replace(/(\d+)\/(\d+)\/(\d+),/, '$2/$1/$3,');

    const response = {
      employeeName,
      shiftStartTime,
      shiftEndTime,
      revenue,
      finalCashAmount: shift.final_cash_amount,
      cashTransactions: shift.cash_transactions,
      transferTransactions: shift.transfer_transactions,
      totalTransactions: shift.total_transactions,
      cashChangeGiven: shift.cash_change_given,
      denominations,
      notes: shift.notes,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error closing shift', error: error.message });
  }
};


exports.exportShiftReport = async (req, res) => {
  try {
    const shiftId = req.params.shiftId;

    const shift = await Shift.findById(shiftId).populate('account_id');
    if (!shift) return res.status(404).json({ message: 'Shift not found' });
    if (shift.status !== 'closed') return res.status(400).json({ message: 'Shift must be closed before exporting report' });

    // Lấy thông tin mệnh giá tiền từ CashDenomination
    const cashDenomination = await CashDenomination.findOne({ shift_id: shiftId });
    const denominations = cashDenomination ? cashDenomination.denominations : [];

    // Chuẩn bị dữ liệu cho Excel
    const employeeName = shift.account_id.username;
    const shiftStartTime = shift.shift_start_time.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).replace(/(\d+)\/(\d+)\/(\d+),/, '$2/$1/$3,');
    const shiftEndTime = shift.shift_end_time.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).replace(/(\d+)\/(\d+)\/(\d+),/, '$2/$1/$3,');

    const completedBills = await Bill.find({ shift_id: shiftId }).populate('statusId');
    const revenue = completedBills.reduce((sum, bill) => bill.statusId && bill.statusId.name === 'Completed' ? sum + bill.finalAmount : sum, 0);

    const excelData = {
      employeeName,
      shiftStartTime,
      shiftEndTime,
      revenue,
      finalCashAmount: shift.final_cash_amount,
      cashTransactions: shift.cash_transactions,
      transferTransactions: shift.transfer_transactions,
      totalTransactions: shift.total_transactions,
      cashChangeGiven: shift.cash_change_given,
      denominations,
      notes: shift.notes,
    };

    // Tạo file Excel
    const excelBuffer = await generateShiftReportExcel(excelData);
    res.setHeader('Content-Disposition', 'attachment; filename=shift_report_' + shiftId + '.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(excelBuffer);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting shift report', error: error.message });
  }
};
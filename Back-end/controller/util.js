const ExcelJS = require('exceljs');

async function generateShiftReportExcel(data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Shift Report');

  // Định nghĩa tiêu đề cột
  worksheet.columns = [
    { header: 'Tên nhân viên', key: 'employeeName', width: 20 },
    { header: 'Thời gian mở ca', key: 'shiftStartTime', width: 20 },
    { header: 'Thời gian đóng ca', key: 'shiftEndTime', width: 20 },
    { header: 'Doanh thu', key: 'revenue', width: 15 },
    { header: 'Số tiền mặt cuối ca', key: 'finalCashAmount', width: 20 },
    { header: 'Tổng số giao dịch tiền mặt', key: 'cashTransactions', width: 20 },
    { header: 'Số tiền chuyển khoản', key: 'transferTransactions', width: 20 },
    { header: 'Tổng số giao dịch chuyển khoản', key: 'transferTransactions', width: 25 },
    { header: 'Tổng số giao dịch', key: 'totalTransactions', width: 20 },
    { header: 'Số tiền trả mặt cho khách', key: 'cashChangeGiven', width: 20 },
    { header: 'Note', key: 'notes', width: 30 },
    { header: 'Trạng thái', key: 'status', width: 15 },
  ];

  // Thêm dữ liệu
  worksheet.addRow({
    employeeName: data.employeeName,
    shiftStartTime: data.shiftStartTime,
    shiftEndTime: data.shiftEndTime,
    revenue: data.revenue,
    finalCashAmount: data.finalCashAmount,
    cashTransactions: data.cashTransactions,
    transferTransactions: data.transferTransactions,
    totalTransactions: data.totalTransactions,
    cashChangeGiven: data.cashChangeGiven,
    notes: data.notes,
    status: data.status,
  });

  // Thêm thống kê mệnh giá tiền
  if (data.denominations && data.denominations.length > 0) {
    const denomRow = worksheet.addRow({ employeeName: 'Thống kê mệnh giá tiền' });
    denomRow.font = { bold: true };
    data.denominations.forEach((denom, index) => {
      worksheet.addRow({
        employeeName: `Mệnh giá ${denom.denomination_value} VND`,
        shiftStartTime: denom.count,
      });
    });
  }

  // Tạo buffer file Excel
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

module.exports = { generateShiftReportExcel };
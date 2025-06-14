const pdf = require('html-pdf');
const ejs = require('ejs');
const path = require('path');
const QRCode = require('qrcode');

// Controller: Xuất hóa đơn PDF
exports.exportInvoice = async (req, res) => {
  try {
    // B1: Lấy dữ liệu mẫu — bạn có thể lấy từ DB hoặc req.body
    const data = {
      invoiceCode: 'HD001',
      date: new Date().toLocaleString('vi-VN'),
      cashierName: 'Thu ngân A',
      paymentMethod: 'Tiền mặt',
      products: [
        { name: 'Nước tăng lực Warrior', quantity: 1, price: 12000 },
        { name: 'Nước lọc Aquafina', quantity: 2, price: 10000 }
      ],
      total: 12000 + 2 * 10000
    };

 // Tạo chuỗi thông tin hóa đơn để nhúng vào QR
    const qrContent = JSON.stringify(data, null, 2);
    const qrCodeDataUrl = await QRCode.toDataURL(qrContent);

    // Thêm qrCodeDataUrl vào data truyền cho EJS
    data.qrCodeDataUrl = qrCodeDataUrl;

    // B2: Render file EJS thành HTML
    const templatePath = path.join(__dirname, '../template/invoice.ejs'); // Cập nhật lại đường dẫn tùy cấu trúc thư mục
    ejs.renderFile(templatePath, data, (err, html) => {
      if (err) {
        console.error('Render template failed:', err);
        return res.status(500).json({ message: 'Lỗi khi render template' });
      }

      // B3: Tạo PDF từ HTML
        const options = {
          width: '58mm',    // hoặc '80mm' nếu máy in lớn hơn
          height: '120mm',  // hoặc để lớn hơn nếu hóa đơn dài
          orientation: 'portrait',
          border: '0'
        };      
        pdf.create(html, options).toStream((err, stream) => {
        if (err) {
          console.error('PDF generation failed:', err);
          return res.status(500).json({ message: 'Lỗi khi tạo PDF' });
        }

        // B4: Trả về file PDF cho client
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=invoice.pdf');
        stream.pipe(res);
      });
    });
  } catch (error) {
    console.error('Export invoice failed:', error);
    res.status(500).json({ message: 'Đã có lỗi xảy ra' });
  }
};

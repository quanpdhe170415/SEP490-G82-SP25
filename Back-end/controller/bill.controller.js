const { Bill, BillDetail, BillStatus } = require("../models");

exports.createBill = async (req, res) => {
  const { 
    billNumber,
    customerId,
    customerName,
    customerPhone,
    discount = 0,
    paymentMethod,
    notes,
    createdBy,
    billDetails // Array of products: [{ productId, productName, unitPrice, quantity }]
  } = req.body;

  try {
    // Validate required fields
    if (!billNumber || !billDetails || billDetails.length === 0) {
      return res.status(400).json({ 
        message: "Vui lòng điền đầy đủ thông tin: Số hóa đơn, khách hàng và sản phẩm!" 
      });
    }

    // Check if bill number already exists
    
    const existingBill = await Bill.findOne({ billNumber });
    
    if (existingBill) {
      return res.status(400).json({ 
        message: "Số hóa đơn đã tồn tại trong hệ thống!" 
      });
    }

    // Calculate total amount from bill details
    let totalAmount = 0;
    const validatedBillDetails = [];

    for (const detail of billDetails) {
      const { productId, productName, unitPrice, quantity } = detail;
      
      // Validate each bill detail
      if (!productId || !productName || !unitPrice || !quantity || quantity <= 0) {
        return res.status(400).json({ 
          message: "Thông tin sản phẩm không hợp lệ!" 
        });
      }

      const totalPrice = unitPrice * quantity;
      totalAmount += totalPrice;

      validatedBillDetails.push({
        productId,
        productName,
        unitPrice,
        quantity,
        totalPrice
      });
    }

    // Apply discount
    const finalAmount = totalAmount - (totalAmount * discount / 100);

    // Get default BillStatus (assuming "Pending" or similar)
    console.log(1);
    
    const defaultStatus = await BillStatus.findOne({ name: "pending" }) || await BillStatus.findOne({ isActive: true });
                         
    console.log(defaultStatus);
    
    if (!defaultStatus) {
      return res.status(500).json({ 
        message: "Không tìm thấy trạng thái mặc định cho hóa đơn!" 
      });
    }

    // Create new bill
    const newBill = new Bill({
      billNumber,
      customerId,
      customerName,
      customerPhone,
      totalAmount,
      discount,
      finalAmount,
      statusId: defaultStatus._id,
      paymentMethod,
      notes,
      createdBy,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Save bill to database
    const savedBill = await newBill.save();

    // Create bill details
    const billDetailsToSave = validatedBillDetails.map(detail => ({
      billId: savedBill._id,
      productId: detail.productId,
      productName: detail.productName,
      unitPrice: detail.unitPrice,
      quantity: detail.quantity,
      totalPrice: detail.totalPrice,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Save all bill details
    await BillDetail.insertMany(billDetailsToSave);

    // Return success response with bill information
    res.status(201).json({
      message: "Tạo hóa đơn thành công!",
      bill: {
        id: savedBill._id,
        billNumber: savedBill.billNumber,
        customerName: savedBill?.customerName || "Khách hàng không xác định",
        totalAmount: savedBill.totalAmount,
        discount: savedBill.discount,
        finalAmount: savedBill.finalAmount,
        createdAt: savedBill.createdAt,
        billDetails: validatedBillDetails
      }
    });

  } catch (err) {
    console.error("Create Bill Error:", err.message);
    
    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: "Số hóa đơn đã tồn tại trong hệ thống!" 
      });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        message: "Dữ liệu không hợp lệ: " + errors.join(', ') 
      });
    }

    res.status(500).json({ 
      message: "Lỗi server khi tạo hóa đơn!",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Additional helper function to get bill with details
exports.getBillWithDetails = async (req, res) => {
  const { billId } = req.params;

  try {
    // Find bill with status information
    const bill = await Bill.findById(billId)
      .populate('statusId', 'name description color')
      .lean();

    if (!bill) {
      return res.status(404).json({ 
        message: "Không tìm thấy hóa đơn!" 
      });
    }

    // Get bill details
    const billDetails = await BillDetail.find({ billId: bill._id }).lean();

    res.status(200).json({
      bill: {
        ...bill,
        billDetails
      }
    });

  } catch (err) {
    console.error("Get Bill Error:", err.message);
    res.status(500).json({ 
      message: "Lỗi server khi lấy thông tin hóa đơn!" 
    });
  }
};
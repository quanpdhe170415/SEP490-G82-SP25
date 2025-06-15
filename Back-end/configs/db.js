const mongoose = require("mongoose");
require("dotenv").config();

const db = require("../models");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: process.env.DB_NAME,
    });
    console.log("MongoDB connected successfully");
    // Đảm bảo các collection được tạo ra
    await Promise.all([
      db.Account.createCollection(),
      db.Role.createCollection(),
      db.Goods.createCollection(),
      db.ImportBatch.createCollection(),
      db.ImportDetail.createCollection(),
      db.Permission.createCollection(),
      db.Category.createCollection(),
      db.Stockmovement.createCollection(),
      db.Shift.createCollection(),
      db.CashDenomination.createCollection(),
      db.Bill.createCollection(),
      db.Status.createCollection(),
      db.BillDetail.createCollection(),
      db.ReturnOrder.createCollection(),
      db.ReturnDetail.createCollection(),
    ]);
    console.log("All collections ensured!");

    // Seed dữ liệu cho Category nếu chưa có
    const categoryCount = await db.Category.countDocuments();
    let categories = [];
    if (categoryCount === 0) {
      categories = await db.Category.insertMany([
        { category_name: "Đồ uống", description: "Các loại nước giải khát" },
        { category_name: "Thực phẩm", description: "Đồ ăn nhanh, snack" },
      ]);
      console.log("Seeded categories!");
    } else {
      categories = await db.Category.find();
    }

    // Seed dữ liệu cho Goods nếu chưa có
    const goodsCount = await db.Goods.countDocuments();
    if (goodsCount === 0 && categories.length > 0) {
      await db.Goods.insertMany([
        {
          goods_name: "Coca Cola",
          barcode: "8931234567890",
          unit_of_measure: "chai",
          description: "Nước ngọt có ga",
          category_id: categories[0]._id,
          selling_price: 10000,
          average_import_price: 8000,
          last_import_price: 8500,
          last_import_date: new Date(),
          stock_quantity: 100,
          display_quantity: 20,
          minimum_stock_quantity: 10,
          is_active: true,
          image_url:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Coca_Cola_Flasche_-_Original_Taste.jpg/1200px-Coca_Cola_Flasche_-_Original_Taste.jpg",
        },
        {
          goods_name: "Snack Oishi",
          barcode: "8930987654321",
          unit_of_measure: "gói",
          description: "Snack vị tôm cay",
          category_id: categories[1]._id,
          selling_price: 12000,
          average_import_price: 9000,
          last_import_price: 9500,
          last_import_date: new Date(),
          stock_quantity: 50,
          display_quantity: 10,
          minimum_stock_quantity: 5,
          is_active: true,
          image_url:
            "https://product.hstatic.net/200000495609/product/snack-tom-cay-oishi-du-vi-goi-lon-68g-banh-keo-an-vat-imnuts_d3ff6a241a9e4bb28aea097f9eca7166.jpg",
        },
      ]);
      console.log("Seeded goods!");
    }

    // Seed dữ liệu cho Status nếu chưa có
    const statusCount = await db.Status.countDocuments();
    if (statusCount === 0) {
      statuses = await db.Status.insertMany([
        {
          name: "Đã thanh toán",
          description: "Hóa đơn đã được thanh toán đầy đủ",
        },
        { name: "Đã trả hàng", description: "Hóa đơn đã bị trả hàng" },
      ]);
      console.log("Seeded statuses!");
    } else {
      statuses = await db.Status.find();
    }

    // Seed dữ liệu cho Bill
    const billCount = await db.Bill.countDocuments();
    if (billCount > 0) {
      await db.Bill.deleteMany({}); // Xóa tất cả dữ liệu hiện có
      console.log("Cleared existing bills!");
    }
    if (statuses.length > 0) {
      bills = await db.Bill.insertMany([
        {
          billNumber: "HD001",
          seller: "Nguyễn Văn A",
          totalAmount: 22000,
          finalAmount: 22000,
          paymentMethod: "Tiền mặt",
          statusId: statuses[0]._id, // Đã thanh toán
        },
        {
          billNumber: "HD002",
          seller: "Trần Thị B",
          totalAmount: 15000,
          finalAmount: 15000,
          paymentMethod: "Chuyển khoản ngân hàng",
          statusId: statuses[1]._id, // Đã trả hàng
        },
      ]);
      console.log("Seeded bills!");
    } else {
      bills = await db.Bill.find();
    }

    // Seed dữ liệu cho BillDetail
    const billDetailCount = await db.BillDetail.countDocuments();
    if (billDetailCount > 0) {
      await db.BillDetail.deleteMany({});
      console.log("Cleared existing bill details!");
    }

    const goods = await db.Goods.find();
    if (bills.length > 0 && goods.length >= 2) {
      const billDetails = [
        {
          bill_id: bills[0]._id, // HD001
          goods_id: goods[0]._id, // Coca Cola
          goods_name: goods[0].goods_name,
          quantity: 2,
          unit_price: 5000,
        },
        {
          bill_id: bills[0]._id, // HD001
          goods_id: goods[1]._id, // Snack Oishi
          goods_name: goods[1].goods_name,
          quantity: 1,
          unit_price: 12000,
        },
        {
          bill_id: bills[1]._id, // HD002
          goods_id: goods[1]._id, // Snack Oishi
          goods_name: goods[1].goods_name,
          quantity: 1,
          unit_price: 15000,
        },
      ];

      // Tính và thêm total_amount cho từng item
      billDetails.forEach((item) => {
        item.total_amount = item.quantity * item.unit_price;
        item.createdAt = new Date();
        item.updatedAt = new Date();
      });

      await db.BillDetail.insertMany(billDetails);
      console.log("Seeded bill details!");
    }
  } catch (error) {
    console.error("MongoDB in-memory connection failed: ", error);
    process.exit(1);
  }

  
};



module.exports = connectDB;

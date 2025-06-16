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
      db.GoodsDisposal.createCollection(),
      db.DisposalItem.createCollection(),
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
    let goods = [];
    if (goodsCount === 0 && categories.length > 0) {
      goods = await db.Goods.insertMany([
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
        {
          goods_name: "Bánh mì sandwich",
          barcode: "8931111222333",
          unit_of_measure: "chiếc",
          description: "Bánh mì kẹp thịt nguội",
          category_id: categories[1]._id,
          selling_price: 25000,
          average_import_price: 18000,
          last_import_price: 19000,
          last_import_date: new Date(),
          stock_quantity: 30,
          display_quantity: 8,
          minimum_stock_quantity: 5,
          is_active: true,
          image_url: "https://example.com/sandwich.jpg",
        },
      ]);
      console.log("Seeded goods!");
    } else {
      goods = await db.Goods.find();
    }

    // Seed dữ liệu cho Account nếu chưa có (cho trường imported_by)
    const accountCount = await db.Account.countDocuments();
    let accounts = [];
    if (accountCount === 0) {
      accounts = await db.Account.insertMany([
        {
          username: "admin1",
          password: "hashed_password_1", // Thay bằng mật khẩu đã mã hóa trong thực tế
          full_name: "Nguyễn Văn A",
          email: "admin1@example.com",
          phone: "0901234567",
          is_active: true,
        },
        {
          username: "admin2",
          password: "hashed_password_2", // Thay bằng mật khẩu đã mã hóa trong thực tế
          full_name: "Trần Thị B",
          email: "admin2@example.com",
          phone: "0912345678",
          is_active: true,
        },
        {
          username: "manager1",
          password: "hashed_password_3",
          full_name: "Lê Văn C",
          email: "manager1@example.com",
          phone: "0923456789",
          is_active: true,
        },
        {
          username: "staff1",
          password: "hashed_password_4",
          full_name: "Phạm Thị D",
          email: "staff1@example.com",
          phone: "0934567890",
          is_active: true,
        },
      ]);
      console.log("Seeded accounts!");
    } else {
      accounts = await db.Account.find();
    }

    // Seed dữ liệu cho ImportBatch
    const importBatchCount = await db.ImportBatch.countDocuments();
    let importBatches = [];
    if (importBatchCount > 0) {
      await db.ImportBatch.deleteMany({}); // Xóa tất cả dữ liệu hiện có
      console.log("Cleared existing import batches!");
    }
    if (goods.length >= 2 && accounts.length > 0) {
      importBatches = await db.ImportBatch.insertMany([
        {
          import_receipt_number: "PN001",
          supplier: "Công ty TNHH ABC",
          import_date: new Date("2025-06-14T10:00:00Z"),
          imported_by: accounts[0]._id, // Nguyễn Văn A
          total_value: 850000,
          status: "completed",
          notes: "Phiếu nhập hàng đầu tiên",
          conditions_checked: true,
        },
        {
          import_receipt_number: "PN002",
          supplier: "Công ty CP XYZ",
          import_date: new Date("2025-06-15T09:00:00Z"),
          imported_by: accounts[1]._id, // Trần Thị B
          total_value: 475000,
          status: "pending",
          notes: "Đang chờ kiểm tra hàng",
          conditions_checked: false,
        },
        {
          import_receipt_number: "PN003",
          supplier: "Công ty TNHH DEF",
          import_date: new Date("2025-05-10T08:00:00Z"),
          imported_by: accounts[0]._id,
          total_value: 570000,
          status: "completed",
          notes: "Lô hàng có một số sản phẩm hết hạn",
          conditions_checked: true,
        },
      ]);
      console.log("Seeded import batches!");
    } else {
      importBatches = await db.ImportBatch.find();
    }

    // Seed dữ liệu cho ImportDetail
    const importDetailCount = await db.ImportDetail.countDocuments();
    if (importDetailCount > 0) {
      await db.ImportDetail.deleteMany({});
      console.log("Cleared existing import details!");
    }
    let importDetails = [];
    if (importBatches.length > 0 && goods.length >= 2) {
      importDetails = [
        {
          import_batch_id: importBatches[0]._id, // PN001
          goods_id: goods[0]._id, // Coca Cola
          quantity_imported: 100,
          unit_import_price: 8500,
          total_amount: 8500 * 100,
          expiry_date: new Date("2026-06-14"),
          manufacturing_batch_number: "LOT001",
          manufacturing_date: new Date("2025-01-01"),
          notes: "Hàng mới, chất lượng tốt",
          meets_conditions: true,
        },
        {
          import_batch_id: importBatches[1]._id, // PN002
          goods_id: goods[1]._id, // Snack Oishi
          quantity_imported: 50,
          unit_import_price: 9500,
          total_amount: 9500 * 50,
          expiry_date: new Date("2026-06-15"),
          manufacturing_batch_number: "LOT002",
          manufacturing_date: new Date("2025-02-01"),
          notes: "Chờ kiểm tra chất lượng",
          meets_conditions: false,
        },
        {
          import_batch_id: importBatches[2]._id, // PN003
          goods_id: goods[2]._id, // Bánh mì sandwich
          quantity_imported: 30,
          unit_import_price: 19000,
          total_amount: 19000 * 30,
          expiry_date: new Date("2025-05-12"), // Đã hết hạn
          manufacturing_batch_number: "LOT003",
          manufacturing_date: new Date("2025-04-10"),
          notes: "Sản phẩm có dấu hiệu hết hạn",
          meets_conditions: true,
        },
      ];

      importDetails = await db.ImportDetail.insertMany(importDetails);
      console.log("Seeded import details!");
    }

    // Seed dữ liệu cho Status nếu chưa có
    const statusCount = await db.Status.countDocuments();
    let statuses = [];
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
    let bills = [];
    if (billCount > 0) {
      await db.Bill.deleteMany({}); // Xóa tất cả dữ liệu hiện có
      console.log("Cleared existing bills!");
    }
    if (statuses.length > 0) {
      // Lỗi ở statusID với ._id nên sửa tạm ở dưới
          // bills = await db.Bill.insertMany([
          //   {
          //     billNumber: "HD001",
          //     seller: "Nguyễn Văn A",
          //     totalAmount: 22000,
          //     finalAmount: 22000,
          //     paymentMethod: "Tiền mặt",
          //     statusId: statuses.find((s) => s.name === "Đã thanh toán")._id,
          //   },
          //   {
          //     billNumber: "HD002",
          //     seller: "Trần Thị B",
          //     totalAmount: 15000,
          //     finalAmount: 15000,
          //     paymentMethod: "Chuyển khoản ngân hàng",
          //     statusId: statuses.find((s) => s.name === "Đã trả hàng")._id,
          //   },
          // ]);
          // console.log("Seeded bills!");

      const paidStatus = statuses.find((s) => s.name === "Đã thanh toán");
      const returnedStatus = statuses.find((s) => s.name === "Đã trả hàng");
      if (!paidStatus || !returnedStatus) {
        console.error("Required statuses not found. Skipping bill seeding.");
      } else {
        bills = await db.Bill.insertMany([
          {
            billNumber: "HD001",
            seller: "Nguyễn Văn A",
            totalAmount: 22000,
            finalAmount: 22000,
            paymentMethod: "Tiền mặt",
            statusId: paidStatus._id,
          },
          {
            billNumber: "HD002",
            seller: "Trần Thị B",
            totalAmount: 15000,
            finalAmount: 15000,
            paymentMethod: "Chuyển khoản ngân hàng",
            statusId: returnedStatus._id,
          },
        ]);
        console.log("Seeded bills!");
      }
    } else {
      bills = await db.Bill.find();
    }

    // Seed dữ liệu cho BillDetail
    const billDetailCount = await db.BillDetail.countDocuments();
    if (billDetailCount > 0) {
      await db.BillDetail.deleteMany({});
      console.log("Cleared existing bill details!");
    }
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

    // Seed dữ liệu cho DisposalItem
    const disposalItemCount = await db.DisposalItem.countDocuments();
    let disposalItems = [];
    if (disposalItemCount > 0) {
      await db.DisposalItem.deleteMany({});
      console.log("Cleared existing disposal items!");
    }
    if (goods.length > 0 && importBatches.length > 0 && importDetails.length > 0) {
      disposalItems = await db.DisposalItem.insertMany([
        {
          goods_id: goods[2]._id, // Bánh mì sandwich (hết hạn)
          product_name: goods[2].goods_name,
          batch_number: "LOT003",
          unit_of_measure: goods[2].unit_of_measure,
          quantity_disposed: 15,
          cost_price: 19000,
          item_disposal_reason: "Hết hạn sử dụng",
          item_images: [
            "https://example.com/expired_sandwich_1.jpg",
            "https://example.com/expired_sandwich_2.jpg"
          ],
          import_batch_number: importBatches[2]._id,
          import_detail_id: importDetails[2]._id,
        },
        {
          goods_id: goods[0]._id, // Coca Cola
          product_name: goods[0].goods_name,
          batch_number: "LOT001",
          unit_of_measure: goods[0].unit_of_measure,
          quantity_disposed: 5,
          cost_price: 8500,
          item_disposal_reason: "Bao bì bị hỏng trong quá trình vận chuyển",
          item_images: [
            "https://example.com/damaged_cola_1.jpg",
            "https://example.com/damaged_cola_2.jpg"
          ],
          import_batch_number: importBatches[0]._id,
          import_detail_id: importDetails[0]._id,
        },
        {
          goods_id: goods[1]._id, // Snack Oishi
          product_name: goods[1].goods_name,
          batch_number: "LOT002",
          unit_of_measure: goods[1].unit_of_measure,
          quantity_disposed: 3,
          cost_price: 9500,
          item_disposal_reason: "Sản phẩm bị ẩm mốc",
          item_images: [
            "https://example.com/moldy_snack_1.jpg"
          ],
          import_batch_number: importBatches[1]._id,
          import_detail_id: importDetails[1]._id,
        },
      ]);
      console.log("Seeded disposal items!");
    }

    // Seed dữ liệu cho GoodsDisposal
    const goodsDisposalCount = await db.GoodsDisposal.countDocuments();
    if (goodsDisposalCount > 0) {
      await db.GoodsDisposal.deleteMany({});
      console.log("Cleared existing goods disposals!");
    }
    if (disposalItems.length > 0 && accounts.length >= 3) {
      const goodsDisposals = await db.GoodsDisposal.insertMany([
        {
          disposal_number: "HUY001",
          created_by: accounts[3]._id, // Phạm Thị D (staff1)
          disposal_date: new Date("2025-06-16T14:30:00Z"),
          reason_for_disposal: "Hủy hàng hết hạn sử dụng theo quy định",
          disposal_items: [disposalItems[0]._id], // Bánh mì sandwich hết hạn
          total_disposal_value: 15 * 19000, // 285,000
          status: "approved",
          approved_by: accounts[2]._id, // Lê Văn C (manager1)
          confirmed_by: accounts[0]._id, // Nguyễn Văn A (admin1)
          notes: "Hủy 15 chiếc bánh mì hết hạn, đã được phê duyệt và xác nhận thực hiện",
        },
        {
          disposal_number: "HUY002",
          created_by: accounts[1]._id, // Trần Thị B (admin2)
          disposal_date: new Date("2025-06-15T10:00:00Z"),
          reason_for_disposal: "Hàng hóa bị hỏng trong quá trình vận chuyển và bảo quản",
          disposal_items: [disposalItems[1]._id, disposalItems[2]._id], // Coca Cola hỏng + Snack ẩm mốc
          total_disposal_value: (5 * 8500) + (3 * 9500), // 42,500 + 28,500 = 71,000
          status: "pending",
          notes: "Chờ phê duyệt hủy hàng bị hỏng",
        },
        {
          disposal_number: "HUY003",
          created_by: accounts[3]._id, // Phạm Thị D (staff1)
          disposal_date: new Date("2025-06-17T09:15:00Z"),
          reason_for_disposal: "Kiểm tra định kỳ phát hiện hàng có dấu hiệu hư hỏng",
          disposal_items: [], // Chưa có items cụ thể
          total_disposal_value: 0,
          status: "cancelled",
          notes: "Đã hủy phiếu này do phát hiện hàng vẫn còn sử dụng được",
        },
      ]);
      console.log("Seeded goods disposals!");
    }

    console.log("=== DATABASE SEEDING COMPLETED ===");
    console.log("All collections have been seeded with sample data!");
    
  } catch (error) {
    console.error("MongoDB in-memory connection failed: ", error);
    process.exit(1);
  }
};

module.exports = connectDB;
const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcryptjs");

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
      db.Session.createCollection(),
      db.ShiftType.createCollection(),
    ]);
    console.log("All collections ensured!");

 let shiftTypes = [];
    const shiftTypeCount = await db.ShiftType.countDocuments();
    console.log(`ShiftType count: ${shiftTypeCount}`);
    if (shiftTypeCount === 0) {
      shiftTypes = await db.ShiftType.insertMany([
        {
          name: "Ca sáng",
          start_time: "08:00",
          end_time: "15:00",
          notes: "Ca sáng từ 8h đến 15h",
        },
        {
          name: "Ca chiều",
          start_time: "15:00",
          end_time: "22:00",
          notes: "Ca chiều từ 15h đến 22h",
        },
      ]);
      console.log("Seeded shift types:", shiftTypes.map(s => s.name));
    } else {
      shiftTypes = await db.ShiftType.find();
      console.log("Existing shift types:", shiftTypes.map(s => s.name));
    }

    // Seed dữ liệu cho Role nếu chưa có
    let roles = [];
    const roleCount = await db.Role.countDocuments();
    console.log(`Role count: ${roleCount}`);
    if (roleCount === 0) {
      roles = await db.Role.insertMany([
        {
          name: "Admin",
          code: "ADMIN",
        },
        {
          name: "Staff",
          code: "STAFF",
        },
        {
          name: "Manager",
          code: "MANAGER",},
        {
          name: "WarehouseStaff",
          code: "WAREHOUSE_STAFF",
        },
      ]);
      console.log(
        "Seeded roles:",
        roles.map((r) => ({ name: r.name, code: r.code }))
      );
    } else {
      roles = await db.Role.find();
      console.log(
        "Existing roles:",
        roles.map((r) => ({ name: r.name, code: r.code }))
      );
    }

    if (!roles.length) {
      throw new Error("No roles available for seeding Account");
    }

    // Seed dữ liệu cho Account nếu chưa có
    let accounts = [];
    const accountCount = await db.Account.countDocuments();
    console.log(`Account count: ${accountCount}`);
    if (accountCount === 0) {
      const password1 = await bcrypt.hash("123456", 10);
      const password2 = await bcrypt.hash("123456", 10);
      accounts = await db.Account.insertMany([
        {
          username: "admin1",
          password: password1, // Thay bằng mật khẩu đã mã hóa
          full_name: "Nguyễn Văn A",
          email: "admin1@example.com",
          phone: "0901234567",
          is_active: true,
          role_id: roles.find((r) => r.name === "Admin")._id,
        },
        {
          username: "admin2",
          password: password2, // Thay bằng mật khẩu đã mã hóa
          full_name: "Trần Thị B",
          email: "admin2@example.com",
          phone: "0912345678",
          is_active: true,
          role_id: roles.find((r) => r.name === "Staff")._id,
        },
        {
          username: "manager1",
          password: password1, // Thay bằng mật khẩu đã mã hóa
          full_name: "Lê Văn C",
          email: "a@gmail.com",
          phone: "0987654321",
          is_active: true,
          role_id: roles.find((r) => r.name === "Manager")._id,
        },
        {
          username: "staff1",
          password: password2, // Thay bằng mật khẩu đã mã hóa
          full_name: "Phạm Thị D",
          email: "b@gmail.com",
          phone: "0976543210",
          is_active: true,
          role_id: roles.find((r) => r.name === "WarehouseStaff")._id,
        },
      ]);
      console.log(
        "Seeded accounts:",
        accounts.map((a) => a.username)
      );
    } else {
      accounts = await db.Account.find();
      console.log(
        "Existing accounts:",
        accounts.map((a) => a.username)
      );
    }

    // Seed dữ liệu cho Shift nếu chưa có
    let shifts = [];
    const shiftCount = await db.Shift.countDocuments();
    console.log(`Shift count: ${shiftCount}`);
    if (shiftCount === 0 && accounts.length > 0) {
      shifts = await db.Shift.insertMany([
        {
          account_id: accounts[0]._id, // Nguyễn Văn A
          shift_start_time: new Date("2025-06-14T08:00:00Z"),
          shift_end_time: new Date("2025-06-14T14:00:00Z"),
          initial_cash_amount: 500000,
          final_cash_amount: 520000,
          cash_transactions: 10,
          transfer_transactions: 5,
          cash_change_given: 20000,
          total_transactions: 15,
          cash_surplus: 0,
          status: "closed",
          notes: "Ca sáng ngày 14/06/2025",
        },
        {
          account_id: accounts[1]._id, // Trần Thị B
          shift_start_time: new Date("2025-06-14T14:00:00Z"),
          shift_end_time: new Date("2025-06-14T20:00:00Z"),
          initial_cash_amount: 500000,
          final_cash_amount: 510000,
          cash_transactions: 8,
          transfer_transactions: 3,
          cash_change_given: 15000,
          total_transactions: 11,
          cash_surplus: 0,
          status: "closed",
          notes: "Ca chiều ngày 14/06/2025",
        },
      ]);
      console.log(
        "Seeded shifts:",
        shifts.map((s) => s.notes)
      );
    } else {
      shifts = await db.Shift.find();
      console.log(
        "Existing shifts:",
        shifts.map((s) => s.notes)
      );
    }

    // Seed dữ liệu cho Category nếu chưa có
    let categories = [];
    const categoryCount = await db.Category.countDocuments();
    console.log(`Category count: ${categoryCount}`);
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
    let goods = [];
    const goodsCount = await db.Goods.countDocuments();
    console.log(`Goods count: ${goodsCount}`);
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


    // Seed dữ liệu cho ImportBatch
    let importBatches = [];
    const importBatchCount = await db.ImportBatch.countDocuments();
    console.log(`ImportBatch count: ${importBatchCount}`);
    if (importBatchCount > 0) {
      await db.ImportBatch.deleteMany({});
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
    console.log(`ImportDetail count: ${importDetailCount}`);
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
        }
      ];

      importDetails = await db.ImportDetail.insertMany(importDetails);
      console.log("Seeded import details!");
    }

    // Seed dữ liệu cho Status nếu chưa có
    let statuses = [];
    const statusCount = await db.Status.countDocuments();
    console.log(`Status count: ${statusCount}`);
    if (statusCount === 0) {
      statuses = await db.Status.insertMany([
        {
          name: "Đã thanh toán",
          description: "Hóa đơn đã được thanh toán đầy đủ",
        },
        {
          name: "Đã trả hàng",
          description: "Hóa đơn đã bị trả hàng",
        },
      ]);
      console.log("Seeded statuses!");
    } else {
      statuses = await db.Status.find();
    }

    // Seed dữ liệu cho Bill
    let bills = [];
    const billCount = await db.Bill.countDocuments();
    console.log(`Bill count: ${billCount}`);
    if (billCount > 0) {
      await db.Bill.deleteMany({});
      console.log("Cleared existing bills!");
    }

    if (statuses.length > 0 && shifts.length > 0) {
      const statusPaid = statuses.find((s) => s.name === "Đã thanh toán");
      const statusReturned = statuses.find((s) => s.name === "Đã trả hàng");
      const shiftMorning = shifts.find((s) => s.notes === "Ca sáng ngày 14/06/2025");
      const shiftAfternoon = shifts.find((s) => s.notes === "Ca chiều ngày 14/06/2025");
      const billsToInsert = [];
      if (statusPaid && shiftMorning) {
        billsToInsert.push({
          billNumber: "HD001",
          seller: "Nguyễn Văn A",
          totalAmount: 22000,
          finalAmount: 22000,
          paymentMethod: "Tiền mặt",
          statusId: statusPaid._id,
          shift_id: shiftMorning._id,
        });
      } else {
        console.warn("Không tìm thấy status 'Đã thanh toán' hoặc shift 'Ca sáng ngày 14/06/2025', bỏ qua HD001");
      }
      if (statusReturned && shiftAfternoon) {
        billsToInsert.push({
          billNumber: "HD002",
          seller: "Trần Thị B",
          totalAmount: 15000,
          finalAmount: 15000,
          paymentMethod: "Chuyển khoản ngân hàng",
          statusId: statusReturned._id,
          shift_id: shiftAfternoon._id,
        });
      } else {
        console.warn("Không tìm thấy status 'Đã trả hàng' hoặc shift 'Ca chiều ngày 14/06/2025', bỏ qua HD002");
      }
      if (billsToInsert.length > 0) {
        bills = await db.Bill.insertMany(billsToInsert);
        console.log("Seeded bills!");
      } else {
        bills = [];
        console.warn("Không có bill nào được seed!");
      }
    } else {
      bills = await db.Bill.find();
    }

    // Seed dữ liệu cho BillDetail
    const billDetailCount = await db.BillDetail.countDocuments();
    console.log(`BillDetail count: ${billDetailCount}`);
    if (billDetailCount > 0) {
      await db.BillDetail.deleteMany({});
      console.log("Cleared existing bill details!");
    }
    if (bills.length > 0 && goods.length >= 2) {
      const billDetails = [
        // Chi tiết cho HD001
        {
          bill_id: bills[0]._id, // HD001
          goods_id: goods[0]._id, // Coca Cola
          goods_name: goods[0].goods_name,
          quantity: 2,
          unit_price: 5000,
          total_amount: 2 * 5000,
        },
        {
          bill_id: bills[0]._id, // HD001
          goods_id: goods[1]._id, // Snack Oishi
          goods_name: goods[1].goods_name,
          quantity: 1,
          unit_price: 12000,
          total_amount: 1 * 12000,
        },
        // Chi tiết cho HD002
        {
          bill_id: bills[1]._id, // HD002
          goods_id: goods[1]._id, // Snack Oishi
          goods_name: goods[1].goods_name,
          quantity: 1,
          unit_price: 15000,
          total_amount: 1 * 15000,
        },
        // Chi tiết cho INV-20250613-180
        // {
        //   bill_id: bills[2]._id, // INV-20250613-180
        //   goods_id: goods[0]._id, // Coca Cola
        //   goods_name: goods[0].goods_name,
        //   quantity: 4,
        //   unit_price: 10000,
        // },
        // // Chi tiết cho INV-20250613-209
        // {
        //   bill_id: bills[3]._id, // INV-20250613-209
        //   goods_id: goods[1]._id, // Snack Oishi
        //   goods_name: goods[1].goods_name,
        //   quantity: 2,
        //   unit_price: 10000,
        // },
      ];

      await db.BillDetail.insertMany(billDetails);
      console.log("Seeded bill details with new data!");
    } else {
      console.warn("Not enough bills or goods to seed bill details. Skipping bill details seeding.");
    }

    // Seed dữ liệu cho DisposalItem
    const disposalItemCount = await db.DisposalItem.countDocuments();
    let disposalItems = [];
    if (disposalItemCount > 0) {
      await db.DisposalItem.deleteMany({});
      console.log("Cleared existing disposal items!");
    }
    // if (goods.length > 0 && importBatches.length > 0 && importDetails.length > 0) {
    //   disposalItems = await db.DisposalItem.insertMany([
    //     {
    //       goods_id: goods[0]._id, // Coca Cola
    //       product_name: goods[0].goods_name,
    //       batch_number: "LOT001",
    //       unit_of_measure: goods[0].unit_of_measure,
    //       quantity_disposed: 5,
    //       cost_price: 8500,
    //       item_disposal_reason: "Bao bì bị hỏng trong quá trình vận chuyển",
    //       item_images: [
    //         "https://example.com/damaged_cola_1.jpg",
    //         "https://example.com/damaged_cola_2.jpg"
    //       ],
    //       import_batch_number: importBatches[0]._id,
    //       import_detail_id: importDetails[0]._id,
    //     },
    //     {
    //       goods_id: goods[1]._id, // Snack Oishi
    //       product_name: goods[1].goods_name,
    //       batch_number: "LOT002",
    //       unit_of_measure: goods[1].unit_of_measure,
    //       quantity_disposed: 3,
    //       cost_price: 9500,
    //       item_disposal_reason: "Sản phẩm bị ẩm mốc",
    //       item_images: [
    //         "https://example.com/moldy_snack_1.jpg"
    //       ],
    //       import_batch_number: importBatches[1]._id,
    //       import_detail_id: importDetails[1]._id,
    //     },
    //   ]);
    //   console.log("Seeded disposal items!");
    // }

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
    console.error("MongoDB connection failed: ", error);
    process.exit(1);
  }
};

module.exports = connectDB;
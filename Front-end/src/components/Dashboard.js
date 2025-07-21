import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import "./Css/Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Mock data cho các thống kê
  const stats = {
    revenue: 125000000,
    orders: 1500,
    expense: 45000000,
    profit: 80000000,
  };

  // Mock data cho hiệu suất nhân viên
  const employeePerformance = [
    { name: "Nguyễn Văn A", sales: 25000000, orders: 120, status: "Xuất sắc" },
    { name: "Trần Thị B", sales: 22000000, orders: 110, status: "Tốt" },
    { name: "Lê Văn C", sales: 18000000, orders: 95, status: "Khá" },
  ];

  // Mock data cho Top 10 sản phẩm bán chạy
  const topSellingProducts = {
    labels: [
      "Bánh mì",
      "Cháo trai",
      "Cơm gà",
      "Phở bò",
      "Bún chả",
      "Cao lầu",
      "Chè đậu",
      "Bánh canh",
      "Bún bò",
      "Bánh xèo",
    ],
    datasets: [
      {
        label: "Số lượng bán",
        data: [50, 45, 35, 25, 20, 18, 15, 12, 10, 8],
        backgroundColor: [
          "#FF6B6B",
          "#4ECDC4",
          "#45B7D1",
          "#96CEB4",
          "#FFEAA7",
          "#DDA0DD",
          "#F39C12",
          "#3498DB",
          "#E74C3C",
          "#2ECC71",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Mock data cho Top 10 sản phẩm tồn kho ít
  const lowStockProducts = [
    { name: "Gạy hột thơm", quantity: 15, status: "Hết hàng" },
    { name: "Chanh tươi", quantity: 60, status: "Sắp hết" },
    { name: "Ao so mi nam", quantity: 30, status: "Sắp hết" },
    { name: "Váy đen", quantity: 25, status: "Sắp hết" },
    { name: "Tủ sách gỗ", quantity: 10, status: "Hết hàng" },
    { name: "Kính mắt", quantity: 55, status: "Sắp hết" },
    { name: "Đồng hồ thông minh", quantity: 35, status: "Sắp hết" },
    { name: "Máy tính bảng", quantity: 40, status: "Sắp hết" },
    { name: "Điện thoại", quantity: 20, status: "Sắp hết" },
    { name: "Khăn quàng cổ", quantity: 18, status: "Hết hàng" },
  ];

  // Mock data cho doanh thu theo tháng
  const monthlyRevenue = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: [
          120000000, 135000000, 140000000, 128000000, 145000000, 150000000,
        ],
        borderColor: "#4ECDC4",
        backgroundColor: "rgba(78, 205, 196, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Mock data cho lợi nhuận góp theo tháng
  const monthlyProfit = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
    datasets: [
      {
        label: "Lợi nhuận góp (VNĐ)",
        data: [25000000, 30000000, 28000000, 32000000, 35000000, 38000000],
        borderColor: "#9B59B6",
        backgroundColor: "rgba(155, 89, 182, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString("vi-VN");
          },
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Hết hàng":
        return "#E74C3C";
      case "Sắp hết":
        return "#F39C12";
      case "Xuất sắc":
        return "#27AE60";
      case "Tốt":
        return "#3498DB";
      case "Khá":
        return "#F39C12";
      default:
        return "#95A5A6";
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard Quản Lý</h1>
        <div className="user-info">
          <span>🔔</span>
          <span>👤 Quản lý</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-content">
            <h3>Doanh thu hôm nay</h3>
            <p className="stat-value">{formatCurrency(stats.revenue)}</p>
          </div>
        </div>
        <div className="stat-card orders">
          <div className="stat-content">
            <h3>Đơn hàng hôm nay</h3>
            <p className="stat-value">{stats.orders}</p>
          </div>
        </div>
        <div className="stat-card expense">
          <div className="stat-content">
            <h3>Chi phí hôm nay</h3>
            <p className="stat-value">{formatCurrency(stats.expense)}</p>
          </div>
        </div>
        <div className="stat-card profit">
          <div className="stat-content">
            <h3>Lợi nhuận hôm nay</h3>
            <p className="stat-value">{formatCurrency(stats.profit)}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-container">
          <h3>Top 10 Sản phẩm bán chạy nhất</h3>
          <Bar data={topSellingProducts} options={barChartOptions} />
        </div>

        <div className="table-container">
          <h3>Top 10 Sản phẩm tồn kho ít</h3>
          <div className="stock-table">
            <div className="table-header">
              <span>Sản phẩm</span>
              <span>Số lượng tồn</span>
              <span>Trạng thái</span>
            </div>
            {lowStockProducts.map((product, index) => (
              <div key={index} className="table-row">
                <span>{product.name}</span>
                <span>{product.quantity}</span>
                <span
                  className="status"
                  style={{ color: getStatusColor(product.status) }}
                >
                  {product.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue and Profit Charts */}
      <div className="charts-grid">
        <div className="chart-container">
          <h3>Doanh thu theo tháng</h3>
          <Line data={monthlyRevenue} options={chartOptions} />
        </div>

        <div className="chart-container">
          <h3>Lợi nhuận góp theo tháng</h3>
          <Line data={monthlyProfit} options={chartOptions} />
        </div>
      </div>

      {/* Employee Performance and Quick Actions */}
      <div className="bottom-section">
        <div className="employee-performance">
          <h3>Hiệu suất nhân viên hàng đầu</h3>
          <div className="employee-table">
            <div className="table-header">
              <span>Tên nhân viên</span>
              <span>Doanh số đã nhận</span>
              <span>Số đơn hàng</span>
              <span>Đánh giá</span>
            </div>
            {employeePerformance.map((employee, index) => (
              <div key={index} className="table-row">
                <span>{employee.name}</span>
                <span>{formatCurrency(employee.sales)}</span>
                <span>{employee.orders}</span>
                <span
                  className="status"
                  style={{ color: getStatusColor(employee.status) }}
                >
                  {employee.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions">
          <h3>Tác vụ nhanh</h3>
          <div className="action-buttons">
            <button className="action-btn work">📋 Phân ca làm việc</button>
            <button className="action-btn goods">📦 Nhập hàng</button>
            <button className="action-btn manage">✅ Quản lý kiểm kho</button>
            <button className="action-btn report">
              📊 Báo cáo xuất nhập tồn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

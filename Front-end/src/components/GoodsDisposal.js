import React, { useState } from "react";
import "./Css/GoodsDisposal.css"; // Assuming you have a CSS file for styles

export default function GoodsDisposal() {
    const [searchData, setSearchData] = useState({
        importCode: "",
        creator: "",
        importer: "",
        startDate: "28/05/2025",
        endDate: "",
    })

    const [tableData] = useState([
        {
            id: "XH00001",
            totalValue: "50000",
            time: "28/05/2025 22:03",
            note: "Tại nạn không còn giá trị sử dụng",
            status: "Phiếu tạm",
        },
        {
            id: "XH00002",
            totalValue: "100000",
            time: "29/05/2025 22:03",
            note: "Hết HSD",
            status: "Đã hoàn thành",
        },
    ])

    const [expandedRow, setExpandedRow] = useState(null)

    const [detailData] = useState({
        XH00001: {
            items: [
                {
                    itemCode: "1575239",
                    itemName: "Bò ăn cơm",
                    quantity: 5,
                    costPrice: 7500,
                    destructionValue: 37500,
                    reason: "Hàng bị hỏng do tai nạn", // Reason for disposal
                    image: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg", // Image path or URL
                },
            ],
            creator: "",
            totalQuantity: 5,
            totalValue: 37500,
        },
        XH00002: {
            items: [
                {
                    itemCode: "1575240",
                    itemName: "Sữa hết hạn",
                    quantity: 10,
                    costPrice: 10000,
                    destructionValue: 100000,
                },
            ],
            creator: "",
            totalQuantity: 10,
            totalValue: 100000,
        },
    })

    const handleInputChange = (field, value) => {
        setSearchData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSearch = () => {
        console.log("Searching with:", searchData)
    }

    const handleExportFile = () => {
        console.log("Exporting file...")
    }

    const handleRowClick = (rowId) => {
        setExpandedRow(expandedRow === rowId ? null : rowId)
    }

    return (
        <div className="app">
            {/* Header */}
            <header className="header">
                <div className="header-left">
                    <div className="logo">logo</div>
                    <span className="store-name">Tạp hóa Hải Chi</span>
                </div>
                <div className="header-right">
                    <button className="red-envelope-btn">Hồng bảo</button>
                </div>
            </header>

            <div className="main-container">
                {/* Sidebar */}
                <aside className="sidebar">
                    <nav className="nav-menu">
                        <div className="nav-item">Nhập hàng</div>
                        <div className="nav-item">Xuất trả hàng</div>
                        <div className="nav-item active">Xuất hủy</div>
                        <div className="nav-item">Xuất hàng</div>
                    </nav>
                    <div className="sidebar-footer">
                        <div className="avatar">avatar</div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="main-content">
                    <div className="content-header">
                        <h1>Phiếu xuất hủy</h1>
                        <button className="export-btn" onClick={handleExportFile}>
                            Xuất file
                        </button>
                    </div>

                    <div className="content-body">
                        {/* Search Form */}
                        <div className="search-form">
                            <div className="form-group">
                                <label>Theo mã nhập</label>
                                <input
                                    type="text"
                                    value={searchData.importCode}
                                    onChange={(e) => handleInputChange("importCode", e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Người tạo</label>
                                <input
                                    type="text"
                                    value={searchData.creator}
                                    onChange={(e) => handleInputChange("creator", e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Người nhập</label>
                                <input
                                    type="text"
                                    value={searchData.importer}
                                    onChange={(e) => handleInputChange("importer", e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Thời gian</label>
                                <input
                                    type="text"
                                    value={searchData.startDate}
                                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                                />
                                <input
                                    type="text"
                                    value={searchData.endDate}
                                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                                />
                            </div>

                            <button className="search-btn" onClick={handleSearch}>
                                Tìm kiếm
                            </button>
                        </div>

                        {/* Data Table */}
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Mã xuất hủy</th>
                                        <th>Tổng giá trị hủy</th>
                                        <th>Thời gian</th>
                                        <th>Ghi chú</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((row, index) => (
                                        <>
                                            <tr key={index} onClick={() => handleRowClick(row.id)} className="table-row">
                                                <td>{row.id}</td>
                                                <td>{row.totalValue}</td>
                                                <td>{row.time}</td>
                                                <td>{row.note}</td>
                                                <td>
                                                    <span className={`status ${row.status === "Đã hoàn thành" ? "completed" : "draft"}`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                            </tr>
                                            {expandedRow === row.id && (
                                                <tr className="detail-row">
                                                    <td colSpan="5">
                                                        <div className="detail-container">
                                                            <div className="detail-header">
                                                                <div className="detail-info">
                                                                    <div className="detail-item">
                                                                        <strong>Mã xuất hủy:</strong> {row.id}
                                                                    </div>
                                                                    <div className="detail-item">
                                                                        <strong>Trạng thái:</strong> {row.status}
                                                                    </div>
                                                                    <div className="detail-item">
                                                                        <strong>Thời gian:</strong> {row.time}
                                                                    </div>
                                                                    <div className="detail-item">
                                                                        <strong>Ghi chú:</strong> {row.note}
                                                                    </div>
                                                                    <div className="detail-item">
                                                                        <strong>Người xuất hủy:</strong>
                                                                        <input
                                                                            type="text"
                                                                            className="creator-input"
                                                                            value={detailData[row.id]?.creator || ""}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="detail-table-container">
                                                                <table className="detail-table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Mã hàng</th>
                                                                            <th>Tên hàng</th>
                                                                            <th>Số lượng hủy</th>
                                                                            <th>Giá vốn</th>
                                                                            <th>Giá trị hủy</th>
                                                                            <th>Lý do hủy</th> {/* New column for reason */}
                                                                            <th>Hình ảnh</th> {/* New column for image */}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {detailData[row.id]?.items.map((item, itemIndex) => (
                                                                            <tr key={itemIndex}>
                                                                                <td>{item.itemCode}</td>
                                                                                <td>{item.itemName}</td>
                                                                                <td>{item.quantity}</td>
                                                                                <td>{item.costPrice.toLocaleString()}</td>
                                                                                <td>{item.destructionValue.toLocaleString()}</td>
                                                                                <td>{item.reason}</td> {/* Display reason */}
                                                                                <td>
                                                                                    <img
                                                                                        src={item.image}
                                                                                        alt={item.itemName}
                                                                                        style={{ width: "50px", height: "50px", objectFit: "cover" }} // Style the image
                                                                                    />
                                                                                </td> {/* Display image */}
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                            <div className="detail-summary">
                                                                <div className="summary-item">
                                                                    <strong>Tổng số lượng hủy:</strong> {detailData[row.id]?.totalQuantity}
                                                                </div>
                                                                <div className="summary-item">
                                                                    <strong>Tổng giá trị hủy:</strong> {detailData[row.id]?.totalValue.toLocaleString()}
                                                                </div>
                                                            </div>

                                                            <div className="detail-actions">
                                                                <button className="action-btn open-btn">Mở phiếu</button>
                                                                {/* <button className="action-btn print-btn">In</button>
                                                                <button className="action-btn export-btn">Xuất file</button> */}
                                                                <button className="action-btn cancel-btn">Hủy</button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="pagination">
                        <span>Trang</span>
                    </div>
                </main>
            </div>
        </div>
    )
};
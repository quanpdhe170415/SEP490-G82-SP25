import React, { useState, useEffect } from "react";
import "./Css/GoodsDisposal.css"; 
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 

export default function GoodsDisposal() {
    const navigate = useNavigate();
    const [searchData, setSearchData] = useState({
        importCode: "",
        importer: "",
        startDate: "",
        endDate: "",
        statusFilters: {
            "Đã hoàn thành": false,
            "Phiếu tạm": false,
            "Đã hủy": false
        },
    });

    const [tableData, setTableData] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);
    const [detailData, setDetailData] = useState({});

    // Fetch data from API on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:9999/api/goods-disposal/list");
                if (response.data.success) {
                    // Map API data to tableData format
                    const mappedTableData = response.data.data.map((item) => ({
                        id: item._id,
                        disposal_number: item.disposal_number,
                        totalValue: item.total_disposal_value.toString(),
                        time: new Date(item.disposal_date).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        }),
                        note: item.reason_for_disposal,
                        status: item.status === "approved" ? "Đã hoàn thành" : item.status === "pending" ? "Phiếu tạm" : "Đã hủy",
                        importer: item.created_by.username,
                    }));
                    
                    // Map API data to detailData format
                    const mappedDetailData = response.data.data.reduce((acc, item) => {
                        acc[item.disposal_number] = {
                            items: item.items_summary.map((summary) => ({
                                itemCode: `ITEM-${Math.random().toString(36).substr(2, 9)}`,
                                itemName: summary.product_name,
                                quantity: summary.quantity_disposed,
                                costPrice: item.total_disposal_value / summary.quantity_disposed || 0,
                                destructionValue: item.total_disposal_value,
                                reason: item.reason_for_disposal,
                                barcode: summary.barcode,
                                image: "https://letsenhance.io/static/73136da51c245e80edc6c",
                            })),
                            creator: item.created_by.username,
                            totalQuantity: item.total_items,
                            totalValue: item.total_disposal_value,
                        };
                        return acc;
                    }, {});
                    
                    setTableData(mappedTableData);
                    setDetailData(mappedDetailData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (field, value) => {
        setSearchData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
   const handleOpenDisposal = (row) => {
    // console.log(row.id);
    
        navigate(`/goods-disposal-detail/${row.id}`);
    };
    // Handle status filter change
    const handleStatusChange = (status) => {
        setSearchData(prev => ({
            ...prev,
            statusFilters: {
                ...prev.statusFilters,
                [status]: !prev.statusFilters[status]
            }
        }));
    };

    // Handle reason filter change
    const handleReasonChange = (reason) => {
        setSearchData(prev => ({
            ...prev,
            reasonFilters: {
                ...prev.reasonFilters,
                [reason]: !prev.reasonFilters[reason]
            }
        }));
    };

    // Filter function similar to BillHistory
    const filterData = () => {
        let filtered = [...tableData];

        // Filter theo mã nhập
        if (searchData.importCode) {
            filtered = filtered.filter(item => 
                item.id.toLowerCase().includes(searchData.importCode.toLowerCase())
            );
        }

        // Filter theo người nhập
        if (searchData.importer) {
            filtered = filtered.filter(item => 
                item.importer.toLowerCase().includes(searchData.importer.toLowerCase())
            );
        }

        // Filter theo thời gian
        if (searchData.startDate) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.time.split(', ')[0].split('/').reverse().join('-'));
                const startDate = new Date(searchData.startDate);
                return itemDate >= startDate;
            });
        }

        if (searchData.endDate) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.time.split(', ')[0].split('/').reverse().join('-'));
                const endDate = new Date(searchData.endDate);
                return itemDate <= endDate;
            });
        }

        // Filter theo trạng thái (checkbox)
        const activeStatuses = Object.keys(searchData.statusFilters).filter(status => searchData.statusFilters[status]);
        if (activeStatuses.length > 0) {
            filtered = filtered.filter(item => activeStatuses.includes(item.status));
        }


        return filtered;
    };

    const filteredData = filterData();


    const handleExportFile = () => {
        console.log("Exporting file...");
    };

    const handleRowClick = (rowId) => {
        setExpandedRow(expandedRow === rowId ? null : rowId);
    };

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
                                    placeholder="Nhập mã xuất hủy"
                                />
                            </div>

                            <div className="form-group">
                                <label>Người nhập</label>
                                <input
                                    type="text"
                                    value={searchData.importer}
                                    onChange={(e) => handleInputChange("importer", e.target.value)}
                                    placeholder="Nhập tên người nhập"
                                />
                            </div>

                            <div className="form-group">
                                <label>Thời gian từ</label>
                                <input
                                    type="date"
                                    value={searchData.startDate}
                                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Đến</label>
                                <input
                                    type="date"
                                    value={searchData.endDate}
                                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                                />
                            </div>

                            {/* Status Filter with Checkboxes */}
                            <div className="form-group">
                                <label>Trạng thái</label>
                                <div className="checkbox-group">
                                    {Object.keys(searchData.statusFilters).map((status) => (
                                        <div key={status} className="checkbox-item">
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={searchData.statusFilters[status]}
                                                    onChange={() => handleStatusChange(status)}
                                                />
                                                <span>{status}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
                                    {filteredData.map((row, index) => (
                                        <React.Fragment key={row.id}>
                                            <tr onClick={() => handleRowClick(row.id)} className="table-row">
                                                <td>{row.disposal_number}</td>
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
                                                                        <strong>Người tạo phiếu:</strong>
                                                                        <input
                                                                            type="text"
                                                                            className="creator-input"
                                                                            value={detailData[row.id]?.creator || ""}
                                                                            readOnly
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
                                                                            <th>Lý do hủy</th>
                                                                            <th>Hình ảnh</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {detailData[row.id]?.items.map((item, itemIndex) => (
                                                                            <tr key={itemIndex}>
                                                                                <td>{item.barcode}</td>
                                                                                <td>{item.itemName}</td>
                                                                                <td>{item.quantity}</td>
                                                                                <td>{item.costPrice.toLocaleString()}</td>
                                                                                <td>{item.destructionValue.toLocaleString()}</td>
                                                                                <td>{item.reason}</td>
                                                                                <td>
                                                                                    <img
                                                                                        src={item.image}
                                                                                        alt={item.itemName}
                                                                                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                                                                    />
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                            <div className="detail-summary">
                                                                <div className="summary-item">
                                                                    <strong>Tổng số lượng hủy:</strong> {detailData[row.id]?.totalQuantity || 0}
                                                                </div>
                                                                <div className="summary-item">
                                                                    <strong>Tổng giá trị hủy:</strong> {detailData[row.id]?.totalValue.toLocaleString()}
                                                                </div>
                                                            </div>

                                                             {row.status === "Phiếu tạm" && (
                                                                <div className="detail-actions">
                                                                    <button 
                                                                        className="action-btn open-btn"
                                                                        onClick={() => handleOpenDisposal(row)}
                                                                    >
                                                                        Mở phiếu
                                                                    </button>
                                                                    <button className="action-btn cancel-btn">Hủy</button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* No Results Message */}
                        {filteredData.length === 0 && tableData.length > 0 && (
                            <div className="no-results">
                                <p>Không tìm thấy kết quả phù hợp với bộ lọc đã chọn.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="pagination">
                        <span>Trang</span>
                    </div>
                </main>
            </div>
        </div>
    );
};
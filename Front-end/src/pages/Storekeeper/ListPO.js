import React, { useState, useEffect } from 'react';
import './ListPO.css'; // File CSS không thay đổi
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faThumbtack, faCogs, faExclamationTriangle, faShippingFast, faTimes } from '@fortawesome/free-solid-svg-icons';

// --- Cấu hình API ---
const API_BASE_URL = 'http://localhost:9999/api/purchase-order'; // Thay đổi nếu cần

// --- Các hàm gọi API ---
const apiService = {
    // Lấy danh sách PO được giao
    getAssignedPOs: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/assigned`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId }),
        });
        if (!response.ok) throw new Error('Không thể tải danh sách đơn hàng.');
        return response.json();
    },
    // Lấy chi tiết một PO
    getPurchaseOrderDetail: async (poId) => {
        const response = await fetch(`${API_BASE_URL}/${poId}`);
        if (!response.ok) throw new Error('Không thể tải chi tiết đơn hàng.');
        return response.json();
    },
    // Ghim hoặc bỏ ghim PO
    togglePin: async (poId) => {
        const response = await fetch(`${API_BASE_URL}/${poId}/pin`, {
            method: 'PATCH',
        });
        if (!response.ok) throw new Error('Thao tác thất bại.');
        return response.json();
    }
};

const MainContent = () => {
    const [pos, setPOs] = useState([]);
    const [processedPOs, setProcessedPOs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeTab, setActiveTab] = useState('kanban-view');
    const [modalData, setModalData] = useState({ po: null, history: null, isLoading: false });
    const [sortConfig, setSortConfig] = useState({ key: 'id', order: 'asc' });
    const [filters, setFilters] = useState({
        upcoming: false,
        receiving: false,
        shortage: false,
        overage: false,
        completed: false
    });

    // Ánh xạ trạng thái từ API sang trạng thái của component
    const mapApiStatusToComponentStatus = (apiStatus) => {
        const statusMap = {
            pending_receipt: 'upcoming',
            partially_received: 'receiving',
            fully_received: 'completed',
            under_received: 'shortage',
            over_received: 'overage'
        };
        return statusMap[apiStatus] || 'unknown';
    };

    // Hàm chuyển đổi dữ liệu từ API sang cấu trúc component cần
    const transformApiDataToPO = (apiPO) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextReceiptDate = new Date(apiPO.expected_delivery_date);
        const diffTime = nextReceiptDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const isDeadlineWarning = diffDays <= 2 && diffDays >= 0;
        const overallStatus = mapApiStatusToComponentStatus(apiPO.status);
        let attentionReason = null;
        if (overallStatus === 'shortage') attentionReason = 'Thiếu';
        if (overallStatus === 'overage') attentionReason = 'Thừa';

        return {
            id: apiPO._id,
            poNumber: apiPO.order_number,
            supplier: apiPO.supplier_name,
            completedReceipts: apiPO.delivery_progress,
            totalReceipts: apiPO.total_expected_delivery,
            totalOrdered: apiPO.total_quantity_ordered,
            totalReceived: apiPO.total_quantity_received,
            overallStatus: overallStatus,
            pinned: apiPO.is_pinned,
            nextReceipt: { expectedDate: apiPO.expected_delivery_date },
            isDeadlineWarning: isDeadlineWarning,
            attentionReason: attentionReason
        };
    };

    // useEffect chính để tải và xử lý dữ liệu
    useEffect(() => {
        const loadPOs = async () => {
            try {
                setLoading(true);
                const userId = "6877186497cc45861f4f6bf8";
                const result = await apiService.getAssignedPOs(userId);
                if (result.success) {
                    const transformedPOs = result.data.map(transformApiDataToPO);
                    setPOs(transformedPOs);
                } else {
                    throw new Error(result.message || 'Lỗi không xác định từ API.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadPOs();
    }, []);

    // useEffect để xử lý lọc và sắp xếp
    useEffect(() => {
        let filteredPOs = [...pos];
        const activeFilters = Object.keys(filters).filter(key => filters[key]);
        if (activeFilters.length > 0) {
            filteredPOs = filteredPOs.filter(po => activeFilters.includes(po.overallStatus));
        }
        filteredPOs.sort((a, b) => {
            let valA = a[sortConfig.key];
            let valB = b[sortConfig.key];
            if (sortConfig.key === 'receipts') {
                valA = a.completedReceipts / a.totalReceipts;
                valB = b.completedReceipts / b.totalReceipts;
            }
            if (typeof valA === 'string') {
                return sortConfig.order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            return sortConfig.order === 'asc' ? valA - valB : valB - valA;
        });
        setProcessedPOs(filteredPOs);
    }, [pos, sortConfig, filters]);

    // Mở Modal và tải dữ liệu chi tiết
    const openModal = async (poId) => {
        setModalData({ po: null, history: null, isLoading: true });
        try {
            const detailResult = await apiService.getPurchaseOrderDetail(poId);
            if (detailResult.success) {
                setModalData({ po: detailResult.data.purchase_order, history: detailResult.data.import_history, isLoading: false });
            } else {
                throw new Error('Không thể tải chi tiết.');
            }
        } catch (err) {
            alert(err.message);
            setModalData({ po: null, history: null, isLoading: false });
        }
    };

    const closeModal = () => setModalData({ po: null, history: null, isLoading: false });

    // Ghim / Bỏ ghim với alert thành công
    const togglePin = async (poId) => {
        const originalPOs = [...pos];
        const poToToggle = originalPOs.find(p => p.id === poId);
        if (!poToToggle) return;
        const wasPinned = poToToggle.pinned;

        const updatedPOs = pos.map(p => p.id === poId ? { ...p, pinned: !p.pinned } : p);
        setPOs(updatedPOs);

        try {
            await apiService.togglePin(poId);
            alert(wasPinned ? 'Đã bỏ ghim thành công!' : 'Đã ghim thành công!');
        } catch (err) {
            alert('Thao tác thất bại, vui lòng thử lại.');
            setPOs(originalPOs);
        }
    };

    // --- Các hàm render ---
    const renderStatusBadge = (status) => {
        const statusMap = {
            shortage: { class: 'badge-shortage', text: 'Nhận thiếu' },
            overage: { class: 'badge-overage', text: 'Nhận thừa' },
            completed: { class: 'badge-completed', text: 'Hoàn thành' },
            receiving: { class: 'badge-receiving', text: 'Đang nhận' },
            upcoming: { class: 'badge-upcoming', text: 'Sắp nhận' },
        };
        const config = statusMap[status] || { class: '', text: status };
        return <span className={`status-badge ${config.class}`}>{config.text}</span>;
    };

    const handleSort = (key) => setSortConfig(prev => ({ key, order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc' }));
    const handleFilterChange = (filterName) => setFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));

    const renderBoard = () => {
        const columns = { pinned: [], receiving: [], attention: [], upcoming: [] };
        processedPOs.forEach(po => {
            if (po.overallStatus === 'completed' && !po.pinned) return;
            const card = (
                <div key={po.id} className={`kanban-card ${po.isDeadlineWarning ? 'deadline-warning' : ''}`} onClick={() => openModal(po.id)}>
                    <div className="card-header">
                        <p className="card-po-id">
                            {po.poNumber}
                            {po.attentionReason && <span className={`attention-reason ${po.overallStatus}`}>{` - ${po.attentionReason}`}</span>}
                        </p>
                        <button onClick={(e) => { e.stopPropagation(); togglePin(po.id); }} className={`pin-button ${po.pinned ? 'pinned' : ''}`}>
                            <FontAwesomeIcon icon={faThumbtack} />
                        </button>
                    </div>
                    <p className="card-supplier">{po.supplier}</p>
                    <div className="card-details">
                        <div className="card-stats">
                            <span>Đợt: <strong>{po.completedReceipts}/{po.totalReceipts}</strong></span>
                            <span>SL: <strong>{po.totalReceived}/{po.totalOrdered}</strong></span>
                        </div>
                        {po.nextReceipt && (
                            <div className="card-next-receipt">
                                Đợt tới: {new Date(po.nextReceipt.expectedDate).toLocaleDateString('vi-VN')}
                            </div>
                        )}
                    </div>
                </div>
            );
            if (po.pinned) columns.pinned.push(card);
            else if (po.attentionReason) columns.attention.push(card);
            else if (po.overallStatus === 'receiving') columns.receiving.push(card);
            else if (po.overallStatus === 'upcoming') columns.upcoming.push(card);
        });
        return columns;
    };

    const renderModalContent = () => {
        if (modalData.isLoading) return <div className="modal-loading">Đang tải dữ liệu...</div>;
        if (!modalData.po) return null;

        const { po, history } = modalData;

        return (
            <>
                <div className="modal-section">
                    <h3 className="modal-section-title">Thông tin về phiếu PO được giao</h3>
                    <div className="modal-grid-info">
                        <div><span>Mã PO:</span> <strong>{po.order_number}</strong></div>
                        <div><span>Nhà cung cấp:</span> <strong>{po.supplier_id.suplier_name}</strong></div>
                        <div><span>Người tạo:</span> <strong>{po.created_by.email}</strong></div>
                        <div><span>Người nhận:</span> <strong>{po.assigned_to.email}</strong></div>
                        <div><span>Ngày tạo:</span> <strong>{new Date(po.createdAt).toLocaleDateString('vi-VN')}</strong></div>
                    </div>
                </div>

                <div className="modal-section">
                    <h3 className="modal-section-title">Danh sách sản phẩm</h3>
                    <table className="po-table">
                        <thead>
                            <tr><th>Tên sản phẩm</th><th>Số lượng đặt</th></tr>
                        </thead>
                        <tbody>
                            {po.items.map(item => (
                                <tr key={item._id}>
                                    <td>{item.goods_id.goods_name}</td>
                                    <td className="cell-center">{item.quantity_order}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="modal-section">
                    <h3 className="modal-section-title">Các đợt nhập</h3>
                    {history && history.length > 0 ? (
                        <table className="po-table">
                            <thead><tr><th>Mã phiếu nhập</th><th>Ngày nhập</th><th>Ghi chú</th></tr></thead>
                            <tbody>
                                {history.map(batch => (
                                    <tr key={batch._id}>
                                        <td>{batch.import_receipt_number}</td>
                                        <td>{new Date(batch.import_date).toLocaleString('vi-VN')}</td>
                                        <td>{batch.notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (<p>Chưa có đợt nhập nào.</p>)}
                </div>
            </>
        );
    };

    if (loading) return <div className="full-page-feedback">Đang tải dữ liệu...</div>;
    if (error) return <div className="full-page-feedback">Lỗi: {error}</div>;

    const boardColumns = renderBoard();
    const columnConfig = [
        { key: 'pinned', title: 'Đã Ghim', icon: faThumbtack },
        { key: 'receiving', title: 'Đang nhận', icon: faCogs },
        { key: 'attention', title: 'Cần chú ý', icon: faExclamationTriangle },
        { key: 'upcoming', title: 'Sắp nhận', icon: faShippingFast }
    ];

    return (
        <main className="content-area">
            <h1 className="page-title">Danh sách đơn đặt hàng</h1>
            <div className="tabs-container">
                <div className={`tab-item ${activeTab === 'kanban-view' ? 'active' : ''}`} onClick={() => setActiveTab('kanban-view')}>Ghim</div>
                <div className={`tab-item ${activeTab === 'list-view' ? 'active' : ''}`} onClick={() => setActiveTab('list-view')}>Danh sách chi tiết</div>
            </div>

            {/* Kanban View */}
            <div className={`view-container ${activeTab === 'kanban-view' ? 'active' : ''}`}>
                <div className="kanban-board">
                    {columnConfig.map(({ key, title, icon }) => (
                        <div key={key} className={`kanban-column ${key}`}>
                            <div className="kanban-column-header">
                                <h3><FontAwesomeIcon icon={icon} className="column-icon" />{title}</h3>
                                <span className="count-badge">{boardColumns[key].length}</span>
                            </div>
                            <div className="kanban-cards">
                                {boardColumns[key].length > 0 ? boardColumns[key] : <p className="empty-column-message">Không có phiếu nào.</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* List View */}
            <div className={`view-container ${activeTab === 'list-view' ? 'active' : ''}`}>
                <div className="list-view-wrapper">
                    <div className="table-filters">
                        <span>Lọc theo:</span>
                        {Object.keys(filters).map(filterKey => {
                            const filterTextMap = { upcoming: 'Sắp nhận', receiving: 'Đang nhận', shortage: 'Thiếu', overage: 'Thừa', completed: 'Hoàn thành' };
                            return (<label key={filterKey} className="filter-checkbox"><input type="checkbox" checked={filters[filterKey]} onChange={() => handleFilterChange(filterKey)} />{filterTextMap[filterKey]}</label>);
                        })}
                    </div>
                    <div className="table-scroll-container">
                        <table className="po-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th onClick={() => handleSort('poNumber')}>Mã PO</th>
                                    <th onClick={() => handleSort('supplier')}>Nhà cung cấp</th>
                                    <th onClick={() => handleSort('receipts')}>Đợt</th>
                                    <th onClick={() => handleSort('totalOrdered')}>Tổng SL Đặt</th>
                                    <th onClick={() => handleSort('totalReceived')}>SL Đã Nhận</th>
                                    <th onClick={() => handleSort('overallStatus')}>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedPOs.length > 0 ? processedPOs.map((po, index) => (
                                    <tr key={po.id} className={po.isDeadlineWarning && po.overallStatus !== 'completed' ? 'deadline-warning-row' : ''}>
                                        <td className="cell-center">{index + 1}</td>
                                        <td className="po-id-cell">{po.poNumber}</td>
                                        <td>{po.supplier}</td>
                                        <td className="cell-center">{po.completedReceipts} / {po.totalReceipts}</td>
                                        <td className="cell-center">{po.totalOrdered}</td>
                                        <td className="cell-center received-qty-cell">{po.totalReceived}</td>
                                        <td>{renderStatusBadge(po.overallStatus)}</td>
                                        <td className="cell-center">
                                            <button onClick={() => openModal(po.id)} className="action-button" title="Xem chi tiết">
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>
                                            <button onClick={() => togglePin(po.id)} className={`action-button pin-button ${po.pinned ? 'pinned' : ''}`} title={po.pinned ? 'Bỏ ghim' : 'Ghim'}>
                                                <FontAwesomeIcon icon={faThumbtack} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (<tr><td colSpan="8" className="empty-table-message">Không có dữ liệu phù hợp.</td></tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {(modalData.po || modalData.isLoading) && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{modalData.po ? `Chi tiết Phiếu Nhập: ${modalData.po.order_number}` : 'Đang tải...'}</h2>
                            <button onClick={closeModal} className="close-modal-button"><FontAwesomeIcon icon={faTimes} /></button>
                        </div>
                        <div className="modal-body">{renderModalContent()}</div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default MainContent;
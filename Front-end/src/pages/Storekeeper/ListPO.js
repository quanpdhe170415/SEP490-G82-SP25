import React, { useState, useEffect } from 'react';
import './ListPO.css'; // Đảm bảo file CSS này chứa nội dung được cung cấp
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack, faTimes, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

// --- Cấu hình API ---
const API_BASE_URL = 'http://localhost:9999/api';

// --- Các hàm gọi API ---
const apiService = {
    getAssignedTasks: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/receive`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId }),
        });
        if (!response.ok) throw new Error('Không thể tải danh sách công việc.');
        return response.json();
    },
};

const MainContent = () => {
    const [tasks, setTasks] = useState([]);
    const [processedTasks, setProcessedTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeTab, setActiveTab] = useState('kanban-view');
    
    // --- State mới cho bộ lọc của List View ---
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    
    // --- CÁC HÀM XỬ LÝ DỮ LIỆU ĐÃ ĐƯỢC CẬP NHẬT ---

    // Chuyển đổi dữ liệu và xác định trạng thái
    const transformApiDataToTask = (apiTask) => {
        const today = new Date();
        const expectedDate = new Date(apiTask.expected_date);
        
        const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const expectedDateOnly = new Date(expectedDate.getFullYear(), expectedDate.getMonth(), expectedDate.getDate());

        let status;
        if (apiTask.status === 'issue') {
            status = 'issue';
        } else if (apiTask.status === 'completed') {
            status = 'completed';
        } else if (apiTask.status === 'in_progress') {
            status = 'receiving';
        } else if (apiTask.status === 'pending') {
            if (expectedDateOnly > todayDateOnly) {
                status = 'upcoming';
            } else {
                status = 'receiving';
            }
        } else if (expectedDateOnly < todayDateOnly) {
            status = 'overdue';
        } else {
            status = 'receiving';
        }
        
        const diffDays = Math.ceil((expectedDate - today) / (1000 * 60 * 60 * 24));
        const isDeadlineWarning = diffDays <= 2 && diffDays >= 0 && status !== 'completed' && status !== 'issue';

        return {
            id: apiTask._id,
            taskName: apiTask.task_name,
            poCode: apiTask.purchase_order.po_code, // Thêm PO Code
            supplier: apiTask.purchase_order.supplier.suplier_name,
            overallStatus: status,
            expectedDate: apiTask.expected_date,
            isDeadlineWarning: isDeadlineWarning,
            totalQuantityExpected: apiTask.total_quantity_expected,
            totalQuantityReceived: apiTask.total_quantity_received,
        };
    };

    useEffect(() => {
        const loadTasks = async () => {
            try {
                setLoading(true);
                const userId = "687e00edd4fc567f47717721"; // Ví dụ userId
                const result = await apiService.getAssignedTasks(userId);
                if (result.data) {
                    const transformedTasks = result.data.map(transformApiDataToTask);
                    setTasks(transformedTasks);
                } else {
                    throw new Error(result.message || 'Lỗi không xác định từ API.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadTasks();
    }, []);

    // Lọc và sắp xếp dữ liệu cho cả hai view
    useEffect(() => {
        let processed = [...tasks];

        if (activeTab === 'kanban-view') {
            const kanbanStatuses = ['upcoming', 'receiving', 'issue'];
            processed = processed.filter(task => kanbanStatuses.includes(task.overallStatus));
        } else { // activeTab === 'list-view'
            // 1. Lọc theo thanh tìm kiếm
            if (searchTerm) {
                processed = processed.filter(task =>
                    task.taskName.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            // 2. Lọc theo dropdown trạng thái
            if (statusFilter !== 'all') {
                processed = processed.filter(task => task.overallStatus === statusFilter);
            }
            // 3. Sắp xếp theo thứ tự ưu tiên
            const statusOrder = {
                receiving: 1,
                upcoming: 2,
                issue: 3,
                completed: 4,
                overdue: 5,
            };
            processed.sort((a, b) => {
                const orderA = statusOrder[a.overallStatus] || 99;
                const orderB = statusOrder[b.overallStatus] || 99;
                if (orderA !== orderB) {
                    return orderA - orderB;
                }
                return new Date(a.expectedDate) - new Date(b.expectedDate);
            });
        }

        setProcessedTasks(processed);
    }, [tasks, searchTerm, statusFilter, activeTab]);
    
    // --- CÁC COMPONENT VÀ HÀM HỖ TRỢ ---

    const getStatusTitle = (status) => {
        switch (status) {
            case "issue": return "Có vấn đề";
            case "upcoming": return "Sắp nhận";
            case "receiving": return "Đang nhận";
            case "overdue": return "Quá hạn";
            case "completed": return "Đã hoàn tất";
            default: return "Không xác định";
        }
    };

    const TaskCard = ({ item }) => {
        return (
            <div className={`task-card status-${item.overallStatus}`}>
                <div className="card-header">
                    <span className="card-title">{item.taskName}</span>
                    {item.isDeadlineWarning && <span className="card-warning-icon">⚠️</span>}
                </div>
                <div className="card-body">
                    <p className="card-po-code">PO: {item.poCode}</p>
                    <p className="card-supplier">{item.supplier}</p>
                    <p className="card-date">
                        Ngày nhận: {new Date(item.expectedDate).toLocaleDateString('vi-VN')}
                    </p>
                </div>
            </div>
        );
    };

    const KanbanColumn = ({ status, items }) => {
        return (
            <div className="kanban-column">
                <div className={`kanban-header status-${status}`}>
                    <h3>{getStatusTitle(status)}</h3>
                    <span className="kanban-count">{items.length}</span>
                </div>
                <div className="kanban-cards-container">
                    {items.length > 0 ? (
                        items.map((item) => <TaskCard key={item.id} item={item} />)
                    ) : (
                        <p className="empty-column-message">Không có công việc nào.</p>
                    )}
                </div>
            </div>
        );
    };

    const groupTasksByStatus = () => {
        const groups = { upcoming: [], receiving: [], issue: [] };
        processedTasks.forEach((item) => {
            if (groups.hasOwnProperty(item.overallStatus)) {
                groups[item.overallStatus].push(item);
            }
        });
        Object.keys(groups).forEach((status) => {
            groups[status].sort((a, b) => new Date(a.expectedDate) - new Date(b.expectedDate));
        });
        return groups;
    };

    const groupedTasks = groupTasksByStatus();

    const renderStatusBadge = (status) => {
        const statusMap = {
            issue: { class: 'badge-issue', text: 'Có vấn đề' },
            upcoming: { class: 'badge-upcoming', text: 'Sắp nhận' },
            receiving: { class: 'badge-receiving', text: 'Đang nhận' },
            completed: { class: 'badge-completed', text: 'Hoàn thành' },
            overdue: { class: 'badge-overdue', text: 'Quá hạn' },
        };
        const config = statusMap[status] || { class: '', text: status };
        return <span className={`status-badge ${config.class}`}>{config.text}</span>;
    };
    
    const handleViewDetails = (taskId) => {
        alert(`Xem chi tiết công việc: ${taskId}`);
    };

    if (loading) return <div className="full-page-feedback">Đang tải dữ liệu...</div>;
    if (error) return <div className="full-page-feedback">Lỗi: {error}</div>;

    return (
        <main className="content-area">
            <h1 className="page-title">Danh sách Công việc Nhận hàng</h1>
            <div className="tabs-container">
                <div className={`tab-item ${activeTab === 'kanban-view' ? 'active' : ''}`} onClick={() => setActiveTab('kanban-view')}>Bảng công việc</div>
                <div className={`tab-item ${activeTab === 'list-view' ? 'active' : ''}`} onClick={() => setActiveTab('list-view')}>Danh sách chi tiết</div>
            </div>

            {/* Kanban View */}
            <div className={`view-container ${activeTab === 'kanban-view' ? 'active' : ''}`}>
                <div className="kanban-board">
                    <KanbanColumn status="receiving" items={groupedTasks.receiving} />
                    <KanbanColumn status="upcoming" items={groupedTasks.upcoming} />
                    <KanbanColumn status="issue" items={groupedTasks.issue} />
                </div>
            </div>

            {/* List View (Đã cập nhật) */}
            <div className={`view-container ${activeTab === 'list-view' ? 'active' : ''}`}>
                <div className="list-view-wrapper">
                    <div className="table-controls">
                        <input
                            type="text"
                            placeholder="Tìm theo tên công việc..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="status-dropdown"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="receiving">Đang nhận</option>
                            <option value="upcoming">Sắp nhận</option>
                            <option value="issue">Có vấn đề</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="overdue">Quá hạn</option>
                        </select>
                    </div>
                    <div className="table-scroll-container">
                        <table className="po-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên công việc</th>
                                    <th>Nhà cung cấp</th>
                                    <th>SL Đặt</th>
                                    <th>SL Nhận</th>
                                    <th>Ngày dự kiến</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedTasks.length > 0 ? processedTasks.map((task, index) => (
                                    <tr key={task.id} className={`status-row-${task.overallStatus}`}>
                                        <td className="cell-center">{index + 1}</td>
                                        <td>{task.taskName}</td>
                                        <td>{task.supplier}</td>
                                        <td className="cell-center">{task.totalQuantityExpected}</td>
                                        <td className="cell-center">{task.totalQuantityReceived}</td>
                                        <td className="cell-center">{new Date(task.expectedDate).toLocaleDateString('vi-VN')}</td>
                                        <td>{renderStatusBadge(task.overallStatus)}</td>
                                        <td className="cell-center">
                                            <button className="action-button" onClick={() => handleViewDetails(task.id)}>
                                                Xem
                                            </button>
                                        </td>
                                    </tr>
                                )) : (<tr><td colSpan="8" className="empty-table-message">Không có dữ liệu phù hợp.</td></tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default MainContent;

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faThumbtack, 
    faTimes, 
    faCheckCircle, 
    faExclamationTriangle, 
    faTruckLoading, 
    faBoxesStacked,
    faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import './DashboardSK.css'; // Import tệp CSS riêng

// Dữ liệu mẫu - trong ứng dụng thực tế, dữ liệu này sẽ được lấy từ API
const tasksData = {
    '2025-07-21': [{ type: 'receipt', title: 'Nhập hàng Redbull', code: 'PN12345', status: 'completed', progress: 100 }, { type: 'inventory', title: 'Kiểm kho khu A1', code: 'KK9981', status: 'completed', progress: 100 }],
    '2025-07-22': [{ type: 'inventory', title: 'Kiểm kê kho khu B', code: 'KK9982', status: 'pending', progress: 40 }, { type: 'receipt', title: 'Nhập hàng Coca', code: 'PN12346', status: 'pending', progress: 0 }, { type: 'disposal', title: 'Xuất hủy lô 5501', code: 'XH5501', status: 'pending' }],
    '2025-07-23': [{ type: 'disposal', title: 'Xuất hàng cho siêu thị', code: '#DH-789', status: 'pending' }],
    '2025-07-25': [{ type: 'inventory', title: 'Kiểm kho tổng', code: 'KK9983', status: 'pending', progress: 0 }],
    '2025-07-28': [{ type: 'receipt', title: 'Nhập hàng Pepsi', code: 'PN12347', status: 'pending', progress: 0 }],
};

// Ánh xạ loại công việc với biểu tượng tương ứng
const iconMap = {
    receipt: faTruckLoading,
    disposal: faTimes, // Sử dụng icon faTimes theo yêu cầu
    inventory: faBoxesStacked
};

export default function DashboardSK() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [weekInfo, setWeekInfo] = useState({ title: '', days: [] });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    useEffect(() => {
        const startOfWeek = new Date(currentDate);
        const dayOfWeek = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Bắt đầu từ thứ 2
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0,0,0,0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const title = `Tuần: ${startOfWeek.toLocaleDateString('vi-VN')} - ${endOfWeek.toLocaleDateString('vi-VN')}`;
        
        const days = Array.from({ length: 7 }).map((_, i) => {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            const dayKey = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
            return {
                date: day,
                isToday: day.getTime() === today.getTime(),
                tasks: tasksData[dayKey] || []
            };
        });

        setWeekInfo({ title, days });
    }, [currentDate]);

    const handleSetWeek = (offset) => {
        if (offset === 0) {
            setCurrentDate(new Date());
        } else {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + (offset * 7));
            setCurrentDate(newDate);
        }
    };

    return (
        <main className="dashboardSK-container flex-grow-1 p-4 overflow-auto">
            {/* Summary Cards */}
            <div className="row g-4 mb-5">
                <div className="col-12 col-md-4">
                    <div className="card d-flex flex-row align-items-center gap-4">
                        <div className="p-3 bg-primary-subtle rounded-3">
                            <FontAwesomeIcon icon={faThumbtack} className="fs-4 text-primary" />
                        </div>
                        <div><p className="fs-2 fw-bold text-dark mb-0">3</p><p className="text-muted mb-0">Công việc hôm nay</p></div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card d-flex flex-row align-items-center gap-4 border-2 border-warning">
                        <div className="p-3 bg-warning-subtle rounded-3">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="fs-4 text-warning" />
                        </div>
                        <div><p className="fs-2 fw-bold text-warning mb-0">1</p><p className="text-muted mb-0">Công việc tồn đọng</p></div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card d-flex flex-row align-items-center gap-4">
                        <div className="p-3 bg-success-subtle rounded-3">
                            <FontAwesomeIcon icon={faCheckCircle} className="fs-4 text-success" />
                        </div>
                        <div><p className="fs-2 fw-bold text-dark mb-0">2</p><p className="text-muted mb-0">Việc đã xong (tuần này)</p></div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="row g-4">
                {/* Calendar */}
                <div className="col-lg-8">
                    <div className="card h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="fs-5 fw-bold text-dark mb-0">{weekInfo.title}</h2>
                            <div className="d-flex align-items-center gap-2">
                                <button onClick={() => handleSetWeek(-1)} className="btn btn-secondary">&lt;</button>
                                <button onClick={() => handleSetWeek(0)} className="btn btn-gradient btn-sm">Tuần này</button>
                                <button onClick={() => handleSetWeek(1)} className="btn btn-secondary">&gt;</button>
                            </div>
                        </div>
                        <div className="row g-1">
                            {weekInfo.days.map(({ date, isToday, tasks }) => (
                                <div key={date.toISOString()} className="col">
                                    <h4 className="fw-bold text-center text-secondary pb-2 mb-2 fs-6 calendar-day-header">
                                        {date.toLocaleDateString('vi-VN', { weekday: 'short' }).toUpperCase()}
                                        <span className="d-block small fw-normal text-muted mt-1">{date.getDate()}/{date.getMonth() + 1}</span>
                                    </h4>
                                    <div className={`calendar-day-content ${isToday ? 'today' : ''}`}>
                                        {tasks.map(task => (
                                            <div key={task.code} className={`task-card task-${task.type} ${task.status === 'completed' ? 'completed' : ''}`}>
                                                <h5>
                                                    <FontAwesomeIcon icon={iconMap[task.type]} className="me-2" />
                                                    {task.title}
                                                    {task.status === 'completed' && <FontAwesomeIcon icon={faCheckCircle} className="text-success ms-2" />}
                                                </h5>
                                                <p className="mb-0 small">{task.code}</p>
                                                {task.progress !== undefined && (
                                                    <div className={`progress mt-2 progress-sm ${task.type === 'receipt' ? 'progress-receipt' : 'progress-inventory'}`} style={{height: '6px'}}>
                                                        <div className="progress-bar" role="progressbar" style={{ width: `${task.progress}%` }} aria-valuenow={task.progress} aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Task Lists */}
                <div className="col-lg-4">
                    <div className="d-flex flex-column gap-4">
                        {/* Overdue Tasks */}
                        <div className="card">
                            <h3 className="fs-5 fw-bold text-dark mb-4 d-flex align-items-center">
                                <FontAwesomeIcon icon={faExclamationCircle} className="text-warning me-3" /> Việc tồn đọng
                            </h3>
                            <div className="bg-warning-subtle border border-warning-subtle rounded-3 p-3">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h4 className="fw-semibold fs-6 text-dark mb-1">
                                            <FontAwesomeIcon icon={faBoxesStacked} className="me-2" />Kiểm kê kho khu B
                                        </h4>
                                        <p className="small text-muted mb-0">Đã bắt đầu, cần hoàn thành.</p>
                                    </div>
                                    <button className="btn btn-gradient btn-sm flex-shrink-0">Tiếp tục</button>
                                </div>
                                <div className="mt-3">
                                    <div className="d-flex justify-content-between small text-dark mb-1">
                                        <span>Tiến độ</span><span>40%</span>
                                    </div>
                                    <div className="progress progress-inventory" style={{height: '8px'}}>
                                        <div className="progress-bar" style={{ width: '40%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Today's Tasks */}
                        <div className="card">
                            <h3 className="fs-5 fw-bold text-dark mb-4 d-flex align-items-center">
                                <FontAwesomeIcon icon={faThumbtack} className="text-primary me-3" />Việc cần làm trong ngày
                            </h3>
                            <div className="d-flex flex-column gap-4">
                                <div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h4 className="fw-semibold text-dark mb-0 fs-6">
                                            <FontAwesomeIcon icon={faTruckLoading} className="me-2 text-secondary" />Nhập hàng Coca
                                        </h4>
                                        <button className="btn btn-gradient btn-sm px-3">Bắt đầu</button>
                                    </div>
                                    <div className="mt-3">
                                        <div className="d-flex justify-content-between small text-muted mb-1">
                                            <span>Tiến độ</span><span>0%</span>
                                        </div>
                                        <div className="progress progress-receipt" style={{height: '8px'}}>
                                            <div className="progress-bar" style={{ width: '0%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="my-1"/>
                                <div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h4 className="fw-semibold text-dark mb-0 fs-6">
                                            <FontAwesomeIcon icon={faTimes} className="me-2 text-secondary" />Xuất hủy lô 5501
                                        </h4>
                                        <button className="btn btn-gradient btn-sm px-3">Bắt đầu</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

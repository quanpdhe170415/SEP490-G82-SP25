import React, { useState } from 'react';
import SidebarWH from '../components/common/Sidebar_wh';
import HeaderWH from '../components/common/Header_wh';

import ListMyPO from './Storekeeper/ListPO';

export default function Page() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="d-flex" style={{ height: '100vh' }}>
            {/* Sidebar */}
            <SidebarWH 
                isCollapsed={isCollapsed} 
                onToggle={toggleSidebar} 
            />
            
            {/* Main Content Area */}
            <div 
                className="flex-grow-1 d-flex flex-column"
                style={{ 
                    marginLeft: isCollapsed ? '70px' : '280px',
                    transition: 'margin-left 0.3s ease-in-out'
                }}
            >
                {/* Header */}
                <HeaderWH onSidebarToggle={toggleSidebar} />
                
                {/* Main Content */}
                <main className="flex-grow-1 p-4 overflow-auto bg-light">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <h1 className="h3 mb-4">Chào mừng đến với Dashboard Kho Hàng</h1>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="card bg-primary text-white">
                                                    <div className="card-body">
                                                        <h5 className="card-title">Tổng số lượng hàng</h5>
                                                        <p className="card-text display-4">1,234</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="card bg-success text-white">
                                                    <div className="card-body">
                                                        <h5 className="card-title">Hàng nhập hôm nay</h5>
                                                        <p className="card-text display-4">56</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="card bg-warning text-white">
                                                    <div className="card-body">
                                                        <h5 className="card-title">Hàng xuất hôm nay</h5>
                                                        <p className="card-text display-4">78</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <h4>Thông tin chi tiết</h4>
                                            <p>Đây là khu vực nội dung chính của trang. Bạn có thể thay thế phần này bằng các component hoặc nội dung cụ thể cho từng trang.</p>
                                            <p>Sidebar có thể thu gọn/mở rộng bằng cách nhấn nút menu trên header.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ListMyPO/>

                </main>
            </div>
        </div>
    );
}
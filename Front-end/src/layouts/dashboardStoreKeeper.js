import React, { useState } from 'react';
import SidebarWH from '../components/common/Sidebar_wh';
import HeaderWH from '../components/common/Header_wh';
import DashboardSK from '../pages/DashboardStoreKeeper/DashboardSK';
export default function DashboardStoreKeeper() {
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
                    <DashboardSK />
                </main>
            </div>
        </div>
    );
}
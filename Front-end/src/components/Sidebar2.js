import React, { useState } from 'react';

// --- Mock Components for Demonstration ---
// In your real application, you would import your actual components.
import BillHistoryPage from './BillHistoryPage';
import POS from './POS';
import HomeForCashier from './HomeforCashier';
const CashierSidebar = () => {
    // State to track which component is active
    const [activeComponent, setActiveComponent] = useState('home');
    // State to track if the sidebar is collapsed
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Menu items definition
    const menuItems = [
        { id: 'home', label: 'Trang chủ', icon: '🏠' },
        { id: 'POS', label: 'Bán hàng', icon: '🛒' },
        { id: 'billHistory', label: 'Lịch sử hóa đơn', icon: '📋' },
        { id: 'closeShift', label: 'Đóng ca', icon: '🚪' },
    ];

    // Function to render the corresponding component
    const renderComponent = () => {
        switch (activeComponent) {
            case 'billHistory':
                return <BillHistoryPage />;
            case 'POS':
                return <POS />;
            case 'home':
                return <HomeForCashier />;
            case 'closeShift':
                return (
                    <div className="bg-white rounded-lg shadow-md p-6 h-full">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Đóng ca</h2>
                        <p className="text-gray-600">Chức năng đóng ca sẽ được hiển thị ở đây.</p>
                    </div>
                );
            default:
                return <HomeForCashier />;
        }
    };

    // Function to handle menu item clicks
    const handleMenuClick = (component) => {
        setActiveComponent(component);
    };

    // Toggle sidebar collapse state
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };
    
    // --- Inline Styles for the Sidebar (from Sidebar2 example) ---
    // Using inline styles makes the component self-contained and easy to manage.
    const sidebarStyles = {
        container: {
            display: 'flex',
            fontFamily: 'system-ui, sans-serif',
            background: '#f0f2f5', // A light background for the whole page
            minHeight: '100vh',
            padding: '20px',
        },
        sidebar: {
            background: "white",
            borderRadius: "12px",
            padding: "1rem",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            height: "calc(100vh - 40px)",
            position: "sticky",
            top: "20px",
            width: isCollapsed ? "80px" : "240px",
            transition: "width 0.3s ease-in-out",
            display: "flex",
            flexDirection: "column",
            alignItems: isCollapsed ? "center" : "stretch",
        },
        menuToggleButton: {
            background: "transparent",
            color: "#666",
            border: "2px solid #e0e0e0",
            borderRadius: "8px",
            width: isCollapsed ? '48px' : '100%',
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            marginBottom: "1.5rem",
            fontSize: "20px",
            transition: "all 0.3s ease",
        },
        sidebarNav: {
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            flex: 1,
        },
        menuItem: {
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.8rem",
            textDecoration: "none",
            color: "#4a5568", // Gray-700
            fontWeight: "500",
            borderRadius: "8px",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
            cursor: 'pointer',
            justifyContent: isCollapsed ? "center" : "flex-start",
        },
        menuItemActive: {
            background: "#4299e1", // Blue-400
            color: "white",
        },
        menuItemIcon: {
            fontSize: "1.25rem",
            minWidth: '24px', // Ensure icon alignment
            textAlign: 'center',
        },
        menuItemLabel: {
            opacity: isCollapsed ? 0 : 1,
            transition: "opacity 0.2s ease-in-out",
            fontSize: "14px",
            // To prevent the label from wrapping and causing layout shifts during transition
            width: isCollapsed ? 0 : 'auto',
            overflow: 'hidden',
        },
        sidebarFooter: {
            marginTop: "auto",
            paddingTop: '1rem',
            borderTop: '1px solid #e2e8f0', // Gray-200
        },
        sidebarAvatar: {
            width: "40px",
            height: "40px",
            background: "#4299e1", // Blue-400
            color: "white",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "600",
            margin: "0 auto",
            flexShrink: 0,
        },
        mainContent: {
            flex: 1,
            marginLeft: '20px',
        }
    };


    return (
        <div style={sidebarStyles.container}>
            {/* Sidebar */}
            <div style={sidebarStyles.sidebar}>
                 <div className="mb-4 text-center" style={{display: isCollapsed ? 'none' : 'block'}}>
                    <img src="https://placehold.co/50x50/4299e1/white?text=HC" alt="logo" className="mb-2 rounded-full mx-auto" />
                    <div className="font-bold text-gray-800">Tạp hóa Hải Chi</div>
                </div>

                <button
                    style={sidebarStyles.menuToggleButton}
                    onClick={toggleSidebar}
                    title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
                >
                    {isCollapsed ? "✕" : "☰"}
                </button>

                {/* Navigation Menu */}
                <nav style={sidebarStyles.sidebarNav}>
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                ...sidebarStyles.menuItem,
                                ...(activeComponent === item.id ? sidebarStyles.menuItemActive : {}),
                            }}
                            onClick={() => handleMenuClick(item.id)}
                            title={isCollapsed ? item.label : ""}
                        >
                            <span style={sidebarStyles.menuItemIcon}>{item.icon}</span>
                            <span style={sidebarStyles.menuItemLabel}>{item.label}</span>
                        </div>
                    ))}
                </nav>

                {/* Avatar / Footer */}
                <div style={sidebarStyles.sidebarFooter}>
                    <div style={sidebarStyles.sidebarAvatar} title="Tài khoản">
                       A
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={sidebarStyles.mainContent}>
                {renderComponent()}
            </div>
        </div>
    );
};

// The main App component to render our CashierSidebar
function App() {
  return <CashierSidebar />;
}

export default App;

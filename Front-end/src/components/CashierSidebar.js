import React, { useState } from 'react';
import BillHistoryPage from './BillHistoryPage';
import POS from './POS';
import HomeForCashier from './HomeforCashier';
const CashierSidebar = () => {
    // State để track component nào đang active
    const [activeComponent, setActiveComponent] = useState('billHistory');

    // Function để render component tương ứng
    const renderComponent = () => {
        switch (activeComponent) {
            case 'billHistory':
                return <BillHistoryPage />;
            case 'POS':
                return <POS />;
            case 'home':
                return <HomeForCashier />;
            case 'closeShift':
                return <div className="p-4"><h3>Close Shift Component</h3><p>Close shift functionality will be implemented here.</p></div>;
            default:
                return <HomeForCashier />;
        }
    };

    // Function để handle click button
    const handleButtonClick = (component) => {
        setActiveComponent(component);
    };

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className="bg-white border-end p-3 d-flex flex-column" style={{ width: 180 }}>
                <div className="mb-4 text-center">
                    <img src="https://via.placeholder.com/40" alt="logo" className="mb-2" />
                    <div className="fw-bold">Tạp hóa Hải Chi</div>
                </div>

                {/* Navigation buttons */}
                <div className="nav flex-column gap-2">
                    <button
                        className={`btn btn-sm ${activeComponent === 'home' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => handleButtonClick('home')}
                    >
                        Trang chủ
                    </button>
                    <button
                        className={`btn btn-sm ${activeComponent === 'POS' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => handleButtonClick('POS')}
                    >
                        Bán hàng
                    </button>
                    <button
                        className={`btn btn-sm ${activeComponent === 'billHistory' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => handleButtonClick('billHistory')}
                    >
                        Lịch sử hóa đơn
                    </button>


                    <button
                        className={`btn btn-sm ${activeComponent === 'closeShift' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => handleButtonClick('closeShift')}
                    >
                        Đóng ca
                    </button>
                </div>

                {/* Avatar */}
                <div className="mt-auto text-center">
                    <img src="https://via.placeholder.com/32" alt="avatar" className="rounded-circle" />
                </div>
            </div>

            {/* Main Content - Render component based on activeComponent */}
            <div className="p-3 flex-grow-1">
                {renderComponent()}
            </div>
        </div>
    );
};

export default CashierSidebar;
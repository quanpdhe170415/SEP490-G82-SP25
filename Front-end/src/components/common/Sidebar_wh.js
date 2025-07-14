export default function SidebarWH({ isCollapsed, onToggle }) {
  const menuItems = {
    main: [
      {
        title: "Tổng quan",
        url: "/",
        icon: "🏠",
      },
    ],
    nhapKho: [
      {
        title: "Phiếu nhập kho",
        url: "/nhap-kho/phieu-nhap",
        icon: "📦",
      },
      {
        title: "Kiểm tra hàng nhập",
        url: "/nhap-kho/kiem-tra",
        icon: "✅",
      },
      {
        title: "Xếp hàng vào kho",
        url: "/nhap-kho/xep-hang",
        icon: "📋",
      },
    ],
    xuatKho: [
      {
        title: "Xuất ra kệ bán",
        url: "/xuat-kho/xuat-ban",
        icon: "🛒",
      },
      {
        title: "Xuất hủy",
        url: "/xuat-kho/xuat-huy",
        icon: "🗑️",
        isActive: true,
      },
    ],
    tonKho: [
      {
        title: "Kiểm kê kho",
        url: "/ton-kho/kiem-ke",
        icon: "📊",
      },
      {
        title: "Lịch sử kiểm kê",
        url: "/ton-kho/lich-su",
        icon: "📅",
      },
      {
        title: "Tra cứu tồn kho",
        url: "/ton-kho/tra-cuu",
        icon: "🔍",
      },
    ],
  }

  return (
    <div 
      className={`position-fixed top-0 start-0 h-100 bg-light border-end transition-all`}
      style={{ 
        width: isCollapsed ? '70px' : '280px', 
        zIndex: 1040,
        transition: 'width 0.3s ease-in-out'
      }}
    >
      {/* Header */}
      <div className="p-3 border-bottom">
        <div className="d-flex align-items-center">
          <div className="bg-success text-white rounded d-flex align-items-center justify-content-center me-2" 
               style={{ width: '32px', height: '32px' }}>
            📦
          </div>
          {!isCollapsed && (
            <h5 className="mb-0 fw-bold">Kho Hàng</h5>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-grow-1 overflow-auto" style={{ height: 'calc(100vh - 140px)' }}>
        {/* Main Navigation */}
        <div className="p-3">
          <ul className="list-unstyled">
            {menuItems.main.map((item) => (
              <li key={item.title} className="mb-1">
                <a 
                  href={item.url} 
                  className="d-flex align-items-center text-decoration-none text-dark p-2 rounded"
                  style={{ transition: 'background-color 0.2s' }}
                  title={isCollapsed ? item.title : ''}
                >
                  <span className="me-2">{item.icon}</span>
                  {!isCollapsed && <span>{item.title}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Nhập Kho Section */}
        <div className="px-3">
          {!isCollapsed && (
            <h6 className="text-muted text-uppercase fw-bold mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              NHẬP KHO
            </h6>
          )}
          <ul className="list-unstyled">
            {menuItems.nhapKho.map((item) => (
              <li key={item.title} className="mb-1">
                <a 
                  href={item.url} 
                  className="d-flex align-items-center text-decoration-none text-dark p-2 rounded"
                  style={{ transition: 'background-color 0.2s' }}
                  title={isCollapsed ? item.title : ''}
                >
                  <span className="me-2">{item.icon}</span>
                  {!isCollapsed && <span>{item.title}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Xuất Kho Section */}
        <div className="px-3">
          {!isCollapsed && (
            <h6 className="text-muted text-uppercase fw-bold mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              XUẤT KHO
            </h6>
          )}
          <ul className="list-unstyled">
            {menuItems.xuatKho.map((item) => (
              <li key={item.title} className="mb-1">
                <a 
                  href={item.url} 
                  className={`d-flex align-items-center text-decoration-none p-2 rounded ${
                    item.isActive ? 'bg-primary text-white' : 'text-dark'
                  }`}
                  style={{ transition: 'background-color 0.2s' }}
                  title={isCollapsed ? item.title : ''}
                >
                  <span className="me-2">{item.icon}</span>
                  {!isCollapsed && <span>{item.title}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Tồn Kho Section */}
        <div className="px-3">
          {!isCollapsed && (
            <h6 className="text-muted text-uppercase fw-bold mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              TỒN KHO
            </h6>
          )}
          <ul className="list-unstyled">
            {menuItems.tonKho.map((item) => (
              <li key={item.title} className="mb-1">
                <a 
                  href={item.url} 
                  className="d-flex align-items-center text-decoration-none text-dark p-2 rounded"
                  style={{ transition: 'background-color 0.2s' }}
                  title={isCollapsed ? item.title : ''}
                >
                  <span className="me-2">{item.icon}</span>
                  {!isCollapsed && <span>{item.title}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-top">
        <div className="d-flex align-items-center">
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
               style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
            AVT
          </div>
          {!isCollapsed && (
            <div>
              <div className="fw-medium" style={{ fontSize: '0.875rem' }}>Nguyễn Văn A</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>thukho@example.com</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
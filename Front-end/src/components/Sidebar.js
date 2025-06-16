import React from "react";

const Sidebar = ({ activeItem = "bill-history", isCollapsed, onToggle }) => {
  // Define menu items based on activeItem
  const menuItems =
    activeItem === "purchase-history"
      ? [
          {
            id: "import-history",
            label: "Lịch sử nhập hàng",
            href: "/import-history",
            icon: "📥",
          },
          {
            id: "export-history",
            label: "Lịch sử xuất hàng",
            href: "/export-history",
            icon: "📤",
          },
          {
            id: "cancel-export-history",
            label: "Lịch sử xuất hủy",
            href: "/cancel-export-history",
            icon: "🗑️",
          },
          {
            id: "export-request",
            label: "Yêu cầu xuất hàng",
            href: "/export-request",
            icon: "📦",
          },
          {
            id: "return-request",
            label: "Yêu cầu trả hàng",
            href: "/return-request",
            icon: "↩️",
          },
          {
            id: "cancel-export-request",
            label: "Yêu cầu xuất hủy",
            href: "/cancel-export-request",
            icon: "🚫",
          },
        ]
      : [
          {
            id: "bill-history",
            label: "Lịch sử hóa đơn",
            href: "/bill-history",
            icon: "📋",
          },
          {
            id: "return-request",
            label: "Yêu cầu trả hàng",
            href: "/return-request",
            icon: "↩️",
          },
          {
            id: "export-request",
            label: "Yêu cầu xuất hàng",
            href: "/export-request",
            icon: "📦",
          },
          {
            id: "payment",
            label: "Thanh toán",
            href: "/payment",
            icon: "💳",
          },
        ];

  const sidebarStyles = {
    sidebar: {
      background: "white",
      borderRadius: "12px",
      padding: "1rem",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
      height: "calc(100vh - 40px)",
      position: "sticky",
      top: "20px",
      width: isCollapsed ? "60px" : "220px",
      minWidth: isCollapsed ? "60px" : "220px",
      maxWidth: isCollapsed ? "60px" : "220px",
      transition: "all 0.3s ease",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    },
    toggleButton: {
      background: "#0070f4",
      color: "white",
      border: "none",
      borderRadius: "6px",
      width: "100%",
      height: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      marginBottom: "1rem",
      fontSize: "16px",
      transition: "all 0.2s ease",
    },
    menuToggleButton: {
      background: "transparent",
      color: "#666",
      border: "2px solid #e0e0e0",
      borderRadius: "6px",
      width: "100%",
      height: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      marginBottom: "1rem",
      fontSize: "16px",
      transition: "all 0.2s ease",
    },
    sidebarNav: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      flex: 1,
    },
    sidebarNavItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      padding: "0.75rem",
      textDecoration: "none",
      color: "#666",
      fontWeight: "500",
      borderRadius: "8px",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap",
      justifyContent: isCollapsed ? "center" : "flex-start",
    },
    sidebarNavItemHover: {
      background: "#f5f5f5",
      color: "#0070f4",
      textDecoration: "none",
    },
    sidebarNavItemActive: {
      background: "#0070f4",
      color: "white",
    },
    sidebarAvatar: {
      width: "40px",
      height: "40px",
      background: "#0070f4",
      color: "white",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "600",
      margin: "0 auto",
      marginTop: "auto",
      flexShrink: 0,
    },
    iconOnly: {
      fontSize: "18px",
    },
    labelText: {
      opacity: isCollapsed ? 0 : 1,
      transition: "opacity 0.3s ease",
      fontSize: "14px",
    },
  };

  return (
    <div style={sidebarStyles.sidebar}>
      <button
        style={sidebarStyles.menuToggleButton}
        onClick={onToggle}
        title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
        onMouseEnter={(e) => {
          e.target.style.borderColor = "#0070f4";
          e.target.style.color = "#0070f4";
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = "#e0e0e0";
          e.target.style.color = "#666";
        }}
      >
        {isCollapsed ? "☰" : "✕"}
      </button>

      <nav style={sidebarStyles.sidebarNav}>
        {menuItems.map((item) => (
          <a
            key={item.id}
            style={{
              ...sidebarStyles.sidebarNavItem,
              ...(activeItem === item.id
                ? sidebarStyles.sidebarNavItemActive
                : {}),
            }}
            href={item.href}
            title={isCollapsed ? item.label : ""}
            onMouseEnter={(e) => {
              if (activeItem !== item.id) {
                Object.assign(
                  e.target.style,
                  sidebarStyles.sidebarNavItemHover
                );
              }
            }}
            onMouseLeave={(e) => {
              if (activeItem !== item.id) {
                Object.assign(e.target.style, {
                  ...sidebarStyles.sidebarNavItem,
                  justifyContent: isCollapsed ? "center" : "flex-start",
                });
              }
            }}
          >
            <span style={sidebarStyles.iconOnly}>{item.icon}</span>
            {!isCollapsed && (
              <span style={sidebarStyles.labelText}>{item.label}</span>
            )}
          </a>
        ))}
      </nav>
      <div style={sidebarStyles.sidebarAvatar}>A</div>
    </div>
  );
};

export default Sidebar;

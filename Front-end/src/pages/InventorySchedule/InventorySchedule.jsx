// import React, { useState, useEffect } from "react";
// import "./InventorySchedule.css";
// import SidebarWH from "../../components/common/Sidebar_wh";
// import HeaderWH from '../../components/common/Header_wh';
// const InventorySchedule = () => {
//   const [timeFilter, setTimeFilter] = useState("today");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [startDate, setStartDate] = useState("2025-06-01");
//   const [endDate, setEndDate] = useState("2025-06-30");
//   const [inspections, setInspections] = useState([]);
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//   };
//   // Sample data
//   const initialInspections = [
//     // Đang kiểm
//     {
//       id: "KK001",
//       title: "Kiểm định kỳ Kho A - Thực phẩm",
//       date: "2025-06-26",
//       time: "08:00-09:00",
//       location: "Kệ A - Tầng 1",
//       status: "in-progress",
//       progress: 75,
//       progressText: "10/15 khu vực (75%)",
//       note: "Ưu tiên kiểm hóa chất độc hại trước 10:00",
//       isMultiDay: false,
//     },
//     {
//       id: "KK003",
//       title: "Kiểm toàn kho - Tất cả kho",
//       date: "2025-06-26",
//       time: "07:00-18:00",
//       location: "Tất cả khu vực",
//       status: "in-progress",
//       progress: 25,
//       progressText: "Ngày 1/4: Khu A hoàn thành",
//       dateRange: "26/6–29/6",
//       isMultiDay: true,
//     },
//     // Sắp diễn ra
//     {
//       id: "KK002",
//       title: "Kiểm cuối ngày - Tất cả kho",
//       date: "2025-06-26",
//       time: "20:00-20:30",
//       location: "Kệ B - Hàng tồn",
//       status: "upcoming",
//       note: "Chuẩn bị thiết bị đo nhiệt độ cho kho lạnh",
//       badge: "Còn 9h",
//     },
//     {
//       id: "KK005",
//       title: "Kiểm định kỳ Kho C - Thực phẩm",
//       date: "2025-06-28",
//       time: "08:00-12:00",
//       location: "Kệ C - Còn 2 ngày",
//       status: "upcoming",
//       note: "Kiểm tra hạn sử dụng thực phẩm đông lạnh",
//       badge: "Sắp tới",
//     },
//     {
//       id: "KK006",
//       title: "Kiểm đột xuất Kho E - Hóa chất",
//       date: "2025-06-29",
//       time: "14:00-17:00",
//       location: "Kệ E - Còn 3 ngày",
//       status: "upcoming",
//       badge: "Khẩn cấp",
//       isUrgent: true,
//     },
//     {
//       id: "KK007",
//       title: "Kiểm cuối tháng - Tất cả kho",
//       date: "2025-06-30",
//       time: "07:00-18:00",
//       location: "Tất cả khu vực",
//       status: "upcoming",
//       badge: "Kế hoạch",
//     },
//     // Quá hạn
//     {
//       id: "KK009",
//       title: "Kiểm toàn kho - Tất cả kho",
//       date: "2025-06-20",
//       time: "20/06/2025",
//       location: "Kệ F - Quá 6 ngày",
//       status: "overdue",
//       badge: "Quá 6 ngày",
//     },
//     {
//       id: "KK008",
//       title: "Kiểm định kỳ Kho D - Hóa chất",
//       date: "2025-06-22",
//       time: "22/06/2025",
//       location: "Kệ D - Quá 4 ngày",
//       status: "overdue",
//       badge: "Quá 4 ngày",
//     },
//     // Hoàn tất
//     {
//       id: "KK010",
//       title: "Kiểm định kỳ Kho B - Dụng cụ",
//       date: "2025-06-24",
//       time: "08:00-10:00",
//       location: "Kệ B - Hoàn thành",
//       status: "completed",
//       badge: "Hoàn tất",
//     },
//     {
//       id: "KK011",
//       title: "Kiểm cuối ngày - Kho A",
//       date: "2025-06-25",
//       time: "20:00-20:30",
//       location: "Kệ A - Hoàn thành",
//       status: "completed",
//       badge: "Hoàn tất",
//     },
//     {
//       id: "KK012",
//       title: "Kiểm đột xuất Kho C - Thực phẩm",
//       date: "2025-06-26",
//       time: "06:00-07:00",
//       location: "Kệ C - Hoàn thành",
//       status: "completed",
//       badge: "Hoàn tất",
//     },
//   ];

//   useEffect(() => {
//     setInspections(initialInspections);
//   }, []);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = date.getDate();
//     const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
//     const dayName = dayNames[date.getDay()];
//     return { day, dayName };
//   };

//   const filterInspections = () => {
//     const today = new Date("2025-06-26");
//     const weekStart = new Date(today);
//     weekStart.setDate(today.getDate() - today.getDay() + 1);
//     const weekEnd = new Date(weekStart);
//     weekEnd.setDate(weekStart.getDate() + 6);

//     const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
//     const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

//     return inspections.filter((item) => {
//       const itemDate = new Date(item.date);
//       let showByTime = true;
//       let showByStatus = true;

//       // Filter by time
//       if (timeFilter === "today") {
//         showByTime = itemDate.toDateString() === today.toDateString();
//       } else if (timeFilter === "week") {
//         showByTime = itemDate >= weekStart && itemDate <= weekEnd;
//       } else if (timeFilter === "month") {
//         showByTime = itemDate >= monthStart && itemDate <= monthEnd;
//       } else if (timeFilter === "custom" && startDate && endDate) {
//         const start = new Date(startDate);
//         const end = new Date(endDate);
//         showByTime = itemDate >= start && itemDate <= end;
//       }

//       // Filter by status
//       if (statusFilter !== "all") {
//         showByStatus = item.status === statusFilter;
//       }

//       return showByTime && showByStatus;
//     });
//   };

//   const groupInspectionsByStatus = () => {
//     const filtered = filterInspections();
//     const groups = {
//       "in-progress": [],
//       upcoming: [],
//       overdue: [],
//       completed: [],
//     };

//     filtered.forEach((item) => {
//       if (groups[item.status]) {
//         groups[item.status].push(item);
//       }
//     });

//     // Sort by date within each group
//     Object.keys(groups).forEach((status) => {
//       groups[status].sort((a, b) => new Date(a.date) - new Date(b.date));
//     });

//     return groups;
//   };

//   const navigateToInspection = (inspectionId) => {
//     console.log("Navigating to inspection:", inspectionId);
//     alert(`Chuyển hướng đến trang thực thi kiểm kho: ${inspectionId}`);
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "in-progress":
//         return "🔄";
//       case "upcoming":
//         return "⏰";
//       case "overdue":
//         return "⚠️";
//       case "completed":
//         return "✅";
//       default:
//         return "📋";
//     }
//   };

//   const getStatusTitle = (status) => {
//     switch (status) {
//       case "in-progress":
//         return "Đang kiểm";
//       case "upcoming":
//         return "Sắp diễn ra";
//       case "overdue":
//         return "Quá hạn";
//       case "completed":
//         return "Hoàn tất";
//       default:
//         return "Không xác định";
//     }
//   };

//   const getStatusBadgeClass = (item) => {
//     if (item.isUrgent) return "status-urgent";
//     if (item.badge === "Sắp tới") return "status-planned";
//     if (item.badge === "Kế hoạch") return "status-planned";
//     return `status-${item.status}`;
//   };

//   const InspectionItem = ({ item }) => {
//     const { day, dayName } = formatDate(item.date);

//     return (
//       <div
//         className={`inspection-item ${item.isMultiDay ? "multi-day" : ""}`}
//         onClick={() => navigateToInspection(item.id)}
//       >
//         {/* <SidebarWH></SidebarWH> */}
//         <div className="date-section">
//           <div className="date-number">{day}</div>
//           <div className="date-day">{dayName}</div>
//           {item.dateRange && (
//             <div className="date-range">⏱ {item.dateRange}</div>
//           )}
//         </div>

//         <div className="inspection-details">
//           <div className="inspection-title">{item.title}</div>
//           <div className="inspection-meta">
//             <div className="inspection-time">
//               🕐 {item.time} • {item.id}
//             </div>
//             <div className="inspection-location">📍 {item.location}</div>
//           </div>

//           {item.note && <div className="management-note">⚠️ {item.note}</div>}

//           {item.progress !== undefined && (
//             <div className="progress-section">
//               <div className="progress-bar">
//                 <div
//                   className="progress-fill"
//                   style={{ width: `${item.progress}%` }}
//                 ></div>
//               </div>
//               <div className="progress-text">{item.progressText}</div>
//             </div>
//           )}
//         </div>

//         <div className="status-section">
//           <div className={`status-badge ${getStatusBadgeClass(item)}`}>
//             {item.status === "in-progress" && "🔄"}
//             {item.status === "upcoming" && (item.isUrgent ? "🚨" : "⏰")}
//             {item.status === "overdue" && "❌"}
//             {item.status === "completed" && "✅"}
//             {item.badge === "Sắp tới" && "📅"}
//             {item.badge === "Kế hoạch" && "📋"}{" "}
//             {item.badge || getStatusTitle(item.status)}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const StatusGroup = ({ status, items }) => {
//     if (statusFilter !== "all" && statusFilter !== status) return null;
//     if (items.length === 0) return null;

//     return (
//       <div className={`status-group ${status}`}>
//         <div className="status-group-header">
//           <h3 className="status-group-title">
//             {getStatusIcon(status)} {getStatusTitle(status)}
//           </h3>
//           <span className="status-group-count">{items.length}</span>
//         </div>
//         <div className="status-group-content">
//           {items.map((item) => (
//             <InspectionItem key={item.id} item={item} />
//           ))}
//         </div>
//       </div>
//     );
//   };

//   const groupedInspections = groupInspectionsByStatus();

//   return (
//     <div className="d-flex" style={{ height: "100vh" }}>
//       {/* Sidebar */}
//       <SidebarWH isCollapsed={isCollapsed} onToggle={toggleSidebar} />

//       {/* Main Content Area */}
//       <div
//         className="flex-grow-1 d-flex flex-column"
//         style={{
//           marginLeft: isCollapsed ? "70px" : "280px",
//           transition: "margin-left 0.3s ease-in-out",
//         }}
//       >
//         {/* Header */}
//         <HeaderWH onSidebarToggle={toggleSidebar} />
//         <div className="warehouse-inspection">
//           {/* Search and Filters */}
//           <div className="search-section">
//             <div className="search-filters">
//               <div className="filter-group">
//                 <span className="filter-label">Thời gian:</span>
//                 <select
//                   className="filter-select"
//                   value={timeFilter}
//                   onChange={(e) => setTimeFilter(e.target.value)}
//                 >
//                   <option value="today">Hôm nay</option>
//                   <option value="week">Tuần này</option>
//                   <option value="month">Tháng này</option>
//                   <option value="custom">Khoảng ngày tùy chọn</option>
//                 </select>
//               </div>

//               {timeFilter === "custom" && (
//                 <div className="filter-group date-range-inputs active">
//                   <input
//                     type="date"
//                     className="date-input"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                   />
//                   <span>đến</span>
//                   <input
//                     type="date"
//                     className="date-input"
//                     value={endDate}
//                     onChange={(e) => setEndDate(e.target.value)}
//                   />
//                 </div>
//               )}

//               <div className="filter-group">
//                 <span className="filter-label">Trạng thái:</span>
//                 <select
//                   className="filter-select"
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                 >
//                   <option value="all">Tất cả</option>
//                   <option value="in-progress">Đang kiểm</option>
//                   <option value="upcoming">Sắp diễn ra</option>
//                   <option value="overdue">Quá hạn</option>
//                   <option value="completed">Hoàn tất</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* View Container */}
//           <div className="view-container">
//             <div className="view-section active">
//               <div className="status-groups-grid">
//                 <StatusGroup
//                   status="in-progress"
//                   items={groupedInspections["in-progress"]}
//                 />
//                 <StatusGroup
//                   status="upcoming"
//                   items={groupedInspections["upcoming"]}
//                 />
//                 <StatusGroup
//                   status="overdue"
//                   items={groupedInspections["overdue"]}
//                 />
//                 <StatusGroup
//                   status="completed"
//                   items={groupedInspections["completed"]}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InventorySchedule;

"use client"

import { useState, useEffect } from "react"
import "./InventorySchedule.css"
import SidebarWH from "../../components/common/Sidebar_wh"
import HeaderWH from "../../components/common/Header_wh"

const InventorySchedule = () => {
  const [timeFilter, setTimeFilter] = useState("today")
  const [statusFilter, setStatusFilter] = useState("all")
  const [startDate, setStartDate] = useState("2025-06-01")
  const [endDate, setEndDate] = useState("2025-06-30")
  const [inspections, setInspections] = useState([])
  const [reports, setReports] = useState([])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [reportFilter, setReportFilter] = useState("all")

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Sample inspection data
  const initialInspections = [
    {
      id: "KK001",
      title: "Kiểm định kỳ Kho A - Thực phẩm",
      date: "2025-06-26",
      time: "08:00-09:00",
      location: "Kệ A - Tầng 1",
      status: "in-progress",
      progress: 75,
      progressText: "10/15 khu vực (75%)",
      note: "Ưu tiên kiểm hóa chất độc hại trước 10:00",
      isMultiDay: false,
    },
    {
      id: "KK003",
      title: "Kiểm toàn kho - Tất cả kho",
      date: "2025-06-26",
      time: "07:00-18:00",
      location: "Tất cả khu vực",
      status: "in-progress",
      progress: 25,
      progressText: "Ngày 1/4: Khu A hoàn thành",
      dateRange: "26/6–29/6",
      isMultiDay: true,
    },
    {
      id: "KK002",
      title: "Kiểm cuối ngày - Tất cả kho",
      date: "2025-06-26",
      time: "20:00-20:30",
      location: "Kệ B - Hàng tồn",
      status: "upcoming",
      note: "Chuẩn bị thiết bị đo nhiệt độ cho kho lạnh",
      badge: "Còn 9h",
    },
    {
      id: "KK005",
      title: "Kiểm định kỳ Kho C - Thực phẩm",
      date: "2025-06-28",
      time: "08:00-12:00",
      location: "Kệ C - Còn 2 ngày",
      status: "upcoming",
      note: "Kiểm tra hạn sử dụng thực phẩm đông lạnh",
      badge: "Sắp tới",
    },
    {
      id: "KK009",
      title: "Kiểm toàn kho - Tất cả kho",
      date: "2025-06-20",
      time: "20/06/2025",
      location: "Kệ F - Quá 6 ngày",
      status: "overdue",
      badge: "Quá 6 ngày",
    },
    {
      id: "KK010",
      title: "Kiểm định kỳ Kho B - Dụng cụ",
      date: "2025-06-24",
      time: "08:00-10:00",
      location: "Kệ B - Hoàn thành",
      status: "completed",
      badge: "Hoàn tất",
    },
  ]

  // Sample reports data
  const initialReports = [
    {
      id: "BB001",
      inspectionId: "KK001",
      title: "Biên bản kiểm kho A - Thực phẩm",
      date: "2025-06-26",
      time: "08:30",
      status: "unsigned",
      signedAt: null,
      confirmedAt: null,
    },
    {
      id: "BB002",
      inspectionId: "KK010",
      title: "Biên bản kiểm kho B - Dụng cụ",
      date: "2025-06-24",
      time: "10:00",
      status: "signed-confirmed",
      signedAt: "2025-06-24 10:15",
      confirmedAt: "2025-06-24 14:30",
    },
    {
      id: "BB003",
      inspectionId: "KK002",
      title: "Biên bản kiểm cuối ngày",
      date: "2025-06-25",
      time: "20:30",
      status: "signed-pending",
      signedAt: "2025-06-25 20:45",
      confirmedAt: null,
    },
    {
      id: "BB004",
      inspectionId: "KK003",
      title: "Biên bản kiểm toàn kho - Ngày 1",
      date: "2025-06-26",
      time: "12:00",
      status: "unsigned",
      signedAt: null,
      confirmedAt: null,
    },
  ]

  useEffect(() => {
    setInspections(initialInspections)
    setReports(initialReports)
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
    const dayName = dayNames[date.getDay()]
    return { day, dayName }
  }

  const filterInspections = () => {
    const today = new Date("2025-06-26")
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay() + 1)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    return inspections.filter((item) => {
      const itemDate = new Date(item.date)
      let showByTime = true
      let showByStatus = true

      if (timeFilter === "today") {
        showByTime = itemDate.toDateString() === today.toDateString()
      } else if (timeFilter === "week") {
        showByTime = itemDate >= weekStart && itemDate <= weekEnd
      } else if (timeFilter === "month") {
        showByTime = itemDate >= monthStart && itemDate <= monthEnd
      } else if (timeFilter === "custom" && startDate && endDate) {
        const start = new Date(startDate)
        const end = new Date(endDate)
        showByTime = itemDate >= start && itemDate <= end
      }

      if (statusFilter !== "all") {
        showByStatus = item.status === statusFilter
      }

      return showByTime && showByStatus
    })
  }

  const filterReports = () => {
    if (reportFilter === "all") return reports
    return reports.filter((report) => report.status === reportFilter)
  }

  const groupInspectionsByStatus = () => {
    const filtered = filterInspections()
    const groups = {
      "in-progress": [],
      upcoming: [],
      overdue: [],
      completed: [],
    }

    filtered.forEach((item) => {
      if (groups[item.status]) {
        groups[item.status].push(item)
      }
    })

    Object.keys(groups).forEach((status) => {
      groups[status].sort((a, b) => new Date(a.date) - new Date(b.date))
    })

    return groups
  }

  const navigateToInspection = (inspectionId) => {
    console.log("Navigating to inspection:", inspectionId)
    alert(`Chuyển hướng đến trang thực thi kiểm kho: ${inspectionId}`)
  }

  const viewReport = (reportId) => {
    console.log("Viewing report:", reportId)
    alert(`Xem chi tiết biên bản: ${reportId}`)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "in-progress":
        return "🔄"
      case "upcoming":
        return "⏰"
      case "overdue":
        return "⚠️"
      case "completed":
        return "✅"
      default:
        return "📋"
    }
  }

  const getStatusTitle = (status) => {
    switch (status) {
      case "in-progress":
        return "Đang kiểm"
      case "upcoming":
        return "Sắp tới"
      case "overdue":
        return "Quá hạn"
      case "completed":
        return "Đã hoàn tất"
      default:
        return "Không xác định"
    }
  }

  const getReportStatusIcon = (status) => {
    switch (status) {
      case "unsigned":
        return "📝"
      case "signed-pending":
        return "⏳"
      case "signed-confirmed":
        return "✅"
      default:
        return "📄"
    }
  }

  const getReportStatusTitle = (status) => {
    switch (status) {
      case "unsigned":
        return "Chưa ký"
      case "signed-pending":
        return "Đã ký chờ xác nhận"
      case "signed-confirmed":
        return "Đã ký và xác nhận"
      default:
        return "Không xác định"
    }
  }

  const getStatusBadgeClass = (item) => {
    if (item.isUrgent) return "status-urgent"
    if (item.badge === "Sắp tới") return "status-planned"
    if (item.badge === "Kế hoạch") return "status-planned"
    return `status-${item.status}`
  }

  const InspectionItem = ({ item }) => {
    const { day, dayName } = formatDate(item.date)
    return (
      <div
        className={`inspection-item ${item.isMultiDay ? "multi-day" : ""}`}
        onClick={() => navigateToInspection(item.id)}
      >
        <div className="date-section">
          <div className="date-number">{day}</div>
          <div className="date-day">{dayName}</div>
          {item.dateRange && <div className="date-range">⏱ {item.dateRange}</div>}
        </div>
        <div className="inspection-details">
          <div className="inspection-title">{item.title}</div>
          <div className="inspection-meta">
            <div className="inspection-time">
              🕐 {item.time} • {item.id}
            </div>
            <div className="inspection-location">📍 {item.location}</div>
          </div>
          {item.note && <div className="management-note">⚠️ {item.note}</div>}
          {/* {item.progress !== undefined && (
            <div className="progress-section">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${item.progress}%` }}></div>
              </div>
              <div className="progress-text">{item.progressText}</div>
            </div>
          )} */}
        </div>
        <div className="status-section">
          <div className={`status-badge ${getStatusBadgeClass(item)}`}>
            {item.status === "in-progress" && "🔄"}
            {item.status === "upcoming" && (item.isUrgent ? "🚨" : "⏰")}
            {item.status === "overdue" && "❌"}
            {item.status === "completed" && "✅"}
            {item.badge === "Sắp tới" && "📅"}
            {item.badge === "Kế hoạch" && "📋"} {item.badge || getStatusTitle(item.status)}
          </div>
        </div>
      </div>
    )
  }

  const StatusGroup = ({ status, items }) => {
    if (statusFilter !== "all" && statusFilter !== status) return null
    if (items.length === 0) return null

    return (
      <div className={`status-group ${status}`}>
        <div className="status-group-header">
          <h3 className="status-group-title">
            {getStatusIcon(status)} {getStatusTitle(status)}
          </h3>
          <span className="status-group-count">{items.length}</span>
        </div>
        <div className="status-group-content">
          {items.map((item) => (
            <InspectionItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    )
  }

  const ReportCard = ({ report }) => {
    return (
      <div className={`report-card report-${report.status}`} onClick={() => viewReport(report.id)}>
        <div className="report-card-header">
          <div className="report-card-title">{report.title}</div>
          <div className="report-datetime-group">
            <div className="report-main-date">📅 {report.date}</div>
            <div className="report-main-time">🕐 {report.time}</div>
          </div>
        </div>

        <div className="report-status-section">
          <div className={`report-status-badge status-${report.status}`}>
            {getReportStatusIcon(report.status)} {getReportStatusTitle(report.status)}
          </div>
        </div>

        <div className="report-timestamps">
          {report.signedAt && (
            <div className="timestamp-item">
              <span className="timestamp-icon">✍️</span>
              <span className="timestamp-value">{new Date(report.signedAt).toLocaleDateString("vi-VN")}</span>
            </div>
          )}

          {report.confirmedAt && (
            <div className="timestamp-item">
              <span className="timestamp-icon">✅</span>
              <span className="timestamp-value">{new Date(report.confirmedAt).toLocaleDateString("vi-VN")}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  const groupedInspections = groupInspectionsByStatus()
  const filteredReports = filterReports()

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      {/* Sidebar */}
      <SidebarWH isCollapsed={isCollapsed} onToggle={toggleSidebar} />

      {/* Main Content Area */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{
          marginLeft: isCollapsed ? "70px" : "280px",
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        {/* Header */}
        <HeaderWH onSidebarToggle={toggleSidebar} />

        <div className="warehouse-inspection">
          {/* Search and Filters */}
          <div className="search-section">
            <div className="search-filters">
              <div className="filter-group">
                <span className="filter-label">Thời gian:</span>
                <select className="filter-select" value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
                  <option value="today">Hôm nay</option>
                  <option value="week">Tuần này</option>
                  <option value="month">Tháng này</option>
                  <option value="custom">Khoảng ngày tùy chọn</option>
                </select>
              </div>

              {timeFilter === "custom" && (
                <div className="filter-group date-range-inputs active">
                  <input
                    type="date"
                    className="date-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <span>đến</span>
                  <input
                    type="date"
                    className="date-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              )}

              <div className="filter-group">
                <span className="filter-label">Trạng thái:</span>
                <select
                  className="filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="in-progress">Đang kiểm</option>
                  <option value="upcoming">Sắp tới</option>
                  <option value="overdue">Quá hạn</option>
                  <option value="completed">Đã hoàn tất</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="row g-3">
            {/* Left Column - Inspections (9 columns) */}
            <div className="col-9">
              <div className="inspections-container">
                <div className="row g-3">
                  {/* Column 1 */}
                  <div className="col-6">
                    <StatusGroup status="in-progress" items={groupedInspections["in-progress"]} />
                    <StatusGroup status="overdue" items={groupedInspections["overdue"]} />
                  </div>
                  {/* Column 2 */}
                  <div className="col-6">
                    <StatusGroup status="upcoming" items={groupedInspections["upcoming"]} />
                    <StatusGroup status="completed" items={groupedInspections["completed"]} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Reports (3 columns) */}
            <div className="col-3">
              <div className="reports-panel">
                <div className="reports-header">
                  <h4 className="reports-title">📋 Biên bản kiểm kho</h4>
                  <div className="reports-filter">
                    <select
                      className="filter-select small"
                      value={reportFilter}
                      onChange={(e) => setReportFilter(e.target.value)}
                    >
                      <option value="all">Tất cả</option>
                      <option value="unsigned">Chưa ký</option>
                      <option value="signed-pending">Chờ xác nhận</option>
                      <option value="signed-confirmed">Đã xác nhận</option>
                    </select>
                  </div>
                </div>

                <div className="reports-content">
                  {filteredReports.length === 0 ? (
                    <div className="no-reports-message">
                      <div className="no-reports-icon">📄</div>
                      <div className="no-reports-text">Không có biên bản</div>
                    </div>
                  ) : (
                    filteredReports.map((report) => <ReportCard key={report.id} report={report} />)
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventorySchedule

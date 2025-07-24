"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";
import { DefectPopup } from "./DefectPopup"
import "./InventoryDetail.css"

export default function InventoryDetailPage() {
  const params = useParams()
  const navigate = useNavigate()
  const [areaData, setAreaData] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showDefectPopup, setShowDefectPopup] = useState(false)
  const [selectedItemForDefect, setSelectedItemForDefect] = useState(null)
  const [tabFilter, setTabFilter] = useState("all")

  useEffect(() => {
    // Simulate loading area data based on ID
    const loadAreaData = () => {
      const mockData = {
        "area-a": {
          id: "area-a",
          name: "Khu vực A - Thực phẩm khô",
          description: "Kiểm tra số lượng các loại thực phẩm khô",
          items: [
            {
              id: "1",
              code: "G-0001",
              name: "Gạo tám thơm",
              unit: "Bao",
              location: "Kệ A-4",
              expectedQuantity: 10,
              actualQuantity: 9,
              status: "checked",
              hasDefect: false,
            },
            {
              id: "2",
              code: "G-0002",
              name: "Gạo ST25",
              unit: "Bao",
              location: "Kệ A-3",
              expectedQuantity: 5,
              actualQuantity: null,
              status: "pending",
              hasDefect: false,
            },
            {
              id: "3",
              code: "G-0003",
              name: "Gạo nếp",
              unit: "Bao",
              location: "Kệ A-4",
              expectedQuantity: 8,
              actualQuantity: 5,
              status: "checked",
              hasDefect: false,
            },
            {
              id: "4",
              code: "G-0004",
              name: "Gạo tẻ",
              unit: "Bao",
              location: "Kệ A-2",
              expectedQuantity: 3,
              actualQuantity: 2,
              status: "checked",
              hasDefect: false,
            },
            {
              id: "5",
              code: "G-0005",
              name: "Gạo jasmine",
              unit: "Bao",
              location: "Kệ A-1",
              expectedQuantity: 12,
              actualQuantity: null,
              status: "pending",
              hasDefect: false,
            },
          ],
        },
        "area-b": {
          id: "area-b",
          name: "Khu vực B - Đồ uống",
          description: "Kiểm tra số lượng các loại đồ uống",
          items: [
            {
              id: "6",
              code: "C-0001",
              name: "Coca Cola 1.5L",
              unit: "Chai",
              location: "Kệ B-1",
              expectedQuantity: 24,
              actualQuantity: 24,
              status: "checked",
              hasDefect: false,
            },
            {
              id: "7",
              code: "P-0001",
              name: "Pepsi 1.5L",
              unit: "Chai",
              location: "Kệ B-2",
              expectedQuantity: 18,
              actualQuantity: 18,
              status: "checked",
              hasDefect: false,
            },
          ],
        },
        "area-c": {
          id: "area-c",
          name: "Khu vực C - Hóa mỹ phẩm",
          description: "Kiểm tra số lượng hóa mỹ phẩm",
          items: [
            {
              id: "8",
              code: "S-0001",
              name: "Dầu gội Head & Shoulders",
              unit: "Chai",
              location: "Kệ C-1",
              expectedQuantity: 20,
              actualQuantity: null,
              status: "pending",
              hasDefect: false,
            },
            {
              id: "9",
              code: "S-0002",
              name: "Kem đánh răng Colgate",
              unit: "Tuýp",
              location: "Kệ C-2",
              expectedQuantity: 30,
              actualQuantity: null,
              status: "pending",
              hasDefect: false,
            },
          ],
        },
      }

      setAreaData(mockData[params.id] || null)
    }

    loadAreaData()
  }, [params.id])

  const updateQuantity = (itemId, quantity) => {
    if (!areaData) return

    const updatedItems = areaData.items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          actualQuantity: quantity,
          status: "checked",
        }
      }
      return item
    })

    setAreaData({
      ...areaData,
      items: updatedItems,
    })
  }

  const toggleDefectCheckbox = (itemId, hasDefect) => {
    if (!areaData) return

    if (hasDefect) {
      // Show popup when checking
      setSelectedItemForDefect(itemId)
      setShowDefectPopup(true)
    } else {
      // Remove defect when unchecking
      const updatedItems = areaData.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            hasDefect: false,
            defectInfo: undefined,
          }
        }
        return item
      })

      setAreaData({
        ...areaData,
        items: updatedItems,
      })
    }
  }

  const saveDefectInfo = (itemId, defectInfo) => {
    if (!areaData) return

    const updatedItems = areaData.items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          hasDefect: true,
          defectInfo,
        }
      }
      return item
    })

    setAreaData({
      ...areaData,
      items: updatedItems,
    })

    setShowDefectPopup(false)
    setSelectedItemForDefect(null)
  }

  const handleImageUpload = (itemId, file) => {
    // Simulate image upload
    const imageUrl = URL.createObjectURL(file)

    if (!areaData) return

    const updatedItems = areaData.items.map((item) => {
      if (item.id === itemId && item.defectInfo) {
        return {
          ...item,
          defectInfo: {
            ...item.defectInfo,
            image: imageUrl,
          },
        }
      }
      return item
    })

    setAreaData({
      ...areaData,
      items: updatedItems,
    })
  }

  const filteredItems =
    areaData?.items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || item.status === statusFilter

      const matchesTab =
        tabFilter === "all" ||
        (tabFilter === "pending" && item.status === "pending") ||
        (tabFilter === "checking" && item.actualQuantity !== null && item.status === "checked") ||
        (tabFilter === "checked" && item.status === "checked")

      return matchesSearch && matchesStatus && matchesTab
    }) || []

  const allCount = areaData?.items.length || 0
  const pendingCount = areaData?.items.filter((item) => item.status === "pending").length || 0

  const checkedCount = areaData?.items.filter((item) => item.status === "checked").length || 0

  const completedItems = areaData?.items.filter((item) => item.status !== "pending").length || 0
  const totalItems = areaData?.items.length || 0
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  if (!areaData) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="inventory-container">
      <div className="inventory-wrapper">
        {/* Header */}
        <Link to="/inventory/inventory-schedule/inventory-control" className="back-button">
              ← Quay lại
            </Link>
        <div className="inventory-header">
          <div className="header-nav">
            
            <div className="header-info">
              <h1>{areaData.name}</h1>
              <p>{areaData.description}</p>
            </div>
          </div>

          <div className="header-actions">
            <div className="completion-badge">
              {completionPercentage}% hoàn thành ({completedItems}/{totalItems})
            </div>
            <button className="save-button">💾 Lưu kết quả</button>
          </div>
        </div>

        {/* Tab-style Status Filters */}
        <div className="filter-section">
          <div className="tab-filters">
            <button
              onClick={() => setTabFilter("all")}
              className={`tab-button ${tabFilter === "all" ? "active" : "inactive"}`}
            >
              Tất cả ({allCount})
            </button>
            <button
              onClick={() => setTabFilter("pending")}
              className={`tab-button ${tabFilter === "pending" ? "active" : "inactive"}`}
            >
              Chưa kiểm ({pendingCount})
            </button>
            
            <button
              onClick={() => setTabFilter("checked")}
              className={`tab-button ${tabFilter === "checked" ? "active" : "inactive"}`}
            >
              Đã kiểm ({checkedCount})
            </button>
          </div>

          <div className="search-filters">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã hàng hoặc tên hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {/* <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="status-select">
              <option value="all">Tất cả trạng thái</option>
              <option value="checked">Đã kiểm</option>
              <option value="pending">Chưa kiểm</option>
            </select> */}
          </div>
        </div>

        {/* Items List */}
        <div className="items-card">
          <div className="items-header">
            <h3 className="items-title">Danh sách hàng hóa cần kiểm</h3>
          </div>
          <div className="items-content">
            <div className="items-table-wrapper">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Trạng thái</th>
                    <th>Mã hàng</th>
                    <th>Tên hàng</th>
                    <th>ĐVT</th>
                    <th>Vị trí</th>
                    <th>SL thực tế</th>
                    <th>Hàng lỗi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="status-cell">
                          {item.status === "checked" && <span className="status-icon">✓</span>}
                          <span className={`status-badge ${item.status}`}>
                            {item.status === "pending" ? "Chưa kiểm" : "Đã kiểm"}
                          </span>
                        </div>
                      </td>
                      <td style={{ fontFamily: "monospace", fontSize: "0.875rem" }}>{item.code}</td>
                      <td style={{ fontWeight: "500" }}>{item.name}</td>
                      <td>{item.unit}</td>
                      <td>{item.location}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          value={item.actualQuantity || ""}
                          onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 0)}
                          className="quantity-input"
                          placeholder="0"
                        />
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <input
                            type="checkbox"
                            checked={item.hasDefect}
                            onChange={(e) => toggleDefectCheckbox(item.id, e.target.checked)}
                            className="defect-checkbox"
                          />
                          {item.hasDefect && item.defectInfo && (
                            <span className="defect-info">
                              📌 Đã ghi nhận ({item.defectInfo.quantity} {item.unit})
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Defect Popup Modal */}
        {showDefectPopup && selectedItemForDefect && (
          <div className="modal-overlay">
            <div className="modal-content">
              <DefectPopup
                item={areaData.items.find((item) => item.id === selectedItemForDefect)}
                onSave={(defectInfo) => saveDefectInfo(selectedItemForDefect, defectInfo)}
                onCancel={() => {
                  setShowDefectPopup(false)
                  setSelectedItemForDefect(null)
                }}
                onImageUpload={handleImageUpload}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

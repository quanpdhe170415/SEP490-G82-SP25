import React, { useState, useEffect } from "react";
import { useLocation, useNavigate  } from "react-router-dom";

export default function ReturnGoods() {
  const [billData, setBillData] = useState([]);
  const [billInfo, setBillInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [returnItems, setReturnItems] = useState([]);
  const [returnFee, setReturnFee] = useState(0);
  const [showReturnConfirm, setShowReturnConfirm] = useState(false);
  const [billId, setBillId] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Extract billId from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const billIdFromUrl = urlParams.get('billId');
    if (billIdFromUrl) {
      setBillId(billIdFromUrl);
    } else {
      setError("Không tìm thấy mã hóa đơn trong URL.");
      setLoading(false);
    }
  }, [location.search]);

  // Fetch bill details from API
  useEffect(() => {
    const fetchBillDetails = async () => {
      if (!billId) {
        return;
      }

      try {
        setLoading(true);
        setError("");
        
        // Make actual API call
        const response = await fetch(`http://localhost:9999/api/bill/${billId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
          setBillData(result.data);
          setBillInfo(result.data[0].bill_id);
          
          // Initialize return items with all products (quantity = 0 initially)
          const initialReturnItems = result.data.map(item => ({
            _id: item._id,
            goods_id: item.goods_id._id,
            goods_name: item.goods_name,
            barcode: item.goods_id.barcode,
            unit_price: item.unit_price,
            original_quantity: item.quantity,
            return_quantity: 0,
            note: ""
          }));
          setReturnItems(initialReturnItems);
        } else {
          setError("Không tìm thấy dữ liệu hóa đơn hoặc dữ liệu không hợp lệ.");
        }
      } catch (error) {
        console.error("Error fetching bill details:", error);
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          setError("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
        } else if (error.message.includes('404')) {
          setError("Không tìm thấy hóa đơn với mã này.");
        } else if (error.message.includes('500')) {
          setError("Lỗi server nội bộ. Vui lòng thử lại sau.");
        } else {
          setError(`Lỗi khi tải dữ liệu hóa đơn: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBillDetails();
  }, [billId]);

  // Update return quantity for an item
  const handleReturnQuantityChange = (id, delta) => {
    setReturnItems(items => 
      items.map(item => {
        if (item._id === id) {
          const newQuantity = Math.max(0, Math.min(item.original_quantity, item.return_quantity + delta));
          return { ...item, return_quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Update note for an item
  const handleNoteChange = (id, note) => {
    setReturnItems(items => 
      items.map(item => 
        item._id === id ? { ...item, note } : item
      )
    );
  };

  // Calculate totals
  const originalTotal = billInfo ? billInfo.totalAmount : 0;
  const returnTotal = returnItems.reduce((sum, item) => sum + (item.return_quantity * item.unit_price), 0);
  const finalReturnAmount = returnTotal - returnFee;

  // Handle return confirmation
  const handleOpenReturnConfirm = () => {
    const hasReturnItems = returnItems.some(item => item.return_quantity > 0);
    if (!hasReturnItems) {
      alert("Vui lòng chọn ít nhất một sản phẩm để trả hàng");
      return;
    }
    setShowReturnConfirm(true);
  };

  const handleCloseReturnConfirm = () => {
    setShowReturnConfirm(false);
  };

  const handleConfirmReturn = async () => {
    try {
      // Prepare data for API
      const returnData = {
        bill_id: billId,
        return_reason: returnItems
          .filter(item => item.return_quantity > 0 && item.note)
          .map(item => item.note)
          .join("; ") || "Không có lý do cụ thể",
        items: returnItems
          .filter(item => item.return_quantity > 0)
          .map(item => ({
            goods_id: item.goods_id,
            goods_name: item.goods_name,
            quantity: item.return_quantity,
            unit_price: item.unit_price
          }))
      };

      // Send POST request to API
      const response = await fetch("http://localhost:9999/api/return/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(returnData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Return processed successfully:", result);
      alert("Trả hàng thành công!");
      setShowReturnConfirm(false);
      // Optionally reset state or redirect
      navigate("/homecashier");
    } catch (error) {
      console.error("Error processing return:", error);
      alert("Đã có lỗi xảy ra khi xử lý trả hàng: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div>Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="text-danger mb-3">
            <i className="fas fa-exclamation-triangle fa-2x"></i>
          </div>
          <div className="text-danger">{error}</div>
          <button 
            className="btn btn-primary mt-3" 
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light d-flex flex-row" style={{ fontFamily: 'Arial' }}>
      {/* Sidebar */}
      <div className="bg-white border-end p-3 d-flex flex-column" style={{ width: 180 }}>
        <div className="mb-4 text-center">
          <img src="https://via.placeholder.com/40" alt="logo" className="mb-2" />
          <div className="fw-bold">Tạp hóa Hải Chi</div>
        </div>
        <div className="nav flex-column gap-2">
          <button className="btn btn-primary btn-sm">Yêu cầu trả hàng</button>
          <button className="btn btn-outline-primary btn-sm">Yêu cầu xuất hàng</button>
          <button className="btn btn-outline-primary btn-sm">Thanh toán</button>
          <button className="btn btn-outline-primary btn-sm">Đóng ca</button>
        </div>
        <div className="mt-auto text-center">
          <img src="https://via.placeholder.com/32" alt="avatar" className="rounded-circle" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-0">
        {/* Header */}
        <div className="d-flex align-items-center gap-3 px-3 py-2" style={{ background: '#0070f4', borderRadius: '12px 12px 0 0', minHeight: 56 }}>
          <div className="d-flex align-items-center gap-2" style={{ minWidth: 340 }}>
            <div className="text-white fw-bold fs-5">Trả hàng - {billInfo?.billNumber}</div>
          </div>
        </div>

        <div className="row m-0">
          {/* Return Items List - Left Side */}
          <div className="col-8">
            <div className="m-3">
              <h6 className="mb-3">Danh sách sản phẩm trả hàng</h6>
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: 200 }}>Sản phẩm</th>
                    <th style={{ width: 100 }}>SL gốc</th>
                    <th style={{ width: 100 }}>SL trả</th>
                    <th style={{ width: 100 }}>Đơn giá</th>
                    <th style={{ width: 100 }}>Thành tiền</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {returnItems.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className="fw-bold">{item.goods_name}</div>
                        <div className="small text-secondary">{item.barcode}</div>
                      </td>
                      <td className="text-center">{item.original_quantity}</td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <button 
                            className="btn btn-outline-secondary btn-sm px-2" 
                            onClick={() => handleReturnQuantityChange(item._id, -1)}
                          >
                            -
                          </button>
                          <span className="mx-2" style={{ minWidth: 20, textAlign: 'center', display: 'inline-block' }}>
                            {item.return_quantity}
                          </span>
                          <button 
                            className="btn btn-outline-secondary btn-sm px-2" 
                            onClick={() => handleReturnQuantityChange(item._id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>{item.unit_price.toLocaleString()} đ</td>
                      <td className="fw-bold">
                        {(item.return_quantity * item.unit_price).toLocaleString()} đ
                      </td>
                      <td>
                        <textarea
                          className="form-control form-control-sm"
                          rows="2"
                          value={item.note}
                          onChange={(e) => handleNoteChange(item._id, e.target.value)}
                          placeholder="Lý do trả hàng..."
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Combined Bill Information, Return Fee, and Return Summary - Right Side */}
          <div className="col-4">
            <div className="m-3">
              <div className="card shadow">
                <div className="card-body">
                  {/* Bill Information */}
                  <h6 className="mb-3">Thông tin hóa đơn</h6>
                  <div className="row mb-2">
                    <div className="col-6"><strong>Mã hóa đơn:</strong></div>
                    <div className="col-6">{billInfo?.billNumber}</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-6"><strong>Ngày tạo:</strong></div>
                    <div className="col-6">{billInfo ? new Date(billInfo.createdAt).toLocaleString('vi-VN') : ''}</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-6"><strong>Tổng tiền gốc:</strong></div>
                    <div className="col-6">{originalTotal.toLocaleString()} đ</div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-6"><strong>Phương thức TT:</strong></div>
                    <div className="col-6">{billInfo?.paymentMethod}</div>
                  </div>

                  {/* Return Fee */}
                  <h6 className="mb-3">Phí trả hàng</h6>
                  <div className="input-group mb-4">
                    <input
                      type="number"
                      className="form-control"
                      value={returnFee}
                      onChange={(e) => setReturnFee(Number(e.target.value) || 0)}
                      placeholder="Nhập phí trả hàng"
                    />
                    <span className="input-group-text">đ</span>
                  </div>

                  {/* Return Summary */}
                  <h6 className="mb-3">Tổng kết trả hàng</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tổng tiền trả:</span>
                    <span className="fw-bold">{returnTotal.toLocaleString()} đ</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Phí trả hàng:</span>
                    <span className="text-danger">-{returnFee.toLocaleString()} đ</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <span className="fw-bold">Khách nhận lại:</span>
                    <span className="fw-bold fs-5">{finalReturnAmount.toLocaleString()} đ</span>
                  </div>
                  <button 
                    className="btn btn-warning fw-bold w-100" 
                    onClick={handleOpenReturnConfirm}
                    disabled={returnTotal === 0}
                  >
                    Xác nhận trả hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Return Confirmation Popup */}
      {showReturnConfirm && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          background: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 2000 
        }}>
          <div style={{ 
            background: '#fff', 
            width: 400, 
            borderRadius: 8, 
            maxHeight: '80vh', 
            display: 'flex', 
            flexDirection: 'column' 
          }}>
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
              <div className="fw-bold">Xác nhận trả hàng</div>
              <button className="btn btn-sm btn-close" onClick={handleCloseReturnConfirm}></button>
            </div>
            
            <div className="p-3 flex-grow-1 overflow-auto">
              <div className="mb-3">
                <strong>Hóa đơn:</strong> {billInfo?.billNumber}
              </div>
              <div className="mb-3">
                <strong>Ngày trả:</strong> {new Date().toLocaleString('vi-VN')}
              </div>
              
              <h6>Sản phẩm trả hàng:</h6>
              <div className="mb-3">
                {returnItems.filter(item => item.return_quantity > 0).map(item => (
                  <div key={item._id} className="border-bottom py-2">
                    <div className="fw-bold">{item.goods_name}</div>
                    <div className="d-flex justify-content-between">
                      <span>SL: {item.return_quantity}</span>
                      <span>{(item.return_quantity * item.unit_price).toLocaleString()} đ</span>
                    </div>
                    {item.note && (
                      <div className="small text-muted">Ghi chú: {item.note}</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="border rounded p-3 mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Tổng tiền trả:</span>
                  <span>{returnTotal.toLocaleString()} đ</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Phí trả hàng:</span>
                  <span className="text-danger">-{returnFee.toLocaleString()} đ</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Khách nhận lại:</span>
                  <span>{finalReturnAmount.toLocaleString()} đ</span>
                </div>
              </div>

              <button 
                className="btn btn-warning w-100 fw-bold"
                onClick={handleConfirmReturn}
              >
                XÁC NHẬN TRẢ HÀNG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react"

export default function ReturnGoods() {
  const [products, setProducts] = useState([
    {
      id: "1",
      barcode: "8930001234",
      name: "Kem đánh răng",
      price: 20000,
      maxQuantity: 2,
      returnQuantity: 1,
      note: "",
    },
    {
      id: "2",
      barcode: "8930001235",
      name: "Coca",
      price: 20000,
      maxQuantity: 1,
      returnQuantity: 0,
      note: "",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [orderInfo] = useState({
    employee: "Phạm Văn Thành",
    date: "24/5/2025 9:59",
    orderId: "HD001",
    originalTotal: 20000,
    returnTotal: 20000,
    discount: 0,
    returnFee: 0,
    customerDebt: 0,
  })

  const [editableOrderInfo, setEditableOrderInfo] = useState({
    discount: 0,
    returnFee: 0,
    customerDebt: 0,
  })

  const updateQuantity = (id, change) => {
    setProducts(
      products.map((product) => {
        if (product.id === id) {
          const newQuantity = Math.max(0, Math.min(product.maxQuantity, product.returnQuantity + change))
          return { ...product, returnQuantity: newQuantity }
        }
        return product
      }),
    )
  }

  const updateNote = (id, note) => {
    setProducts(products.map((product) => (product.id === id ? { ...product, note } : product)))
  }

  const removeProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id))
  }

  const calculateReturnTotal = () => {
    return products.reduce((total, product) => total + product.returnQuantity * product.price, 0)
  }

  return (
    <div className="container-fluid vh-100 bg-light">
      <div className="row h-100">
        {/* Left Sidebar */}
        <div className="col-2 bg-white border-end p-0">
          <div className="d-flex align-items-center p-3 border-bottom">
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
              style={{ width: "40px", height: "40px" }}
            >
              logo
            </div>
            <div>
              <div className="fw-bold">Tạp hóa</div>
              <div className="small text-muted">Hải Chi</div>
            </div>
            <div className="ms-auto">
              <span className="badge bg-secondary">thông báo</span>
            </div>
          </div>

          <nav className="nav flex-column p-2">
            <a className="nav-link text-dark py-2" href="#">
              Yêu cầu trả hàng
            </a>
            <a className="nav-link text-dark py-2" href="#">
              Yêu cầu xuất hàng
            </a>
            <a className="nav-link text-primary py-2 fw-bold" href="#">
              Trả hàng
            </a>
            <a className="nav-link text-dark py-2" href="#">
              Thanh toán
            </a>
          </nav>

          <div className="position-absolute bottom-0 p-3">
            <div
              className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
              style={{ width: "40px", height: "40px" }}
            >
              avatar
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-7 p-0">
          <div className="h-100 d-flex flex-column">
            {/* Tab Header */}
            <div className="bg-white border-bottom p-3">
              <div className="d-flex align-items-center">
                <button className="btn btn-outline-secondary me-2">Trả hàng 1</button>
                <button className="btn btn-outline-secondary">+</button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white border-bottom p-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm sản phẩm trả hàng"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Product List */}
            <div className="flex-grow-1 p-3 overflow-auto">
              {products.map((product) => (
                <div key={product.id} className="card mb-3">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-1">
                        <div
                          className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                          style={{ width: "40px", height: "40px" }}
                        >
                          <span className="small">Kiểm tra</span>
                        </div>
                      </div>

                      <div className="col-2">
                        <strong>{product.barcode}</strong>
                      </div>

                      <div className="col-3">
                        <span>{product.name}</span>
                      </div>

                      <div className="col-2">
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => updateQuantity(product.id, -1)}
                          >
                            −
                          </button>
                          <span className="mx-2 fw-bold">{product.returnQuantity}</span>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => updateQuantity(product.id, 1)}
                          >
                            +
                          </button>
                        </div>
                        <div className="small text-muted">/ {product.maxQuantity}</div>
                      </div>

                      <div className="col-2">
                        <strong>{product.price.toLocaleString()}</strong>
                      </div>

                      <div className="col-1">
                        <button className="btn btn-outline-danger btn-sm" onClick={() => removeProduct(product.id)}>
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Notes Section */}
                    <div className="row mt-3">
                      <div className="col-12">
                        <label className="form-label small text-muted">Ghi chú trả hàng:</label>
                        <textarea
                          className="form-control form-control-sm"
                          rows={2}
                          placeholder="Nhập lý do trả hàng..."
                          value={product.note}
                          onChange={(e) => updateNote(product.id, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-3 bg-white border-start p-0">
          <div className="p-3 h-100 d-flex flex-column">
            {/* Order Info */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Nhân viên</span>
                <span>{orderInfo.employee}</span>
              </div>
              <div className="text-end small text-muted">{orderInfo.date}</div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <span>Mã hóa đơn</span>
                <input type="text" className="form-control form-control-sm w-50" value={orderInfo.orderId} readOnly />
              </div>
            </div>

            {/* Return Summary */}
            <div className="mb-4">
              <div className="d-flex justify-content-between mb-2">
                <span>Tổng giá gốc mua</span>
                <input
                  type="text"
                  className="form-control form-control-sm w-50 text-end"
                  value={orderInfo.originalTotal.toLocaleString()}
                  readOnly
                />
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Tổng tiền phải trả</span>
                <input
                  type="text"
                  className="form-control form-control-sm w-50 text-end"
                  value={calculateReturnTotal().toLocaleString()}
                  readOnly
                />
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Giảm giá</span>
                <input
                  type="number"
                  className="form-control form-control-sm w-50 text-end"
                  value={editableOrderInfo.discount}
                  onChange={(e) => setEditableOrderInfo({ ...editableOrderInfo, discount: Number(e.target.value) })}
                />
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Phí trả hàng</span>
                <input
                  type="number"
                  className="form-control form-control-sm w-50 text-end"
                  value={editableOrderInfo.returnFee}
                  onChange={(e) => setEditableOrderInfo({ ...editableOrderInfo, returnFee: Number(e.target.value) })}
                />
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Cần trả khách</span>
                <input
                  type="number"
                  className="form-control form-control-sm w-50 text-end"
                  value={editableOrderInfo.customerDebt}
                  onChange={(e) => setEditableOrderInfo({ ...editableOrderInfo, customerDebt: Number(e.target.value) })}
                />
              </div>
            </div>

            {/* Return Button */}
            <div className="mt-auto">
              <button className="btn btn-primary w-100 py-3 fw-bold">TRẢ HÀNG</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

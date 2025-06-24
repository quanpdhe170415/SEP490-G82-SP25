import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Select from "react-select";

const UNIT_OPTIONS = [
  { value: "lon", label: "lon" },
  { value: "chai", label: "chai" },
  { value: "thùng", label: "thùng" },
  { value: "gói", label: "gói" },
  { value: "cái", label: "cái" },
];

export default function ExportRequestModal({ show, onClose, onSubmit }) {
  const username = localStorage.getItem("username") || "";

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState(null);
  const [note, setNote] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createdAt, setCreatedAt] = useState("");

  useEffect(() => {
    if (show) {
      setLoading(true);
      const now = new Date();
      const formatted = now.toLocaleString("vi-VN", {
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCreatedAt(formatted);

      fetch(`${process.env.REACT_APP_URL_SERVER}/product/products-for-retail`)
        .then(res => res.json())
        .then(data => setProducts(data || []))
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    }
  }, [show]);

  const productOptions = products.map(p => ({
    value: p.id,
    label: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={p.image}
          alt={p.name}
          style={{ width: 30, height: 30, objectFit: "cover", marginRight: 8 }}
        />
        <span>
          {p.name} ({p.type})
        </span>
      </div>
    ),
    data: p,
  }));

  const handleAddItem = () => {
    if (!selectedProduct || !quantity || !unit) return;
    setItems([
      ...items,
      {
        goods_id: selectedProduct.data.id,
        goods_name: selectedProduct.data.name,
        quantity: Number(quantity),
        unit_of_measure: unit.value,
      },
    ]);
    setSelectedProduct(null);
    setQuantity("");
    setUnit(null);
  };

  const handleRemoveItem = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    if (items.length === 0) return;
    if (onSubmit) {
      onSubmit({
        goods: items.map(i => ({
          goods_id: i.goods_id,
          quantity: Number(i.quantity),
          unit_of_measure: i.unit_of_measure,
        })),
        note,
      });
    }
    setItems([]);
    setNote("");
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Yêu cầu xuất hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-2">
          <b>Thu ngân:</b> {username}
        </div>
        <div className="mb-2">
          <b>Thời gian:</b> {createdAt}
        </div>
        <div className="mb-3 row align-items-end">
          <div className="col-md-6">
            <label className="form-label">Tìm kiếm & chọn sản phẩm</label>
            <Select
              options={productOptions}
              value={selectedProduct}
              onChange={setSelectedProduct}
              isClearable
              isDisabled={loading}
              placeholder="Tìm kiếm sản phẩm..."
              formatOptionLabel={option => option.label}
              noOptionsMessage={() => "Không tìm thấy sản phẩm"}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "38px",
                }),
              }}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Số lượng</label>
            <input
              type="number"
              min={1}
              className="form-control"
              style={{ height: "38px" }}
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              disabled={!selectedProduct}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Đơn vị</label>
            <Select
              options={UNIT_OPTIONS}
              value={unit}
              onChange={setUnit}
              isClearable
              isDisabled={!selectedProduct}
              placeholder="Chọn đơn vị"
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "38px",
                }),
              }}
            />
          </div>
        </div>
        <div className="mb-3 text-end">
          <Button
            variant="success"
            onClick={handleAddItem}
            disabled={!selectedProduct || !quantity || !unit}
          >
            Thêm vào phiếu
          </Button>
        </div>
        <div>
          <table className="table table-bordered table-sm align-middle">
            <thead className="table-light">
              <tr>
                <th>STT</th>
                <th>Tên sản phẩm</th>
                <th>Số lượng</th>
                <th>Đơn vị</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    Chưa có sản phẩm nào được chọn
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{item.goods_name}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[idx].quantity = e.target.value;
                          setItems(newItems);
                        }}
                      />
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={item.unit_of_measure}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[idx].unit_of_measure = e.target.value;
                          setItems(newItems);
                        }}
                      >
                        {UNIT_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveItem(idx)}
                      >
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mb-2">
          <label className="form-label">Ghi chú</label>
          <textarea
            className="form-control"
            rows={2}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Nhập ghi chú (nếu có)"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Đóng
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={items.length === 0}
        >
          Gửi yêu cầu
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// modalchangepassword.js
import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

export default function ModalChangePassword({ show, handleClose, email }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }
  };
  const handleCloseModal = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    handleClose();
  };
  
  return (
<Modal show={show} onHide={handleCloseModal} centered>
<Modal.Header closeButton>
        <Modal.Title>Đổi Mật Khẩu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu cũ</Form.Label>
            <Form.Control
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu mới</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Xác nhận mật khẩu mới</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseModal} disabled={loading}>
  Hủy
</Button>

        <Button variant="primary" onClick={handleSave} disabled={loading}>
          {loading ? "Đang xử lý..." : "Lưu"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

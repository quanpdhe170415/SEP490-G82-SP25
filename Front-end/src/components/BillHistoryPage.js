import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Button, Table, Card } from "react-bootstrap";
import "./Css/BillHistory.css";
import Header from "./Header";

const BillHistory = () => {
  const [searchValue, setSearchValue] = useState("");
  const [dateSearch, setDateSearch] = useState("");
  const [statusSearch, setStatusSearch] = useState("");
  const [creatorSearch, setCreatorSearch] = useState("");
  const [sellerSearch, setSellerSearch] = useState("");

  // Sample data for the bill table
  const billData = [
    {
      id: "HD001",
      time: "20/05/2025 10:28",
      employee: "Thu ngân 1",
      totalAmount: "20000",
      paymentAmount: "20000",
      paymentMethod: "Tiền mặt",
      status: "Đã thanh toán",
    },
    // Add more sample data here
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Tìm kiếm theo:", { dateSearch, statusSearch, creatorSearch, sellerSearch });
    console.log("Giá trị tìm kiếm:", searchValue);
  };

  return (
    <div className="bill-history-page">
      {/* Header */}
      <Header />

      <Container fluid className="main-content">
        <Row>
          {/* Main Content */}
          <Col md={12} className="content-area p-4">
            <h2 className="page-title">Lịch sử hóa đơn</h2>

            <Row>
              {/* Search Panel */}
              <Col md={3}>
                <Card className="search-panel shadow-sm mb-4">
                  <Card.Body>
                    <h5>Tìm kiếm</h5>
                    <Form onSubmit={handleSearch}>
                      {/* Time */}
                      <Form.Group className="mb-3">
                        <Form.Label>Thời gian</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="24/05/2025 12:59"
                          value={dateSearch}
                          onChange={(e) => setDateSearch(e.target.value)}
                        />
                      </Form.Group>

                      {/* Status */}
                      <Form.Group className="mb-3">
                        <Form.Label>Trạng thái</Form.Label>
                        <Form.Control
                          as="select"
                          value={statusSearch}
                          onChange={(e) => setStatusSearch(e.target.value)}
                        >
                          <option value="">Chọn trạng thái</option>
                          <option value="Đang xử lý">Đang xử lý</option>
                          <option value="Hoàn thành">Hoàn thành</option>
                          <option value="Không giao được">Không giao được</option>
                          <option value="Đã hủy">Đã hủy</option>
                        </Form.Control>
                      </Form.Group>

                      {/* Người tạo */}
                      <Form.Group className="mb-3">
                        <Form.Label>Người tạo</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nhập người tạo"
                          value={creatorSearch}
                          onChange={(e) => setCreatorSearch(e.target.value)}
                        />
                      </Form.Group>

                      {/* Người bán */}
                      <Form.Group className="mb-3">
                        <Form.Label>Người bán</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nhập người bán"
                          value={sellerSearch}
                          onChange={(e) => setSellerSearch(e.target.value)}
                        />
                      </Form.Group>

                      <div className="d-grid">
                        <Button variant="primary" type="submit">
                          Tìm kiếm
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>

              {/* Bill Table */}
              <Col md={9}>
                <div className="bill-table-wrapper">
                  <Table bordered hover className="bill-table">
                    <thead>
                      <tr>
                        <th>Mã hóa đơn</th>
                        <th>Thời gian</th>
                        <th>Nhân viên</th>
                        <th>Tổng tiền hóa đơn</th>
                        <th>Thanh toán thực</th>
                        <th>Hình thức thanh toán</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billData.map((bill, index) => (
                        <tr key={index}>
                          <td>{bill.id}</td>
                          <td>{bill.time}</td>
                          <td>{bill.employee}</td>
                          <td>{bill.totalAmount}</td>
                          <td>{bill.paymentAmount}</td>
                          <td>{bill.paymentMethod}</td>
                          <td>{bill.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BillHistory;

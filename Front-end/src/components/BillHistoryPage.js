import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Table, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Css/BillHistory.css";
import Header from "./Header";

const BillHistory = () => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [statusSearch, setStatusSearch] = useState({
        pending: false,
        confirmed: false,
        processing: false,
        completed: false,
        cancelled: false,
        refunded: false,
    });
    const [paymentMethodSearch, setPaymentMethodSearch] = useState({
        cash: false,
        transfer: false,
    });
    const [selectedBillId, setSelectedBillId] = useState(null); // Track selected bill

    // Sample data for the bill table with items
    const billData = [
        {
            id: "HD001",
            time: "20/05/2025 10:28",
            employee: "Thu ngân 1",
            totalAmount: 20000,
            paymentAmount: 20000,
            paymentMethod: "cash",
            status: "cancelled",
            creator: "Phạm Văn Thanh",
            seller: "Phạm Văn Thanh",
            items: [
                {
                    productId: "10131420895",
                    name: "Vít đầu bàng răng thưa, thân ôm M4, màu đen-VG420B23T",
                    quantity: 5,
                    unitPrice: 3000,
                    totalPrice: 15000,
                },
                {
                    productId: "10135091592",
                    name: "Sữa rửa mặt Kose Nhật 220g xanh nhạt chứa collagen",
                    quantity: 20,
                    unitPrice: 250,
                    totalPrice: 5000,
                },
            ],
        }, {
            id: "HD002",
            time: "20/05/2025 10:28",
            employee: "Thu ngân 1",
            totalAmount: 20000,
            paymentAmount: 20000,
            paymentMethod: "cash",
            status: "completed",
            creator: "Phạm Văn Thanh",
            seller: "Phạm Văn Thanh",
            items: [
                {
                    productId: "10131420895",
                    name: "Vít đầu bàng răng thưa, thân ôm M4, màu đen-VG420B23T",
                    quantity: 5,
                    unitPrice: 3000,
                    totalPrice: 15000,
                },
                {
                    productId: "10135091592",
                    name: "Sữa rửa mặt Kose Nhật 220g xanh nhạt chứa collagen",
                    quantity: 20,
                    unitPrice: 250,
                    totalPrice: 5000,
                },
            ],
        },
        // Add more sample data here
    ];

    // Filter bills based on selected filters
    const filterBills = () => {
        let filteredBills = billData;

        // Filter by time range
        if (fromDate) {
            filteredBills = filteredBills.filter(bill => new Date(bill.time) >= new Date(fromDate));
        }
        if (toDate) {
            filteredBills = filteredBills.filter(bill => new Date(bill.time) <= new Date(toDate));
        }

        // Filter by status
        const activeStatuses = Object.keys(statusSearch).filter(status => statusSearch[status]);
        if (activeStatuses.length > 0) {
            filteredBills = filteredBills.filter(bill => activeStatuses.includes(bill.status));
        }

        // Filter by payment method
        const activeMethods = Object.keys(paymentMethodSearch).filter(method => paymentMethodSearch[method]);
        if (activeMethods.length > 0) {
            filteredBills = filteredBills.filter(bill => activeMethods.includes(bill.paymentMethod.toLowerCase()));
        }

        return filteredBills;
    };

    const handleStatusChange = (status) => {
        setStatusSearch({
            ...statusSearch,
            [status]: !statusSearch[status],
        });
    };

    const handlePaymentMethodChange = (method) => {
        setPaymentMethodSearch({
            ...paymentMethodSearch,
            [method]: !paymentMethodSearch[method],
        });
    };

    // Toggle the selected bill for viewing its items
    const toggleBillDetails = (billId) => {
        setSelectedBillId(selectedBillId === billId ? null : billId);
    };

    // Get the filtered bills based on the search criteria
    const filteredBills = filterBills();

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
                                        <Form>
                                            {/* Time Range */}
                                            <Form.Group className="mb-3">
                                                <Form.Label>Thời gian từ</Form.Label>
                                                <Form.Control
                                                    type="datetime-local"
                                                    value={fromDate}
                                                    onChange={(e) => setFromDate(e.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Đến</Form.Label>
                                                <Form.Control
                                                    type="datetime-local"
                                                    value={toDate}
                                                    onChange={(e) => setToDate(e.target.value)}
                                                />
                                            </Form.Group>

                                            {/* Status Filter */}
                                            <Form.Group className="mb-3">
                                                <Form.Label>Trạng thái</Form.Label>
                                                <div>
                                                    {["pending", "confirmed", "processing", "completed", "cancelled", "refunded"].map(
                                                        (status) => (
                                                            <Form.Check
                                                                key={status}
                                                                type="checkbox"
                                                                label={
                                                                    status === "pending"
                                                                        ? "Chờ xử lý"
                                                                        : status === "confirmed"
                                                                            ? "Đã xác nhận"
                                                                            : status === "processing"
                                                                                ? "Đang xử lý"
                                                                                : status === "completed"
                                                                                    ? "Hoàn thành"
                                                                                    : status === "cancelled"
                                                                                        ? "Đã hủy"
                                                                                        : "Hoàn trả"
                                                                }
                                                                checked={statusSearch[status]}
                                                                onChange={() => handleStatusChange(status)}
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            </Form.Group>

                                            {/* Payment Method Filter */}
                                            <Form.Group className="mb-3">
                                                <Form.Label>Phương thức thanh toán</Form.Label>
                                                <div>
                                                    {["cash", "transfer"].map((method) => (
                                                        <Form.Check
                                                            key={method}
                                                            type="checkbox"
                                                            label={method === "cash" ? "Tiền mặt" : "Chuyển khoản"}
                                                            checked={paymentMethodSearch[method]}
                                                            onChange={() => handlePaymentMethodChange(method)}
                                                        />
                                                    ))}
                                                </div>
                                            </Form.Group>
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
                                                <th>Người bán</th>
                                                <th>Tổng tiền hóa đơn</th>
                                                <th>Thanh toán thực tế</th>
                                                <th>Phương thức thanh toán</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredBills.map((bill, index) => (
                                                <>
                                                    <tr
                                                        key={bill.id}
                                                        onClick={() => toggleBillDetails(bill.id)}

                                                    >
                                                        <td style={{ backgroundColor: selectedBillId === bill.id ? '#e3f2fd' : 'transparent' }}>{bill.id}</td>
                                                        <td style={{ backgroundColor: selectedBillId === bill.id ? '#e3f2fd' : 'transparent' }}>{bill.time}</td>
                                                        <td style={{ backgroundColor: selectedBillId === bill.id ? '#e3f2fd' : 'transparent' }}>{bill.seller}</td>
                                                        <td style={{ backgroundColor: selectedBillId === bill.id ? '#e3f2fd' : 'transparent' }}>{bill.totalAmount}</td>
                                                        <td style={{ backgroundColor: selectedBillId === bill.id ? '#e3f2fd' : 'transparent' }}>{bill.paymentAmount}</td>
                                                        <td style={{ backgroundColor: selectedBillId === bill.id ? '#e3f2fd' : 'transparent' }}>{bill.paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản"}</td>
                                                        <td style={{ backgroundColor: selectedBillId === bill.id ? '#e3f2fd' : 'transparent' }}>
                                                            {bill.status === "pending" ? "Chờ xử lý" :
                                                                bill.status === "confirmed" ? "Đã xác nhận" :
                                                                    bill.status === "processing" ? "Đang xử lý" :
                                                                        bill.status === "completed" ? "Hoàn thành" :
                                                                            bill.status === "cancelled" ? "Đã hủy" :
                                                                                bill.status === "refunded" ? "Hoàn trả" : "Khác"}
                                                        </td>
                                                    </tr >
                                                    {selectedBillId === bill.id && (
                                                        <tr>
                                                            <td colSpan="7">
                                                                <div className="bill-details">
                                                                    <h5>Chi tiết hóa đơn</h5>
                                                                    <div className="bill-info">
                                                                        <div className="info-item">
                                                                            <span className="info-label">Mã hóa đơn:</span>
                                                                            <span className="info-value">{bill.id}</span>
                                                                        </div>

                                                                        <div className="info-item">
                                                                            <span className="info-label">Người bán:</span>
                                                                            <span className="info-value">{bill.seller}</span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <span className="info-label">Phương thức thanh toán:</span>
                                                                            <span className="info-value">{bill.paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản"}</span>
                                                                        </div>

                                                                        <div className="info-item">
                                                                            <span className="info-label">Thời gian:</span>
                                                                            <span className="info-value">{bill.time}</span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <span className="info-label">Người tạo:</span>
                                                                            <span className="info-value">{bill.creator}</span>
                                                                        </div>
                                                                        <div className="info-item">
                                                                            <span className="info-label">Trạng thái:</span>
                                                                            <span className="info-value">
                                                                                {bill.status === "pending" ? "Chờ xử lý" :
                                                                                    bill.status === "confirmed" ? "Đã xác nhận" :
                                                                                        bill.status === "processing" ? "Đang xử lý" :
                                                                                            bill.status === "completed" ? "Hoàn thành" :
                                                                                                bill.status === "cancelled" ? "Đã hủy" :
                                                                                                    bill.status === "refunded" ? "Hoàn trả" : "Khác"}

                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <Table bordered className="bill-table">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Mã hàng</th>
                                                                                <th>Tên hàng</th>
                                                                                <th>Số lượng</th>
                                                                                <th>Đơn giá</th>
                                                                                <th>Thành tiền</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {bill.items.map((item) => (
                                                                                <tr key={item.productId}>
                                                                                    <td>{item.productId}</td>
                                                                                    <td>{item.name}</td>
                                                                                    <td>{item.quantity}</td>
                                                                                    <td>{item.unitPrice}</td>
                                                                                    <td>{item.totalPrice}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </Table>

                                                                    {/* Total Summary */}
                                                                    <div className="total-summary">
                                                                        <p>
                                                                            <span>Tổng số lượng hàng:</span>
                                                                            <span>{bill.items.reduce((acc, item) => acc + item.quantity, 0)}</span>
                                                                        </p>
                                                                        <p>
                                                                            <span>Tổng số tiền:</span>
                                                                            <span>{bill.totalAmount.toLocaleString('vi-VN')} đ</span>
                                                                        </p>
                                                                        <p>
                                                                            <span>Số tiền khách cần trả:</span>
                                                                            <span>{bill.totalAmount.toLocaleString('vi-VN')} đ</span>
                                                                        </p>
                                                                        <p>
                                                                            <span>Số tiền khách đã trả:</span>
                                                                            <span>{bill.paymentAmount.toLocaleString('vi-VN')} đ</span>
                                                                        </p>

                                                                        {/* Buttons Container */}
                                                                        <div className="button-container">
                                                                            <Link to="/return-goods">
                                                                                <Button variant="danger" className="btn-return">
                                                                                    Trả hàng
                                                                                </Button>
                                                                            </Link>
                                                                            {/* <Button variant="primary" className="btn-print">
                                                                                In hóa đơn
                                                                            </Button> */}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </td>
                                                        </tr>
                                                    )}
                                                </>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container >
        </div >
    );
};

export default BillHistory;

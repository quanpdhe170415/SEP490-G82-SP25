import React, { useState, useEffect } from 'react';
import './Css/Create-Goods-Disposal.css'; // Import the provided CSS file

// --- Mock Data ---
const MOCK_PRODUCTS = {
    'SKU001': { name: 'Nước ngọt Coca-Cola 330ml', stock: 85, hasLot: true, hasHsd: true },
    'SKU002': { name: 'Bánh gạo One One vị ngọt', stock: 120, hasLot: true, hasHsd: true },
    'SKU003': { name: 'Thùng carton 3 lớp (30x20x15)', stock: 500, hasLot: false, hasHsd: false },
    'SKU004': { name: 'Dầu ăn Tường An 1L', stock: 40, hasLot: true, hasHsd: true },
    'SKU005': { name: 'Sữa đặc Ông Thọ lon 380g', stock: 250, hasLot: true, hasHsd: true },
    'SKU006': { name: 'Bột giặt Omo Matic 4kg', stock: 75, hasLot: false, hasHsd: false },
    'SKU007': { name: 'Gạo ST25 túi 5kg', stock: 90, hasLot: true, hasHsd: false },
    'INVALID': { name: 'Sản phẩm không tồn tại', stock: 0, hasLot: false, hasHsd: false },
};

// --- Embedded CSS for animations ---
const CustomStyles = () => (
    <style>{`
        @keyframes slide-in-right {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
            animation: slide-in-right 0.4s ease-out forwards;
        }
    `}</style>
);

function CreateGoodDisposal() {
    // --- STATE MANAGEMENT ---
    const [voucherInfo, setVoucherInfo] = useState({
        id: '',
        creationDate: '',
        notes: ''
    });
    const [rows, setRows] = useState([]);
    const [isFormValid, setIsFormValid] = useState(false);

    // Modal & Toast State
    const [modal, setModal] = useState({ type: null, message: '', title: '' });
    const [toast, setToast] = useState({ show: false, message: '' });

    // --- UTILITY & INITIALIZATION HOOKS ---
    const getNewVoucherId = () => {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const seq = '001';
        return `WO-${yyyy}${mm}${dd}-${seq}`;
    };

    const getTodayDate = () => new Date().toISOString().split('T')[0];

    const resetForm = () => {
        setVoucherInfo({
            id: getNewVoucherId(),
            creationDate: getTodayDate(),
            notes: '',
        });
        setRows([]);
        addNewRow(true);
    };

    useEffect(() => {
        resetForm();
    }, []);

    const validateForm = (isDraft = false) => {
        if (rows.length === 0) {
            setIsFormValid(false);
            return;
        }
        const allRowsValid = rows.every(row => Object.keys(validateRow(row, isDraft)).length === 0);
        setIsFormValid(allRowsValid);
    };

    useEffect(() => {
        validateForm();
    }, [rows]);

    // --- ROW & FORM HANDLERS ---
    const addNewRow = (isInitial = false) => {
        const newRow = {
            id: `row-${Date.now()}`,
            sku: '', productName: '', stock: 0,
            hasLot: false, hasHsd: false, lot: '',
            quantity: '', hsd: '', reason: '',
            reasonOther: '', evidence: [], errors: {},
        };
        if (isInitial) {
            setRows([newRow]);
        } else {
            setRows(prevRows => [...prevRows, newRow]);
        }
    };

    const removeRow = (id) => {
        if (rows.length > 1) {
            setRows(prevRows => prevRows.filter(row => row.id !== id));
        }
    };

    const handleVoucherInfoChange = (e) => {
        const { name, value } = e.target;
        setVoucherInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleRowChange = (id, field, value) => {
        setRows(prevRows => prevRows.map(row => {
            if (row.id === id) {
                const updatedRow = { ...row, [field]: value };
                if (field === 'sku') {
                    const product = MOCK_PRODUCTS[value.toUpperCase()] || null;
                    updatedRow.productName = product ? product.name : 'Không tìm thấy SP';
                    updatedRow.stock = product ? product.stock : 0;
                    updatedRow.hasLot = product ? product.hasLot : false;
                    updatedRow.hasHsd = product ? product.hasHsd : false;
                }
                if (field === 'reason' && value !== 'KHAC') {
                    updatedRow.reasonOther = '';
                }
                return { ...updatedRow, errors: validateRow(updatedRow) };
            }
            return row;
        }));
    };

    const handleEvidenceChange = (id, files) => {
        const fileList = Array.from(files);
        setRows(prevRows => prevRows.map(row => {
            if (row.id === id) {
                const updatedRow = { ...row, evidence: [...row.evidence, ...fileList] };
                return { ...updatedRow, errors: validateRow(updatedRow) };
            }
            return row;
        }));
    };

    const removeEvidenceFile = (rowId, fileIndex) => {
        setRows(prevRows => prevRows.map(row => {
            if (row.id === rowId) {
                const updatedEvidence = row.evidence.filter((_, index) => index !== fileIndex);
                const updatedRow = { ...row, evidence: updatedEvidence };
                return { ...updatedRow, errors: validateRow(updatedRow) };
            }
            return row;
        }));
    };

    // --- VALIDATION ---
    const validateRow = (row, isDraft = false) => {
        const errors = {};
        if (!row.sku.trim() || !MOCK_PRODUCTS[row.sku.toUpperCase()]) errors.sku = 'Barcode không hợp lệ.';
        const quantityNum = parseInt(row.quantity, 10);
        if (isNaN(quantityNum) || quantityNum <= 0) {
            errors.quantity = 'SL phải > 0.';
        } else if (quantityNum > row.stock) {
            errors.quantity = 'Vượt tồn kho.';
        }
        if (!row.reason) errors.reason = 'Cần chọn lý do.';
        if (row.reason === 'KHAC' && !row.reasonOther.trim()) {
            errors.reasonOther = 'Cần nhập lý do khác.';
        }
        if (!isDraft && row.evidence.length === 0) {
            errors.evidence = 'Cần bằng chứng.';
        }
        return errors;
    };

    // --- ACTIONS & SUBMISSION ---
    const showToast = (message) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let firstErrorFound = false;
        const validatedRows = rows.map(row => {
            const errors = validateRow(row, false);
            if (Object.keys(errors).length > 0 && !firstErrorFound) {
                firstErrorFound = true;
            }
            return { ...row, errors };
        });
        setRows(validatedRows);

        if (!firstErrorFound && rows.length > 0) {
            setModal({
                type: 'success',
                title: 'Gửi duyệt thành công',
                message: `Phiếu ${voucherInfo.id} đã được gửi đến quản lý.`
            });
        } else {
            showToast('Thông tin chưa hợp lệ. Vui lòng kiểm tra lại.');
        }
    };

    const handleSaveDraft = (e) => {
        e.preventDefault();
        setModal({
            type: 'success',
            title: 'Lưu nháp thành công',
            message: `Phiếu ${voucherInfo.id} đã được lưu vào danh sách nháp.`
        });
    };

    const handleCancel = () => {
        setModal({ type: 'confirmCancel' });
    };

    const confirmCancelAction = () => {
        resetForm();
        setModal({ type: null });
        showToast('Đã hủy phiếu thành công.');
    };

    // --- RENDER ---
    return (
        <>
            <CustomStyles />
            <div className="min-h-screen bg-gray-100 font-sans">
                <div className="container p-4 md:p-6 max-w-7xl">
                    {/* Header */}
                    <header className="card p-5 mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
                                Tạo Phiếu Xuất Hủy
                            </h1>
                            <div className="flex items-center space-x-2">
                                <button onClick={handleCancel} className="btn btn-secondary">Hủy bỏ</button>
                                <button onClick={handleSaveDraft} className="btn btn-primary">Lưu nháp</button>
                                <button onClick={handleSubmit} disabled={!isFormValid} className={`btn ${isFormValid ? 'btn-success' : 'btn:disabled'}`}>Gửi duyệt</button>
                            </div>
                        </div>
                    </header>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* General Info */}
                        <div className="card p-5">
                            <h2 className="text-lg font-semibold text-gray-700 border-b pb-3 mb-4">Thông tin chung</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="voucher-id" className="block text-sm font-medium text-gray-600 mb-1">Số phiếu*</label>
                                    <input type="text" id="voucher-id" name="id" value={voucherInfo.id} className="form-control bg-gray-100 text-gray-600" readOnly />
                                </div>
                                <div>
                                    <label htmlFor="creation-date" className="block text-sm font-medium text-gray-600 mb-1">Ngày lập*</label>
                                    <input type="date" id="creation-date" name="creationDate" value={voucherInfo.creationDate} onChange={handleVoucherInfoChange} className="form-control" />
                                </div>
                                <div className="md:col-span-3">
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-600 mb-1">Ghi chú chung</label>
                                    <textarea id="notes" name="notes" value={voucherInfo.notes} onChange={handleVoucherInfoChange} rows="2" className="form-control" placeholder="Ghi chú chung cho toàn bộ phiếu (nếu có)..."></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Products Table */}
                        <div className="card overflow-hidden">
                            <div className="card-header">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <h2 className="text-lg font-semibold text-gray-700 mb-2 sm:mb-0">Chi tiết hàng hóa hủy</h2>
                                    <button type="button" onClick={() => addNewRow(false)} className="btn btn-primary">
                                        <span className="icon-plus mr-2"></span> Thêm sản phẩm
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            {['Barcode*', 'Tên sản phẩm', 'Lô/Serie', 'SL Hủy*', 'Hạn sử dụng', 'Lý do*', 'Bằng chứng*', ''].map(header => (
                                                <th key={header} scope="col" className="text-left">{header === '' ? <span className="sr-only">Xóa</span> : header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {rows.map((row) => (
                                            <tr key={row.id} className="align-top hover:bg-gray-50">
                                                {/* Barcode */}
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={row.sku}
                                                        onChange={(e) => handleRowChange(row.id, 'sku', e.target.value)}
                                                        placeholder="Nhập Barcode..."
                                                        className={`form-control ${row.errors.sku ? 'is-invalid' : ''}`}
                                                    />
                                                </td>
                                                {/* Product Info */}
                                                <td className="px-4 py-3">
                                                    <p className="text-sm text-gray-800">{row.productName || '---'}</p>
                                                    <p className="text-xs text-gray-500 mt-1">Tồn: {row.stock}</p>
                                                </td>
                                                {/* Lot/Serial */}
                                                <td className="px-4 py-3">
                                                    {row.hasLot && (
                                                        <input
                                                            type="text"
                                                            value={row.lot}
                                                            onChange={(e) => handleRowChange(row.id, 'lot', e.target.value)}
                                                            placeholder="Nhập Lô/Serie"
                                                            className="form-control"
                                                        />
                                                    )}
                                                </td>
                                                {/* Quantity */}
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={row.quantity}
                                                        onChange={(e) => handleRowChange(row.id, 'quantity', e.target.value)}
                                                        placeholder="SL"
                                                        className={`form-control w-24 ${row.errors.quantity ? 'is-invalid' : ''}`}
                                                    />
                                                    {row.errors.quantity && <p className="text-xs text-red-600 mt-1">{row.errors.quantity}</p>}
                                                </td>
                                                {/* HSD */}
                                                <td className="px-4 py-3">
                                                    {row.hasHsd && (
                                                        <input
                                                            type="date"
                                                            value={row.hsd}
                                                            onChange={(e) => handleRowChange(row.id, 'hsd', e.target.value)}
                                                            className="form-control"
                                                        />
                                                    )}
                                                </td>
                                                {/* Reason */}
                                                <td className="px-4 py-3">
                                                    <select
                                                        value={row.reason}
                                                        onChange={(e) => handleRowChange(row.id, 'reason', e.target.value)}
                                                        className={`form-control ${row.errors.reason ? 'is-invalid' : ''}`}
                                                    >
                                                        <option value="">-- Chọn --</option>
                                                        <option value="HET_HAN">Hết hạn</option>
                                                        <option value="HONG_VO">Hỏng vỡ</option>
                                                        <option value="LOI_NCC">Lỗi NCC</option>
                                                        <option value="KHAC">Khác</option>
                                                    </select>
                                                    {row.reason === 'KHAC' && (
                                                        <input
                                                            type="text"
                                                            value={row.reasonOther}
                                                            onChange={(e) => handleRowChange(row.id, 'reasonOther', e.target.value)}
                                                            placeholder="Nhập lý do khác..."
                                                            className={`form-control mt-2 ${row.errors.reasonOther ? 'is-invalid' : ''}`}
                                                        />
                                                    )}
                                                </td>
                                                {/* Evidence */}
                                                <td className="px-4 py-3">
                                                    <label
                                                        className={`cursor-pointer flex items-center justify-center w-full h-10 bg-gray-50 text-gray-600 rounded-md border-2 border-dashed hover:bg-gray-100 ${row.errors.evidence ? 'border-red-400' : 'border-gray-300'}`}
                                                    >
                                                        <span className="icon-upload mr-2"></span>
                                                        <span>Tải lên</span>
                                                        <input
                                                            type="file"
                                                            onChange={(e) => handleEvidenceChange(row.id, e.target.files)}
                                                            className="hidden"
                                                            multiple
                                                        />
                                                    </label>
                                                    <div className="mt-2 space-y-1">
                                                        {row.evidence.map((file, index) => (
                                                            <div key={index} className="flex items-center justify-between text-xs bg-gray-100 px-2 py-1 rounded">
                                                                <span className="truncate pr-2">{file.name}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeEvidenceFile(row.id, index)}
                                                                    className="text-gray-500 hover:text-red-500"
                                                                >
                                                                    <span className="icon-x w-4 h-4"></span>
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                {/* Remove Button */}
                                                <td className="px-4 py-3 text-right">
                                                    {rows.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeRow(row.id)}
                                                            className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50"
                                                        >
                                                            <span className="icon-trash w-5 h-5"></span>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {rows.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">Vui lòng thêm sản phẩm để tạo phiếu hủy.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>

                    {/* Modals & Notifications */}
                    {modal.type && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                {modal.type === 'confirmCancel' && (
                                    <>
                                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full mb-4">
                                            <span className="icon-alert-triangle w-6 h-6 text-yellow-500"></span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">Xác nhận hủy</h3>
                                        <p className="text-sm text-gray-600 mt-2 mb-6">
                                            Bạn có chắc muốn hủy phiếu này? Hành động này không thể hoàn tác.
                                        </p>
                                        <div className="flex space-x-2">
                                            <button onClick={() => setModal({ type: null })} className="flex-1 btn btn-secondary">
                                                Không
                                            </button>
                                            <button onClick={confirmCancelAction} className="flex-1 btn btn-danger">
                                                Xác nhận
                                            </button>
                                        </div>
                                    </>
                                )}
                                {modal.type === 'success' && (
                                    <>
                                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
                                            <span className="icon-check-circle w-6 h-6 text-green-500"></span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">{modal.title}</h3>
                                        <p className="text-sm text-gray-600 mt-2 mb-6">{modal.message}</p>
                                        <button onClick={() => setModal({ type: null })} className="w-full btn btn-success">
                                            OK
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                    {toast.show && (
                        <div className="toast animate-slide-in-right">
                            <span className="icon-alert-triangle w-5 h-5 mr-3"></span>
                            <p className="text-sm font-medium">{toast.message}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default CreateGoodDisposal;
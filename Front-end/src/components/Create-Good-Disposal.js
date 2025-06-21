import React, { useState, useEffect } from 'react';

// --- ICONS (as self-contained React Components) ---
const Plus = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const Trash2 = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>;
const Upload = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>;
const X = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>;
const AlertTriangle = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>;
const CheckCircle2 = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>;
const Package = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16.5 9.4a.5.5 0 0 1 0 .8L12 13.3l-4.5-3.1a.5.5 0 0 1 0-.8l4.5-3.1a.5.5 0 0 1 .5 0l4.5 3.1Z"/><path d="M12 22V12"/><path d="m21 12-9 6.5-9-6.5"/><path d="M3 12v-2c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v2"/><path d="M3 10.5V8l9-6.5 9 6.5v2.5"/></svg>;
const Calendar = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const FileText = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>;

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
        // Clear existing rows and add a single new one
        setRows([]); 
        addNewRow(true); // `true` to indicate it's the initial row
    };

    // Add this to the top of your component
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

    // Update the validation effect
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
                <div className="container mx-auto p-4 md:p-6 max-w-7xl">
                    {/* Header */}
                    <header className="bg-white rounded-lg shadow-sm p-5 mb-6 border border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
                                Tạo Phiếu Xuất Hủy
                            </h1>
                            <div className="flex items-center space-x-2">
                                <button onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors">Hủy bỏ</button>
                                <button onClick={handleSaveDraft} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 transition-colors">Lưu nháp</button>
                                <button onClick={handleSubmit} disabled={!isFormValid} className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm transition-colors ${isFormValid ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}>Gửi duyệt</button>
                            </div>
                        </div>
                    </header>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* General Info */}
                        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-3 mb-4">Thông tin chung</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="voucher-id" className="block text-sm font-medium text-gray-600 mb-1">Số phiếu*</label>
                                    <input type="text" id="voucher-id" name="id" value={voucherInfo.id} className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600" readOnly />
                                </div>
                                <div>
                                    <label htmlFor="creation-date" className="block text-sm font-medium text-gray-600 mb-1">Ngày lập*</label>
                                    <input type="date" id="creation-date" name="creationDate" value={voucherInfo.creationDate} onChange={handleVoucherInfoChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                                </div>
                                <div className="md:col-span-3">
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-600 mb-1">Ghi chú chung</label>
                                    <textarea id="notes" name="notes" value={voucherInfo.notes} onChange={handleVoucherInfoChange} rows="2" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" placeholder="Ghi chú chung cho toàn bộ phiếu (nếu có)..."></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Products Table */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                             <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <h2 className="text-lg font-semibold text-gray-700 mb-2 sm:mb-0">Chi tiết hàng hóa hủy</h2>
                                    <button type="button" onClick={() => addNewRow(false)} className="flex items-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md shadow-sm transition-colors">
                                        <Plus className="w-4 h-4 mr-2" /> Thêm sản phẩm
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                                        <tr>
                                            {['Barcode*', 'Tên sản phẩm', 'Lô/Serie', 'SL Hủy*', 'Hạn sử dụng', 'Lý do*', 'Bằng chứng*', ''].map(header => (
                                                <th key={header} scope="col" className="px-4 py-3 text-left tracking-wider">{header === '' ? <span className="sr-only">Xóa</span> : header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {rows.map((row) => (
                                            <tr key={row.id} className="align-top hover:bg-gray-50">
                                                {/* Barcode */}
                                                <td className="px-4 py-3"><input type="text" value={row.sku} onChange={(e) => handleRowChange(row.id, 'sku', e.target.value)} placeholder="Nhập Barcode..." className={`w-full text-sm p-2 border rounded-md ${row.errors.sku ? 'border-red-500' : 'border-gray-300'}`} /></td>
                                                {/* Product Info */}
                                                <td className="px-4 py-3"><p className="text-sm text-gray-800">{row.productName || '---'}</p><p className="text-xs text-gray-500 mt-1">Tồn: {row.stock}</p></td>
                                                {/* Lot/Serial */}
                                                <td className="px-4 py-3">{row.hasLot && <input type="text" value={row.lot} onChange={(e) => handleRowChange(row.id, 'lot', e.target.value)} placeholder="Nhập Lô/Serie" className="w-full text-sm p-2 border border-gray-300 rounded-md" />}</td>
                                                {/* Quantity */}
                                                <td className="px-4 py-3"><input type="number" min="1" value={row.quantity} onChange={(e) => handleRowChange(row.id, 'quantity', e.target.value)} placeholder="SL" className={`w-24 text-sm p-2 border rounded-md ${row.errors.quantity ? 'border-red-500' : 'border-gray-300'}`} />{row.errors.quantity && <p className="text-xs text-red-600 mt-1">{row.errors.quantity}</p>}</td>
                                                {/* HSD */}
                                                <td className="px-4 py-3">{row.hasHsd && <input type="date" value={row.hsd} onChange={(e) => handleRowChange(row.id, 'hsd', e.target.value)} className="w-full text-sm p-2 border border-gray-300 rounded-md" />}</td>
                                                {/* Reason */}
                                                <td className="px-4 py-3">
                                                    <select value={row.reason} onChange={(e) => handleRowChange(row.id, 'reason', e.target.value)} className={`w-full text-sm p-2 border rounded-md ${row.errors.reason ? 'border-red-500' : 'border-gray-300'}`}>
                                                        <option value="">-- Chọn --</option>
                                                        <option value="HET_HAN">Hết hạn</option>
                                                        <option value="HONG_VO">Hỏng vỡ</option>
                                                        <option value="LOI_NCC">Lỗi NCC</option>
                                                        <option value="KHAC">Khác</option>
                                                    </select>
                                                    {row.reason === 'KHAC' && <input type="text" value={row.reasonOther} onChange={(e) => handleRowChange(row.id, 'reasonOther', e.target.value)} placeholder="Nhập lý do khác..." className={`w-full text-sm p-2 border rounded-md mt-2 ${row.errors.reasonOther ? 'border-red-500' : 'border-gray-300'}`} />}
                                                </td>
                                                {/* Evidence */}
                                                <td className="px-4 py-3">
                                                    <label className={`cursor-pointer flex items-center justify-center w-full h-10 bg-gray-50 text-gray-600 rounded-md border-2 border-dashed hover:bg-gray-100 ${row.errors.evidence ? 'border-red-400' : 'border-gray-300'}`}><Upload className="w-4 h-4 mr-2" /><span>Tải lên</span><input type="file" onChange={(e) => handleEvidenceChange(row.id, e.target.files)} className="hidden" multiple /></label>
                                                    <div className="mt-2 space-y-1">{row.evidence.map((file, index) => (<div key={index} className="flex items-center justify-between text-xs bg-gray-100 px-2 py-1 rounded"><span className="truncate pr-2">{file.name}</span><button type="button" onClick={() => removeEvidenceFile(row.id, index)} className="text-gray-500 hover:text-red-500"><X className="w-4 h-4" /></button></div>))}</div>
                                                </td>
                                                {/* Remove Button */}
                                                <td className="px-4 py-3 text-right">{rows.length > 1 && <button type="button" onClick={() => removeRow(row.id)} className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50"><Trash2 className="w-5 h-5" /></button>}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {rows.length === 0 && <div className="text-center py-8"><p className="text-gray-500">Vui lòng thêm sản phẩm để tạo phiếu hủy.</p></div>}
                            </div>
                        </div>
                    </form>

                    {/* Modals & Notifications */}
                    {modal.type && <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
                            {modal.type === 'confirmCancel' && <>
                                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full mb-4"><AlertTriangle className="h-6 w-6 text-yellow-500"/></div>
                                <h3 className="text-lg font-semibold text-gray-800">Xác nhận hủy</h3>
                                <p className="text-sm text-gray-600 mt-2 mb-6">Bạn có chắc muốn hủy phiếu này? Hành động này không thể hoàn tác.</p>
                                <div className="flex space-x-2">
                                    <button onClick={() => setModal({ type: null })} className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300">Không</button>
                                    <button onClick={confirmCancelAction} className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700">Xác nhận</button>
                                </div>
                            </>}
                            {modal.type === 'success' && <>
                                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4"><CheckCircle2 className="h-6 w-6 text-green-500"/></div>
                                <h3 className="text-lg font-semibold text-gray-800">{modal.title}</h3>
                                <p className="text-sm text-gray-600 mt-2 mb-6">{modal.message}</p>
                                <button onClick={() => setModal({ type: null })} className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700">OK</button>
                            </>}
                        </div>
                    </div>}
                    {toast.show && <div className="fixed bottom-5 right-5 bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-center animate-slide-in-right"><AlertTriangle className="w-5 h-5 mr-3"/> <p className="text-sm font-medium">{toast.message}</p></div>}
                </div>
            </div>
        </>
    );
}

// Default export
export default CreateGoodDisposal;

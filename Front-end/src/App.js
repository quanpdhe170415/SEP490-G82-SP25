// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import 'react-toastify/dist/ReactToastify.css';
import BillHistoryPage from './components/BillHistoryPage';
import ReturnGoods from './components/ReturnGoods';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/bill-history" element={<BillHistoryPage />} />
        <Route path="/return-goods" element={<ReturnGoods/>} />
        {/* Thêm các route khác nếu cần */}
      </Routes>
    </Router>
  );
}

export default App;

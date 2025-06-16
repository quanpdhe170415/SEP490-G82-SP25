// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import 'react-toastify/dist/ReactToastify.css';

import BillHistoryPage from './components/BillHistoryPage';

import ForgotPassword from './components/ForgotPassword';
import HomeForCashier from './components/HomeforCashier';
import PurchaseHistory from "./components/PurchaseHistory";
import GoodsDisposal from './components/GoodsDisposal';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/homecashier" element={<HomeForCashier />} />
        <Route path="/bill-history" element={<BillHistoryPage />} />
        <Route path="/bill-export-history" element={<PurchaseHistory />} />
        <Route path="/goods-disposal" element={<GoodsDisposal/>}/>
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import 'react-toastify/dist/ReactToastify.css';

import BillHistoryPage from './components/BillHistoryPage';
import ReturnGoods from './components/ReturnGoods';
import ForgotPassword from './components/ForgotPassword';
import HomeForCashier from './components/HomeforCashier';

import ImportHistory from "./components/ImportHistory";

import OpenShift from './components/OpenShift';
import CloseShift from './components/CloseShift';
import POS from './components/POS';
import PurchaseHistory from "./components/PurchaseHistory";




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/openshift" element={<OpenShift />} />
        <Route path="/closeshift" element={<CloseShift />} />
        <Route path="/POS" element={<POS />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/bill-history" element={<BillHistoryPage />} />
        <Route path="/return-goods" element={<ReturnGoods/>} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/homecashier" element={<HomeForCashier />} />
        <Route path="/openshift" element={<OpenShift />} />
        <Route path="/bill-history" element={<BillHistoryPage />} />
        <Route path="/import-history" element={<ImportHistory />} />
      </Routes>
    </Router>
  );
}

export default App;

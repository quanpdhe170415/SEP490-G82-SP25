import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import 'react-toastify/dist/ReactToastify.css';

import BillHistoryPage from './components/BillHistoryPage';
import ReturnGoods from './components/ReturnGoods';
import ForgotPassword from './components/ForgotPassword';
import HomeForCashier from './components/HomeforCashier';
import GoodsDisposal from './components/GoodsDisposal';
import ImportHistory from "./components/ImportHistory";
import GoodsDisposalDetail from './components/GoodsDisposalDetail';
import OpenShift from './components/OpenShift';
import CloseShift from './components/CloseShift';
import POS from './components/POS';
import CashierSidebar from './components/CashierSidebar';

import { UIProvider } from './contexts/UIContext';

import Sidebar2 from './components/Sidebar2'
import InventorySchedule from './pages/InventorySchedule/InventorySchedule';
import Page from './pages/page';
import Inventory from './pages/Inventory/Inventory';
import CashierLayout from './components/cashier/CashierLayout';


function App() {
  return (
    <UIProvider>
      <Router>
        <Routes>
          <Route path="/openshift" element={<OpenShift />} />
        <Route path="/closeshift" element={<CloseShift />} />
        <Route path="/POS" element={<POS />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/bill-history" element={<BillHistoryPage />} />
        {/* <Route path="/bill-export-history" element={<PurchaseHistory />} /> */}
        <Route path="/goods-disposal" element={<GoodsDisposal/>}/>
        <Route path="/goods-disposal-detail/:id" element={<GoodsDisposalDetail />} />
        <Route path="/return-goods" element={<ReturnGoods/>} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        {/* <Route path="/homecashier" element={<HomeForCashier />} /> */}
        <Route path="/openshift" element={<OpenShift />} />
        <Route path="/bill-history" element={<BillHistoryPage />} />
        <Route path="/import-history" element={<ImportHistory />} />
        <Route path="/inventory/inventory-schedule" element={<InventorySchedule />} />
        <Route path='/inventory/inventory-schedule/inventory-control' element={<Inventory />} />
        <Route path="/cashier/*" element={<Sidebar2 />} />
        <Route path="/page" element={<Page />} />


      </Routes>
    </Router>
  </UIProvider>
  );
}

export default App;

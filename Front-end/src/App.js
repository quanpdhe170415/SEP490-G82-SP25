// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import 'react-toastify/dist/ReactToastify.css';


import ForgotPassword from './components/ForgotPassword';
import HomeForCashier from './components/HomeforCashier';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/homecashier" element={<HomeForCashier />} />
      </Routes>
    </Router>
  );
}

export default App;

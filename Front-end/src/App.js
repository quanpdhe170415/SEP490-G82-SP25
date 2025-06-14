import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OpenShift from './components/OpenShift';
import CloseShift from './components/CloseShift';
import POS from './components/POS';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/openshift" element={<OpenShift />} />
        <Route path="/closeshift" element={<CloseShift />} />
        <Route path="/POS" element={<POS />} />
      </Routes>
    </Router>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OpenShift from './components/OpenShift';
import CloseShift from './components/CloseShift';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/openshift" element={<OpenShift />} />
        <Route path="/closeshift" element={<CloseShift />} />
      </Routes>
    </Router>
  );
}

export default App;

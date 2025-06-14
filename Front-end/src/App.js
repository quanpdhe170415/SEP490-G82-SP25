import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OpenShift from './components/OpenShift';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/openshift" element={<OpenShift />} />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import PDV from './pages/PDV';
import Reports from './pages/Reports';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/pdv" element={<PDV />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </Layout>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;

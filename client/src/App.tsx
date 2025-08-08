import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import KPIDetails from './pages/KPIDetails';
import CashFlow from './pages/CashFlow';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/kpi" element={<KPIDetails />} />
          <Route path="/cashflow" element={<CashFlow />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
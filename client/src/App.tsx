import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import KPIDetails from './pages/KPIDetails';
import CashFlow from './pages/CashFlow';
import SubsidyManagement from './pages/Subsidy';
import ProcessAutomation from './pages/Process';
import RiskManagement from './pages/Risk';
import ProjectManagement from './pages/Project';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/kpi" element={<KPIDetails />} />
          <Route path="/cashflow" element={<CashFlow />} />
          <Route path="/subsidy" element={<SubsidyManagement />} />
          <Route path="/process" element={<ProcessAutomation />} />
          <Route path="/risk" element={<RiskManagement />} />
          <Route path="/project" element={<ProjectManagement />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
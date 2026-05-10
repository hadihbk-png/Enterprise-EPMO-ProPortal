import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell.jsx'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'
import Budget from './pages/Budget.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import Milestones from './pages/Milestones.jsx'
import NotFound from './pages/NotFound.jsx'
import Portfolio from './pages/Portfolio.jsx'
import ProgramDetail from './pages/ProgramDetail.jsx'
import Programs from './pages/Programs.jsx'
import Reports from './pages/Reports.jsx'
import Register from './pages/Register.jsx'
import RisksIssues from './pages/RisksIssues.jsx'
import Settings from './pages/Settings.jsx'
import Stakeholders from './pages/Stakeholders.jsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:id" element={<ProgramDetail />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/risks" element={<RisksIssues />} />
          <Route path="/risks-issues" element={<RisksIssues />} />
          <Route path="/stakeholders" element={<Stakeholders />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/milestones" element={<Milestones />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App

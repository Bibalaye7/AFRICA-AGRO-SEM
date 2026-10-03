import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense, type ReactNode } from 'react'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import AuthPage from './pages/AuthPage'
import SeedsPage from './pages/SeedsPage'
import PartnershipPage from './pages/PartnershipPage'
import VerifyLotPage from './pages/VerifyLotPage'
import ActivitiesPage from './pages/ActivitiesPage'
import ElevagePage from './pages/ElevagePage'
import EngraisPage from './pages/EngraisPage'
import ScrollManager from './components/ScrollManager'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Chargé à la demande : les visiteurs du site public ne téléchargent pas le code du tableau de bord.
const DashboardPage = lazy(() => import('./pages/DashboardPage'))

// Le tableau de bord est réservé aux comptes de l'équipe (agents et administrateurs).
function StaffRoute({ children }: { children: ReactNode }) {
  const { loading, isStaff } = useAuth()

  if (loading) return <div className="min-h-screen bg-gray-50" />
  if (!isStaff) return <Navigate to="/auth" replace />

  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollManager />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/nos-activites" element={<ActivitiesPage />} />
          <Route path="/elevage" element={<ElevagePage />} />
          <Route path="/engrais" element={<EngraisPage />} />
          <Route path="/semences" element={<SeedsPage />} />
          <Route path="/partenariats" element={<PartnershipPage />} />
          <Route path="/verifier-lot" element={<VerifyLotPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/tableau-de-bord" element={<StaffRoute><Suspense fallback={<div className="min-h-screen bg-gray-50" />}><DashboardPage /></Suspense></StaffRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

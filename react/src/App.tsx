import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense, type ReactNode } from 'react'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import AuthPage from './pages/AuthPage'
import SeedsPage from './pages/SeedsPage'
import PartnershipPage from './pages/PartnershipPage'
import VerifyLotPage from './pages/VerifyLotPage'
import ScrollManager from './components/ScrollManager'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { isDemoMode } from './lib/campaignStore'

// Chargé à la demande : les visiteurs du site public ne téléchargent pas le code du tableau de bord.
const DashboardPage = lazy(() => import('./pages/DashboardPage'))

// Le tableau de bord est réservé aux comptes « admin » ou « agent ».
// En mode démo (Supabase non configuré), il reste accessible pour découvrir l'outil.
function StaffRoute({ children }: { children: ReactNode }) {
  const { loading, user, role, isStaff } = useAuth()

  if (isDemoMode) return children
  if (loading || (user && role === null)) return <div className="min-h-screen bg-gray-50" />
  if (!user) return <Navigate to="/auth" replace state={{ from: '/tableau-de-bord' }} />
  if (!isStaff) return <Navigate to="/auth" replace state={{ notStaff: true }} />

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

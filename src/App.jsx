import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import StudentHome from './pages/StudentHome'
import DealDetail from './pages/DealDetail'
import BusinessDashboard from './pages/BusinessDashboard'
import PostDeal from './pages/PostDeal'
import Favorites from './pages/Favorites'
import MyClaims from './pages/MyClaims'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/deals" element={<StudentHome />} />
          <Route path="/deals/:id" element={<DealDetail />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedType="business">
                <BusinessDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-deal"
            element={
              <ProtectedRoute allowedType="business">
                <PostDeal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute allowedType="student">
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-claims"
            element={
              <ProtectedRoute allowedType="student">
                <MyClaims />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

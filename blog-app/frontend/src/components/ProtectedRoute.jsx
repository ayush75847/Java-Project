import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Wrap a page with this to require login (and optionally the ADMIN role).
// Note: this only hides pages in the browser. The real protection is in the Spring Boot backend.
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) return <p>Loading...</p>
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin) return <p>Only admins can see this page.</p>
  return children
}

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, managerOnly = false }) {
  const { isAuthenticated, canManage, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-[11px] font-bold tracking-[0.25em] text-muted uppercase">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />
  if (managerOnly && !canManage) return <Navigate to="/admin/dashboard" replace />
  return children
}

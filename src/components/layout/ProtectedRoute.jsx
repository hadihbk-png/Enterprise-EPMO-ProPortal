import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth.js'

export default function ProtectedRoute() {
  const { user, isAuthLoading } = useAuth()
  const location = useLocation()

  if (isAuthLoading) {
    return (
      <div className="grid min-h-screen place-items-center text-slate-200">
        <div className="glass-card p-6">Loading workspace...</div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />

  return <Outlet />
}

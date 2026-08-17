import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import Loader from '../Loader'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, checking } = useAdminAuth()
  const location = useLocation()

  if (checking) return <Loader fullScreen />
  if (!isAuthenticated) return <Navigate to="/admin/login" replace state={{ from: location }} />

  return children
}

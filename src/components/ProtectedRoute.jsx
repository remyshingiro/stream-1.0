import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('admin_token') === 'true';

  if (!isAuthenticated) {
    // Kick them to login if they don't have the token
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
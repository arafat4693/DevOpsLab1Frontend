import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
  const isAuthenticated = localStorage.getItem('user') ? true : false;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

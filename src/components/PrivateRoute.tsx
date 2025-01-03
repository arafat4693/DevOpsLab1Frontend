import { Navigate, Outlet } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

export default function PrivateRoute() {
  const isAuthenticated = localStorage.getItem('user') ? true : false;

  // const { keycloak, initialized } = useKeycloak();

  // if (!initialized) {
  //   return <div>Loading...</div>;
  // }

  // const isAuthenticated = keycloak.authenticated;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

import { Navigate } from 'react-router-dom';
import PatientProfile from './PatientProfile';
import Patients from './Patients';
import { useAuth } from '@/context/AuthProvider';
import { useKeycloak } from '@react-keycloak/web';

export default function Dashboard() {
  const auth = useAuth();
  const { keycloak } = useKeycloak();

  if (!auth.userIsAuthenticated()) {
    return <Navigate to="/login" />;
  }

  console.log(keycloak.token);

  return auth.user?.role === 'PATIENT' ? <PatientProfile /> : <Patients />;
}

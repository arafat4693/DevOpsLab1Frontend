import { useAuth } from '@/context/AuthProvider';
import { Navigate } from 'react-router-dom';
import PatientProfile from './PatientProfile';
import Patients from './Patients';

export default function Dashboard() {
  const auth = useAuth();
  const isLoggedIn = auth.userIsAuthenticated();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return auth.user?.role === 'PATIENT' ? <PatientProfile /> : <Patients />;
}

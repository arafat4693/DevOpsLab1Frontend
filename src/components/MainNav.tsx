import { useAuth } from '@/context/AuthProvider';
import { Link } from 'react-router-dom';

export default function MainNav() {
  const auth = useAuth();

  return (
    <nav className="flex items-center mx-8 space-x-4 lg:space-x-6">
      {auth.getUser()?.role !== 'PATIENT' ? (
        <Link
          to="/patients"
          className="text-sm font-medium transition-colors text-muted-foreground hover:text-primary"
        >
          Patients
        </Link>
      ) : (
        <Link
          to="/"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Overview
        </Link>
      )}

      <Link
        to="/patient-messaging"
        className="text-sm font-medium transition-colors text-muted-foreground hover:text-primary"
      >
        Messages
      </Link>
    </nav>
  );
}

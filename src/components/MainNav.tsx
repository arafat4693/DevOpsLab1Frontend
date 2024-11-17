import { CurrentUser } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function MainNav() {
  const [role, setRole] = useState<string | null>(null);
  // get user role from local storage
  useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const user = JSON.parse(storedUser) as CurrentUser;
    setRole(user.role);
  }}, []);

  return (
    <nav className="flex items-center mx-8 space-x-4 lg:space-x-6">
      {role === 'doctor' ? (
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

      <Link
        to="/settings"
        className="text-sm font-medium transition-colors text-muted-foreground hover:text-primary"
      >
        settings
      </Link>
    </nav>
  );
}

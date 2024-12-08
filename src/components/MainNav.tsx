import { Link } from 'react-router-dom';

export default function MainNav() {
  return (
    <nav className="flex items-center mx-8 space-x-4 lg:space-x-6">
      <Link
        to="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Overview
      </Link>

      <Link
        to="/patient-messaging"
        className="text-sm font-medium transition-colors text-muted-foreground hover:text-primary"
      >
        Messages
      </Link>
      <Link
        to="/images"
        className="text-sm font-medium transition-colors text-muted-foreground hover:text-primary"
      >
        Images
      </Link>
      <Link
        to="/search"
        className="text-sm font-medium transition-colors text-muted-foreground hover:text-primary"
      >
        Search
      </Link>
    </nav>
  );
}

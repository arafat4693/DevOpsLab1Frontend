import MainNav from './MainNav';
import { Button } from '@/components/ui/button';
import ModeToggle from './ModeToggle';
import { useAuth } from '@/context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

interface Props {
  children: JSX.Element;
}

export default function Layout({ children }: Props) {
  const auth = useAuth();
  const navigate = useNavigate();
  const { keycloak } = useKeycloak();

  function handleLogOut() {
    auth.userLogout();
    keycloak.logout();
    // navigate('/login', { replace: true });
  }

  return (
    <main className="flex-col">
      <div className="border-b">
        <div className="flex items-center h-16 px-4">
          <h2 className="text-xl font-semibold">Journal</h2>
          <MainNav />

          <div className="flex items-center ml-auto space-x-4">
            <Button onClick={handleLogOut}>Log out</Button>
            <ModeToggle />
          </div>
        </div>
      </div>
      {children}
    </main>
  );
}

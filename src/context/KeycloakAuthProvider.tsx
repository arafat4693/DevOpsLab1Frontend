// context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { KeycloakUser } from '@/lib/types';

interface AuthContextType {
  user: KeycloakUser | null;
  getUser: () => KeycloakUser | null;
  userIsAuthenticated: () => boolean;
  userLogin: () => void;
  userLogout: () => void;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export function KeycloakAuthProvider({ children }: { children: JSX.Element }) {
  const { keycloak } = useKeycloak();
  const [user, setUser] = useState<KeycloakUser | null>(null);

  useEffect(() => {
    if (keycloak?.authenticated) {
      const userData: KeycloakUser = {
        email: keycloak.tokenParsed?.email || '',
        firstName: keycloak.tokenParsed?.given_name || '',
        lastName: keycloak.tokenParsed?.family_name || '',
        roles: keycloak.realmAccess?.roles || [],
      };
      setUser(userData);
    } else {
      setUser(null);
    }
  }, [keycloak?.authenticated]);

  function getUser() {
    return user;
  }

  function userIsAuthenticated() {
    return !!keycloak?.authenticated;
  }

  async function userLogin() {
    try {
      await keycloak?.login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  async function userLogout() {
    try {
      await keycloak?.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  function hasRole(role: string) {
    return (
      keycloak?.hasResourceRole(role) || keycloak?.hasRealmRole(role) || false
    );
  }

  const contextValue = {
    user,
    getUser,
    userIsAuthenticated,
    userLogin,
    userLogout,
    hasRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

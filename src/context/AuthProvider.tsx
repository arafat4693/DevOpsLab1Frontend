import { CurrentUser, IAuthContext } from '@/lib/types';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext<IAuthContext>(null!);

export default function AuthProvider({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    setUser(
      storedUser == null ? null : (JSON.parse(storedUser) as CurrentUser)
    );
  }, [setUser]);

  function getUser() {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;
    return JSON.parse(storedUser) as CurrentUser;
  }

  function userIsAuthenticated() {
    return localStorage.getItem('user') !== null;
  }

  function userLogin(user: CurrentUser) {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  }

  function userLogout() {
    localStorage.removeItem('user');
    setUser(null);
  }

  const contextValue = {
    user,
    getUser,
    userIsAuthenticated,
    userLogin,
    userLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export interface CurrentUser {
  email: string;
  name: string;
  role: string;
  token: string;
}

export interface IAuthContext {
  user: CurrentUser | null;
  getUser: () => CurrentUser | null;
  userIsAuthenticated: () => boolean;
  userLogin: (user: CurrentUser) => void;
  userLogout: () => void;
}

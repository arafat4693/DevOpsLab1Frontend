export interface CurrentUser {
  id: number;
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

export interface IMessageResponse {
  senderId: number;
  senderName: string;
  recipientId: number;
  message: string;
  timestamp: Date;
}

export interface IRecipientResponse {
  id: number;
  name: string;
  role: string;
}

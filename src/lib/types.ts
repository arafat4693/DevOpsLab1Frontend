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

export interface IPatientProfile {
  id: number;
  account: Omit<CurrentUser, 'token'>;
  conditions: ICondition[];
  notes: INotes[];
}

export interface ICondition {
  id: number;
  name: string;
  description: string;
}

export interface INotes {
  id: number;
  content: string;
}

export interface IImage {
  id: number;
  cloudinaryPublicId: string;
  imageUrl: string;
  practitionerId: number;
  updatedAt: string;
  createdAt: string;
}

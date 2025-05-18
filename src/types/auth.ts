

import type { Role, User } from './user';

export interface AuthContextValue {
  user: User | null;
  setUser: (user: User) => void;
  login: (token: string) => void;
  logout: () => void;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

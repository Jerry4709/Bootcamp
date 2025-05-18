import type { RegisterPayload } from '@/services/auth.service';
import { createContext } from 'react';

export interface User {
  id: number;
  student_id: string | null;
  email: string | null;
  firstname: string;
  lastname: string;
  role: 'STUDENT' | 'STAFF' | 'ADMIN';
  is_banned: boolean;
  faculty_id: number | null;
  major_id: number | null;
  faculty_name?: string;
  major_name?: string;
  created_at: string;
  profile_image: string | null;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface AuthContextType {
  user: User | null
  isAuthReady: boolean
  login: (token: string) => void
  logout: () => void
  setUser: (u: User | null) => void
  /* เพิ่ม */
  signUp: (payload: RegisterPayload) => Promise<User>
  loginWithCredentials: (
    email: string,
    password: string,
  ) => Promise<{ accessToken: string; user: User }>
}

export interface RegisterData {
  firstname: string;
  lastname: string;
  student_id: string;
  faculty_id: number;
  major_id: number;
  email: string;
  password: string;
  role: 'STUDENT';
}

export const AuthContext = createContext<AuthContextType | null>(null);
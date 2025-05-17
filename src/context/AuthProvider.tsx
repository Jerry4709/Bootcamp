import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '@/types/user';
import * as authService from '@/services/auth.service';
import axiosInstance from '@/services/axios';

interface SignUpData {
  firstname: string;
  lastname: string;
  studentId: string;
  faculty: string;
  field: string;
  status: string;
  email: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  login: (token: string) => void;
  loginAction: (email: string, password: string) => Promise<{accessToken: string, user: User}>;
  signUp: (data: SignUpData) => Promise<void>;
  logout: () => void;
  isAuthReady: boolean;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* ────────────────────────────────────────────────────────────────────────── */

const LOCAL_STORAGE_KEY = 'volunteerhub_token';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  /* ----------------------- util ----------------------- */
  const setToken = (token: string | null) => {
    if (token) {
      localStorage.setItem(LOCAL_STORAGE_KEY, token);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      delete axiosInstance.defaults.headers.common.Authorization;
    }
  };

  /* ----------------------- actions ----------------------- */
  // ฟังก์ชันลงทะเบียนผู้ใช้ใหม่
  const signUp = useCallback(async (data: SignUpData) => {
    try {
      // แปลงข้อมูลให้ตรงกับรูปแบบที่ API ต้องการ
      const registerData = {
        student_id: data.studentId,
        email: data.email,
        password: data.password,
        firstname: data.firstname,
        lastname: data.lastname,
        faculty_id: data.faculty ? parseInt(data.faculty) : undefined,
        major_id: data.field ? parseInt(data.field) : undefined,
      };
      
      // เรียกใช้ API ลงทะเบียน
      const { accessToken, user } = await authService.register(registerData);
      
      // บันทึก token และข้อมูลผู้ใช้
      setToken(accessToken);
      setUser(user);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  }, []);

  // ฟังก์ชันเข้าสู่ระบบด้วย email และ password
  const loginAction = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      const { accessToken, user } = response;
      
      // บันทึก token และข้อมูลผู้ใช้
      setToken(accessToken);
      setUser(user);
      
      // Log เพื่อตรวจสอบข้อมูลผู้ใช้ (โดยเฉพาะ role)
      console.log('User logged in:', user);
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  // ฟังก์ชันเข้าสู่ระบบด้วย token ที่มีอยู่แล้ว
  const login = useCallback((token: string) => {
    setToken(token);
  }, []);

  // ฟังก์ชันออกจากระบบ
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  // ฟังก์ชันอัปเดตข้อมูลผู้ใช้
  const setUserProfile = useCallback((user: User) => {
    setUser(user);
  }, []);

  /* ----------------------- bootstrap ----------------------- */
  useEffect(() => {
    const bootstrap = async () => {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);

      if (!saved) {
        setIsAuthReady(true);
        return;
      }

      try {
        setToken(saved);
        const user = await authService.me(); // ตรวจสอบ token, ดึง profile
        setUser(user);
        console.log('User session restored:', user);
      } catch (err) {
        console.error('Failed to restore session:', err);
        setToken(null);
        setUser(null);
      } finally {
        setIsAuthReady(true);
      }
    };
    bootstrap();
  }, []);

  /* ----------------------- interceptor refresh token ----------------------- */
 useEffect(() => {
  const id = axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config;
      
      if (
        error.response?.status === 401 &&
        error.response?.data?.message === 'Session หมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง' &&
        !original._retry
      ) {
        // Token has been invalidated by another login
        logout();
        // Redirect to login page with a message
        window.location.href = '/login?message=session_expired';
        return Promise.reject(error);
      }
      
      if (
        error.response?.status === 401 &&
        !original._retry &&
        localStorage.getItem(LOCAL_STORAGE_KEY)
      ) {
        original._retry = true;
        try {
          const { accessToken } = await authService.refresh();
          setToken(accessToken);
          return axiosInstance(original); // retry
        } catch (_) {
          logout();
        }
      }
      return Promise.reject(error);
    },
  );
  return () => axiosInstance.interceptors.response.eject(id);
}, [logout]);

const value = useMemo<AuthContextValue>(
  () => ({ 
    user, 
    login,
    loginAction,
    signUp,
    logout, 
    isAuthReady,
    setUser: setUserProfile 
  }),
  [user, login, loginAction, signUp, logout, isAuthReady, setUserProfile]
);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* ----------------------- custom hook ----------------------- */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider />');
  return ctx;
};
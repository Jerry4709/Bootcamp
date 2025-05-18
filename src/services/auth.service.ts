import axios from './axios';
import type { User } from '@/types/user';

interface BackendLoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      student_id: string | null;
      email: string | null;
      firstname: string;
      lastname: string;
      role: string;
      is_banned: boolean;
      faculty_id: number | null;
      major_id: number | null;
      profile_image: string | null;
      created_at: string;
      total_hours?: number;
      total_points?: number;
    };
    token: string;
  }
}

export type LoginResponse = { accessToken: string; user: User };

export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const { data } = await axios.post<BackendLoginResponse>('/auth/login', {
    email,
    password,
  });

  if (!data.success || !data.data) {
    throw new Error(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
  }

  const backendUser = data.data.user;
  
  // แปลงข้อมูลให้ตรงกับ User interface
  const user: User = {
    id: backendUser.id, // เก็บเป็น number
    student_id: backendUser.student_id ?? '',
    email: backendUser.email ?? '',
    firstname: backendUser.firstname,
    lastname: backendUser.lastname,
    role: backendUser.role as 'STUDENT' | 'STAFF' | 'ADMIN',
    is_banned: backendUser.is_banned,
    faculty_id: backendUser.faculty_id,
    major_id: backendUser.major_id,
    profile_image: backendUser.profile_image,
    created_at: backendUser.created_at,
    total_hours: backendUser.total_hours || 0,
    total_points: backendUser.total_points || 0
  };

  return {
    accessToken: data.data.token,
    user,
  };
};

export const me = async (): Promise<User> => {
  const { data } = await axios.get<{success: boolean; data: BackendLoginResponse['data']['user']}>('/auth/me');
  
  if (!data.success || !data.data) {
    throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
  }
  
  const backendUser = data.data;
  
  return {
    id: backendUser.id, // เก็บเป็น number
    student_id: backendUser.student_id ?? '',
    email: backendUser.email ?? '',
    firstname: backendUser.firstname,
    lastname: backendUser.lastname,
    role: backendUser.role as 'STUDENT' | 'STAFF' | 'ADMIN',
    is_banned: backendUser.is_banned,
    faculty_id: backendUser.faculty_id,
    major_id: backendUser.major_id,
    profile_image: backendUser.profile_image,
    created_at: backendUser.created_at,
    total_hours: backendUser.total_hours || 0,
    total_points: backendUser.total_points || 0
  };
};

export interface RegisterPayload {
  firstname: string
  lastname: string
  student_id: string
  faculty_id: number
  major_id: number
  email: string
  password: string
  role: 'STUDENT' | 'STAFF' | 'ADMIN'
}

export async function register(payload: RegisterPayload): Promise<User> {
  const { data } = await axios.post<{ success: boolean; data: User }>(
    '/auth/register',
    payload,
  )
  return data.data
}

export const refresh = async (): Promise<{accessToken: string}> => {
  const { data } = await axios.post<{success: boolean; data: {token: string}}>('/auth/refresh');
  
  if (!data.success || !data.data) {
    throw new Error('ไม่สามารถรีเฟรชโทเคนได้');
  }
  
  return { accessToken: data.data.token };
};


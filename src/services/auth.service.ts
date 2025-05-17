import axios from './axios';
import type { User } from '@/types/user';

// ปรับให้ตรงกับรูปแบบ response ของ Backend
interface BackendLoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      student_id: string;
      email: string;
      firstname: string;
      lastname: string;
      role: string;
      faculty_id?: number;
      major_id?: number;
      profile_image?: string;
      created_at: string;
      total_hours?: number;
      total_points?: number;
    };
    token: string;
  }
}

interface RegisterPayload {
  student_id: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  faculty_id?: number;
  major_id?: number;
}

// ใช้ interface เดิมสำหรับ return value ที่ Frontend ใช้
export type LoginResponse = { accessToken: string; user: User };

// สำหรับลงทะเบียนผู้ใช้ใหม่
export const register = async (data: RegisterPayload): Promise<LoginResponse> => {
  const { data: responseData } = await axios.post<BackendLoginResponse>('/api/auth/register', data);

  if (!responseData.success || !responseData.data) {
    throw new Error(responseData.message || 'การลงทะเบียนไม่สำเร็จ');
  }

  const backendUser = responseData.data.user;
  
  // สร้าง user ในรูปแบบที่ Frontend ต้องการ
  const user: User = {
    id: String(backendUser.id),
    sid: backendUser.student_id,
    firstname: backendUser.firstname,
    lastname: backendUser.lastname,
    email: backendUser.email,
    role: backendUser.role as User['role'],
    avatarUrl: backendUser.profile_image,
    hours: backendUser.total_hours || 0,
    points: backendUser.total_points || 0,
    createdAt: backendUser.created_at,
    updatedAt: backendUser.created_at,
  };

  return {
    accessToken: responseData.data.token,
    user,
  };
};

export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    const { data } = await axios.post<BackendLoginResponse>('/api/auth/login', {
      email,
      password,
    });

    // ตรวจสอบเพื่อความปลอดภัย
    if (!data.success || !data.data) {
      throw new Error(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
    }

    // แปลงข้อมูลให้ตรงกับรูปแบบที่ Frontend ต้องการ
    const backendUser = data.data.user;
    
    // สร้าง user ในรูปแบบที่ Frontend ต้องการ
    const user: User = {
      id: String(backendUser.id),
      sid: backendUser.student_id,
      firstname: backendUser.firstname,
      lastname: backendUser.lastname,
      email: backendUser.email,
      role: backendUser.role as User['role'],
      avatarUrl: backendUser.profile_image,
      hours: backendUser.total_hours || 0,
      points: backendUser.total_points || 0,
      createdAt: backendUser.created_at,
      updatedAt: backendUser.created_at,
    };

    console.log('Login successful, user role:', user.role);

    return {
      accessToken: data.data.token,
      user,
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const me = async (): Promise<User> => {
  const { data } = await axios.get<{success: boolean; data: any}>('/api/auth/me');
  
  if (!data.success || !data.data) {
    throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
  }
  
  const backendUser = data.data;
  
  return {
    id: String(backendUser.id),
    sid: backendUser.student_id,
    firstname: backendUser.firstname,
    lastname: backendUser.lastname,
    email: backendUser.email,
    role: backendUser.role,
    avatarUrl: backendUser.profile_image,
    hours: backendUser.total_hours || 0,
    points: backendUser.total_points || 0,
    createdAt: backendUser.created_at,
    updatedAt: backendUser.created_at,
  };
};

export const refresh = async (): Promise<{accessToken: string}> => {
  const { data } = await axios.post<{success: boolean; data: {token: string}}>('/api/auth/refresh');
  
  if (!data.success || !data.data) {
    throw new Error('ไม่สามารถรีเฟรชโทเคนได้');
  }
  
  return { accessToken: data.data.token };
};
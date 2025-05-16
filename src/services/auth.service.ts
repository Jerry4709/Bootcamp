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
      full_name: string;
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

// ใช้ interface เดิมสำหรับ return value ที่ Frontend ใช้
export type LoginResponse = { accessToken: string; user: User };



// แก้ไขพารามิเตอร์จาก sid เป็น email
export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  // เปลี่ยนจาก sid เป็น email
  const { data } = await axios.post<BackendLoginResponse>('/auth/login', {
    email,
    password,
  });

  // ตรวจสอบเพื่อความปลอดภัย
  if (!data.success || !data.data) {
    throw new Error(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
  }

  // แปลงข้อมูลให้ตรงกับรูปแบบที่ Frontend ต้องการ
  const backendUser = data.data.user;
  const nameParts = backendUser.full_name.split(' ');
  
  // สร้าง user ในรูปแบบที่ Frontend ต้องการ
const user: User = {
  id: String(backendUser.id), // แปลงจา ก number เป็น string
  sid: backendUser.student_id,
  firstname: nameParts[0],
  lastname: nameParts.slice(1).join(' '), // รวมทุกส่วนที่เหลือเป็นนามสกุล
  email: backendUser.email,
  role: backendUser.role as User['role'], // Type casting เพื่อให้ TypeScript ยอมรับ
  avatarUrl: backendUser.profile_image,
  hours: backendUser.total_hours || 0,
  points: backendUser.total_points || 0,
  createdAt: backendUser.created_at,
  updatedAt: backendUser.created_at, // Backend ไม่มี updated_at จึงใช้ created_at แทน
};

  return {
    accessToken: data.data.token,
    user,
  };
};

// คงฟังก์ชันอื่นๆ ไว้ หรือแก้ไขเช่นเดียวกัน
export const me = async (): Promise<User> => {
  const { data } = await axios.get<{success: boolean; data: any}>('/auth/me');
  
  if (!data.success || !data.data) {
    throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
  }
  
  const backendUser = data.data;
  const nameParts = backendUser.full_name.split(' ');
  
  return {
    id: String(backendUser.id),
    sid: backendUser.student_id,
    firstname: nameParts[0],
    lastname: nameParts.slice(1).join(' '),
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
  const { data } = await axios.post<{success: boolean; data: {token: string}}>('/auth/refresh');
  
  if (!data.success || !data.data) {
    throw new Error('ไม่สามารถรีเฟรชโทเคนได้');
  }
  
  return { accessToken: data.data.token };
};
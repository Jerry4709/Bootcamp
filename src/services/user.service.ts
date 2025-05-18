import axios from './axios'
import type { User } from '@/types/user'

type ApiResponse<T> = {
  data: T;
  message?: string;
  [key: string]: any;
};

export const userService = {
  // ───────── Admin ─────────

  /** ดึงรายชื่อผู้ใช้ทั้งหมด */
  async getAll(): Promise<User[]> {
    const res = await axios.get('/users')
    return res.data
  },

  /** แบน/ปลดแบนผู้ใช้ */
  async updateBanStatus(id: string, isBanned: boolean): Promise<User> {
    const response = await axios.patch(`/users/${id}/ban`, { isBanned });
    return response.data;
  },

  // ───────── Staff / Student ─────────

  /** ดึงโปรไฟล์ตัวเอง */
  async getProfile(): Promise<User> {
    const token = localStorage.getItem('accessToken')
    if (!token) throw new Error('ไม่พบ Token กรุณาเข้าสู่ระบบใหม่')

    const { data } = await axios.get<ApiResponse<User>>('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data.data
  },

  /** อัปเดตโปรไฟล์ตนเอง */
  async updateProfile(payload: Partial<User>): Promise<User> {
    const token = localStorage.getItem('accessToken')
    if (!token) throw new Error('ไม่พบ Token กรุณาเข้าสู่ระบบใหม่')

    const { data } = await axios.put<ApiResponse<User>>('/auth/me', payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data.data
  },
}

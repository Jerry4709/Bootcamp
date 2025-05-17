import axios from './axios'
import type { User } from '@/types/user'

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
    const res = await axios.get('/users/profile')
    return res.data
  },

  /** อัปเดตโปรไฟล์ตัวเอง */
  async updateProfile(data: Partial<User>): Promise<User> {
    const res = await axios.put('/users/profile', data)
    return res.data
  },
}
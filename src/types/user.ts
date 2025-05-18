export type Role = 'STUDENT' | 'STAFF' | 'ADMIN';

export interface User {
  id: number;
  student_id: string;  // เปลี่ยนจาก string | null
  email: string;       // เปลี่ยนจาก string | null
  firstname: string;
  lastname: string;
  role: 'STUDENT' | 'STAFF' | 'ADMIN';
  is_banned: boolean;
  faculty_id: number | null;
  major_id: number | null;
  faculty_name?: string;  // จาก join
  major_name?: string;    // จาก join
  profile_image: string | null;
  total_hours?: number;   // จาก activity_participation
  total_points?: number;  // จาก activity_participation
  created_at: string;
}

// เพิ่ม interface สำหรับ user ban
export interface UserBan {
  id: number;
  user_id: number;
  reason: string;
  banned_by: number | null;
  banned_at: string;
  expires_at: string | null;
  is_active: boolean;
}

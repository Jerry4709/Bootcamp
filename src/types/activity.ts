// src/types/activity.ts
export type ActivityCategory = 'อาสาสมัคร' | 'กิจกรรมช่วยงาน' | 'ฝึกอบรม';
export type ActivityStatus = 'รออนุมัติ' | 'อนุมัติ' | 'ปฏิเสธ' | 'เสร็จสิ้น' | 'ยกเลิก';
export type ApplicationStatus = 'รอดำเนินการ' | 'อนุมัติ' | 'ปฏิเสธ' | 'เข้าร่วม';

export interface Activity {
  id: number;
  title: string;
  description: string | null;
  category: ActivityCategory;
  start_time: string;
  end_time: string;
  max_participants: number;
  current_participants?: number;
  status: ActivityStatus;
  is_registered?: boolean;
  application_status?: ApplicationStatus | null;
  cover_image: string | null;
  created_by?: number;
  creator_name?: string;
  category_id?: number | null;
  category_name?: string;
  created_at: string;
  // Additional properties for frontend use
  startDate?: string; // Alias for start_time
  endDate?: string;   // Alias for end_time
  maxParticipants?: number; // Alias for max_participants
  isActive?: boolean; // Computed property
}

export interface ActivityDetail extends Activity {
  isRegistered?: boolean;
  currentParticipants?: number; // Alias for current_participants
  faculty_name?: string;
  major_name?: string;
  applicationStatus?: ApplicationStatus | null;
}

export interface ActivityParticipation {
  id: number;
  activity_id: number;
  user_id: number;
  hours: number;
  points: number;
  verified_by: number | null;
  verified_at: string | null;
}

export interface ActivityApplication {
  id: number;
  activity_id: number;
  user_id: number;
  status: ApplicationStatus;
  applied_at: string;
  approved_by: number | null;
}

export interface ActivitySummary {
  total_activities: number;   // จำนวนกิจกรรมทั้งหมด
  total_hours: number;        // จำนวนชั่วโมงสะสม
  total_points: number;       // คะแนนสะสม
}

export interface ActivityFilterParams {
  page?: number;
  limit?: number;
  category?: ActivityCategory | '' | undefined;
  status?: ActivityStatus | '' | undefined;
  search?: string | undefined;
  start_date?: string;
  end_date?: string;
  faculty_id?: number;
  major_id?: number;
}

export interface Applicant {
  id: number;           // application id
  user_id: number;     // user id
  activity_id: number;
  status: ApplicationStatus;
  applied_at: string;
  // User information
  sid?: string;        // student_id from user
  student_id?: string; // alias for sid
  firstname: string;
  lastname: string;
  email?: string;
  faculty_name?: string;
  major_name?: string;
  // Participation data
  hours?: number;
  points?: number;
  verified_at?: string | null;
}

export interface ActivityPayload {
  title: string;
  description: string;
  category: ActivityCategory;
  start_time: string;
  end_time: string;
  max_participants: number;
  cover_image?: string | null;
  category_id?: number | null;
}

// For backward compatibility
export type ActivityType = ActivityCategory;
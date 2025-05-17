export type ActivityType = 'VOLUNTEER' | 'WORK' | 'TRAINING';
export type ActivityStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'CANCELLED';

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  startDate: string;  // ISO date string, e.g. "2025-06-01T08:00:00Z"
  endDate: string;    // ISO date string, e.g. "2025-06-02T16:00:00Z"
  status: ActivityStatus;
  isRegistered?: boolean; // สถานะการลงทะเบียนของผู้ใช้ปัจจุบัน
  createdAt: string;
  updatedAt: string;
}

export type ApplicantStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Applicant {
  id: string;
  sid: string;           // รหัสนิสิต
  firstname: string;
  lastname: string;
  status: ApplicantStatus;
  appliedAt: string;    // วันเวลาที่สมัคร
  user_id: string;      // ID ของผู้ใช้
}

/**
 * Payload สำหรับการสร้างหรือแก้ไขกิจกรรม
 */
export interface ActivityPayload {
  title: string;
  description: string;
  type: ActivityType;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  location?: string;
  hours?: number;      // จำนวนชั่วโมงกิจกรรม
  points?: number;     // คะแนนที่จะได้รับ
}

/**
 * ข้อมูลรายละเอียดกิจกรรม
 */
export interface ActivityDetail extends Activity {
  description: string;
  isRegistered: boolean;
  maxParticipants: number;
  currentParticipants: number;
  isActive: boolean;
  location?: string;
  hours?: number;      // จำนวนชั่วโมงกิจกรรม
  points?: number;     // คะแนนที่จะได้รับ
  createdBy: string;   // ID ของผู้สร้างกิจกรรม
}

/**
 * ข้อมูลสรุปกิจกรรมของผู้ใช้
 */
export interface ActivitySummary {
  registered: number;    // จำนวนกิจกรรมที่สมัครแล้ว
  hours: number;         // ชั่วโมงกิจกรรมสะสม
  points: number;        // คะแนนสะสม
  totalActivities: number; // จำนวนกิจกรรมทั้งหมด
}

/**
 * พารามิเตอร์สำหรับการกรองกิจกรรม
 */
export interface ActivityFilterParams {
  page: number;
  limit: number;
  type?: ActivityType | '';
  status?: ActivityStatus | '';
  search?: string;
  startDate?: string;
  endDate?: string;
}
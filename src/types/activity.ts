export type ActivityType = 'VOLUNTEER' | 'WORK' | 'TRAINING';
export type ActivityStatus = 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'CLOSED' | 'CANCELLED';

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  startDate: string;  // ISO date string, e.g. "2025-06-01"
  endDate: string;    // ISO date string, e.g. "2025-06-02"
  status: ActivityStatus;
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
}

export interface ActivityPayload {
  title: string;
  description: string;
  type: ActivityType;
  startDate: string;
  endDate: string;
  maxParticipants: number;
}

export interface ActivityDetail extends Activity {
  description: string;
  isRegistered: boolean;
  maxParticipants: number;
  currentParticipants: number;
  isActive: boolean;
  location: string;
  hours: number;      // จำนวนชั่วโมงกิจกรรม
  points: number;     // คะแนนที่จะได้รับ
  createdBy: string;  // ID ของผู้สร้างกิจกรรม
}

export interface ActivitySummary {
  registered: number;    // จำนวนกิจกรรมที่สมัครแล้ว
  hours: number;         // ชั่วโมงกิจกรรมสะสม
  points: number;        // คะแนนสะสม
  totalActivities: number; // จำนวนกิจกรรมทั้งหมด
}

export interface ActivityFilterParams {
  page: number;
  limit: number;
  type?: ActivityType | '';
  status?: ActivityStatus | '';
  search?: string;
  startDate?: string;
  endDate?: string;
}



import axios from './axios'
import type {
  Activity,
  ActivityDetail,
  ActivityFilterParams,
  ActivitySummary,
  Applicant,
  ActivityPayload,
} from '@/types/activity'
import type { PaginatedData } from '@/types/pagination'

// Helper function สำหรับ response handling
const getResponseData = (response: any) => {
  // ลอง extract ข้อมูลจาก response ในรูปแบบต่างๆ
  if (response.data?.success && response.data?.data) {
    return response.data.data
  }
  if (response.data?.data) {
    return response.data.data
  }
  if (response.data) {
    return response.data
  }
  return response
}

// Helper function สำหรับ paginated response
const getPaginatedResponseData = (response: any): PaginatedData<Activity> => {
  console.log('Raw response:', response.data) // Debug log
  
  // ลองหลายรูปแบบการ response จาก backend
  if (response.data?.success && response.data?.data && response.data?.total) {
    return {
      items: response.data.data,
      total: response.data.total
    }
  }
  
  if (response.data?.data && response.data?.total) {
    return {
      items: response.data.data,
      total: response.data.total
    }
  }
  
  if (Array.isArray(response.data?.data)) {
    return {
      items: response.data.data,
      total: response.data.data.length
    }
  }
  
  if (Array.isArray(response.data)) {
    return {
      items: response.data,
      total: response.data.length
    }
  }
  
  // ถ้าไม่เจอรูปแบบไหนเลย ให้คืนค่า default
  console.warn('Unexpected response format:', response.data)
  return {
    items: [],
    total: 0
  }
}

export const activityService = {
  // ───────── Public / Student ─────────

  /** ดึงกิจกรรมที่สมัครแล้ว (approved) */
  async getApproved(params: ActivityFilterParams): Promise<{ items: Activity[]; total: number }> {
    try {
      const res = await axios.get('/activities', { 
        params: {
          ...params,
          status: 'อนุมัติ'
        } 
      });
      return getPaginatedResponseData(res);
    } catch (error) {
      console.error('Error fetching approved activities:', error)
      throw error
    }
  },

  /** ดึงกิจกรรมทั้งหมด (พร้อม pagination) */
    async getAll(params: ActivityFilterParams): Promise<PaginatedData<Activity>> {
    try {
      console.log('API Request params:', params) // Debug log
      const res = await axios.get('/activities', { params })
      console.log('API Response:', res.data) // Debug log
      return getPaginatedResponseData(res)
    } catch (error) {
      console.error('Error fetching all activities:', error)
      throw error
    }
  },
  /** ดึงกิจกรรมทั้งหมดสำหรับ Admin (ไม่กรองสถานะ) */
  async getAllForAdmin(params: ActivityFilterParams): Promise<PaginatedData<Activity>> {
    try {
      console.log('Admin API Request params:', params) // Debug log
      const res = await axios.get('/activities/admin/all', { params })
      console.log('Admin API Response:', res.data) // Debug log
      return getPaginatedResponseData(res)
    } catch (error) {
      console.error('Error fetching all activities for admin:', error)
      throw error
    }
  },



  /** ดึงรายละเอียดกิจกรรม */
  async getById(id: string): Promise<ActivityDetail> {
    try {
      const res = await axios.get(`/activities/${id}`)
      return getResponseData(res)
    } catch (error) {
      console.error('Error fetching activity by id:', error)
      throw error
    }
  },

  /** toggle สมัคร/ยกเลิกสมัคร */
  async toggleRegistration(id: number): Promise<{ success: boolean }> {
    try {
      const res = await axios.post(`/activities/${id}/toggle`);
      return {
        success: res.data.success
      };
    } catch (error) {
      console.error('Error toggling registration:', error)
      throw error
    }
  },

  /** ดึงกิจกรรมของตัวเอง (My Activities) */
  async getMyActivities(): Promise<Activity[]> {
    try {
      const res = await axios.get('/activities/my')
      const data = getResponseData(res)
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Error fetching my activities:', error)
      throw error
    }
  },

  /** สรุปภาพรวม Student */
  async getMySummary(): Promise<ActivitySummary> {
    try {
      const res = await axios.get<{
        success: boolean;
        data: {
          total_hours: string;
          total_points: string;
        }
      }>('/auth/me');

      if (!res.data.success) {
        throw new Error('ไม่สามารถดึงข้อมูลสรุปได้');
      }

      return {
        total_activities: 0, // ถ้าต้องการข้อมูลนี้ต้องเพิ่ม API endpoint ใหม่
        total_hours: Number(res.data.data.total_hours) || 0,
        total_points: Number(res.data.data.total_points) || 0
      };
    } catch (error) {
      console.error('Error fetching my summary:', error)
      throw error
    }
  },

  // ───────── Staff ─────────

  /** สรุปภาพรวม Staff */
  async getStaffSummary(): Promise<{
    totalActivities: number
    pendingApprovals: number
    upcomingActivities: number
  }> {
    try {
      const res = await axios.get('/activities/staff/summary')
      return getResponseData(res)
    } catch (error) {
      console.error('Error fetching staff summary:', error)
      throw error
    }
  },

  /** สร้างกิจกรรม */
  async create(data: ActivityPayload): Promise<ActivityDetail> {
    try {
      const res = await axios.post('/activities', data)
      return getResponseData(res)
    } catch (error) {
      console.error('Error creating activity:', error)
      throw error
    }
  },

  /** แก้ไขกิจกรรม */
  async update(id: string, data: ActivityPayload): Promise<ActivityDetail> {
    try {
      const res = await axios.put(`/activities/${id}`, data)
      return getResponseData(res)
    } catch (error) {
      console.error('Error updating activity:', error)
      throw error
    }
  },

  /** ดึงผู้สมัครกิจกรรม */
  async getApplicants(activityId: string): Promise<Applicant[]> {
    try {
      const res = await axios.get(`/activities/${activityId}/applicants`)
      const data = getResponseData(res)
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Error fetching applicants:', error)
      throw error
    }
  },

  /** อนุมัติผู้สมัคร */
  async approveApplicant(activityId: number, applicantId: number): Promise<{ success: boolean }> {
    try {
      const res = await axios.post(
        `/activities/${activityId}/applicants/${applicantId}/approve`
      )
      return res.data
    } catch (error) {
      console.error('Error approving applicant:', error)
      throw error
    }
  },

  /** ปฏิเสธผู้สมัคร */
  async rejectApplicant(activityId: number, applicantId: number): Promise<{ success: boolean }> {
    try {
      const res = await axios.post(
        `/activities/${activityId}/applicants/${applicantId}/reject`
      )
      return res.data
    } catch (error) {
      console.error('Error rejecting applicant:', error)
      throw error
    }
  },

  // ───────── Admin ─────────

  /** สรุปภาพรวม Admin */
  async getAdminSummary(): Promise<{
    totalUsers: number
    totalActivities: number
    pendingActivities: number
  }> {
    try {
      const res = await axios.get('/admin/summary')
      return getResponseData(res)
    } catch (error) {
      console.error('Error fetching admin summary:', error)
      throw error
    }
  },

  /** ดึงกิจกรรมที่รออนุมัติ (Admin) */
   async getPendingActivities(): Promise<Activity[]> {
    try {
      const res = await axios.get('/activities/pending')
      const data = getResponseData(res)
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Error fetching pending activities:', error)
      throw error
    }
  },
  /** อนุมัติกิจกรรม (Admin) */
  async approveActivity(id: number): Promise<void> {
    try {
      await axios.post(`/activities/${id}/approve`, { approved: true })
    } catch (error) {
      console.error('Error approving activity:', error)
      throw error
    }
  },

  /** ปฏิเสธกิจกรรม (Admin) */
  async rejectActivity(id: number): Promise<void> {
    try {
      await axios.post(`/activities/${id}/approve`, { approved: false })
    } catch (error) {
      console.error('Error rejecting activity:', error)
      throw error
    }
  },
}
import axios from './axios';
import type {
  Activity,
  ActivityDetail,
  ActivityFilterParams,
  ActivitySummary,
  Applicant,
  ActivityPayload,
} from '@/types/activity';
import type { PaginatedData } from '@/types/pagination';

export const activityService = {
  /**
   * ดึงข้อมูลกิจกรรมที่ได้รับการอนุมัติแล้ว
   * @param params พารามิเตอร์สำหรับการกรองและการแบ่งหน้า
   */
  async getApproved(params: ActivityFilterParams): Promise<PaginatedData<Activity>> {
    try {
      const { page = 1, limit = 10, type = '', search = '' } = params;
      const url = '/api/activities/approved';
      
      // สร้าง query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      
      if (type) {
        queryParams.append('type', type);
      }
      
      if (search) {
        queryParams.append('search', search);
      }
      
      const response = await axios.get(`${url}?${queryParams.toString()}`);
      
      if (response.data && response.data.success) {
        return {
          items: response.data.data || [],
          total: response.data.total || 0
        };
      }
      
      throw new Error('ไม่สามารถดึงข้อมูลกิจกรรมได้');
    } catch (error) {
      console.error('Error in getApproved:', error);
      // ส่งคืนข้อมูลว่าง (เพื่อป้องกันแอปพลิเคชันล่ม)
      return { items: [], total: 0 };
    }
  },

  /**
   * ดึงข้อมูลกิจกรรมตาม ID
   * @param id รหัสกิจกรรม
   */
  async getById(id: string): Promise<ActivityDetail> {
    try {
      const response = await axios.get(`/api/activities/${id}`);
      
      if (response.data && response.data.success) {
        return response.data.data;
      }
      
      throw new Error('ไม่พบข้อมูลกิจกรรม');
    } catch (error) {
      console.error('Error in getById:', error);
      throw error;
    }
  },

  /**
   * สลับสถานะการลงทะเบียนของผู้ใช้ในกิจกรรม (สมัคร/ยกเลิกการสมัคร)
   * @param id รหัสกิจกรรม
   */
  async toggleRegistration(id: string): Promise<{ success: boolean }> {
    try {
      const response = await axios.post(`/api/activities/${id}/toggle`);
      
      if (response.data && response.data.success) {
        return { success: true };
      }
      
      throw new Error(response.data?.message || 'ไม่สามารถดำเนินการได้');
    } catch (error) {
      console.error('Error in toggleRegistration:', error);
      throw error;
    }
  },

  /**
   * ดึงข้อมูลกิจกรรมที่ผู้ใช้สมัครเข้าร่วม
   */
  async getMyActivities(): Promise<Activity[]> {
    try {
      const response = await axios.get('/api/activities/my');
      
      if (response.data && response.data.success) {
        return response.data.data || [];
      }
      
      throw new Error('ไม่สามารถดึงข้อมูลกิจกรรมของคุณได้');
    } catch (error) {
      console.error('Error in getMyActivities:', error);
      throw error;
    }
  },

  /**
   * ดึงข้อมูลกิจกรรมทั้งหมด (สำหรับเจ้าหน้าที่)
   * @param params พารามิเตอร์สำหรับการกรองและการแบ่งหน้า
   */
  async getAll(params: ActivityFilterParams): Promise<PaginatedData<Activity>> {
    try {
      const { page = 1, limit = 10, type = '', status = '', search = '' } = params;
      const url = '/api/activities';
      
      // สร้าง query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      
      if (type) {
        queryParams.append('type', type);
      }
      
      if (status) {
        queryParams.append('status', status);
      }
      
      if (search) {
        queryParams.append('search', search);
      }
      
      const response = await axios.get(`${url}?${queryParams.toString()}`);
      
      if (response.data && response.data.success) {
        return {
          items: response.data.data || [],
          total: response.data.total || 0
        };
      }
      
      throw new Error('ไม่สามารถดึงข้อมูลกิจกรรมได้');
    } catch (error) {
      console.error('Error in getAll:', error);
      throw error;
    }
  },

  /**
   * ดึงข้อมูลสรุปกิจกรรมของผู้ใช้
   */
  async getMySummary(): Promise<ActivitySummary> {
    try {
      const response = await axios.get('/api/activities/summary');
      
      if (response.data && response.data.success) {
        return response.data.data || {
          registered: 0,
          hours: 0,
          points: 0,
          totalActivities: 0
        };
      }
      
      throw new Error('ไม่สามารถดึงข้อมูลสรุปได้');
    } catch (error) {
      console.error('Error in getMySummary:', error);
      // ส่งคืนข้อมูลเริ่มต้น (เพื่อป้องกันแอปพลิเคชันล่ม)
      return {
        registered: 0,
        hours: 0,
        points: 0,
        totalActivities: 0
      };
    }
  },

  /**
   * ดึงข้อมูลสรุปกิจกรรมสำหรับเจ้าหน้าที่
   */
  async getStaffSummary(): Promise<{
    totalActivities: number;
    pendingApprovals: number;
    upcomingActivities: number;
  }> {
    try {
      const response = await axios.get('/api/activities/staff/summary');
      
      if (response.data && response.data.success) {
        return response.data.data || {
          totalActivities: 0,
          pendingApprovals: 0,
          upcomingActivities: 0
        };
      }
      
      throw new Error('ไม่สามารถดึงข้อมูลสรุปได้');
    } catch (error) {
      console.error('Error in getStaffSummary:', error);
      // ส่งคืนข้อมูลเริ่มต้น (เพื่อป้องกันแอปพลิเคชันล่ม)
      return {
        totalActivities: 0,
        pendingApprovals: 0,
        upcomingActivities: 0
      };
    }
  },

  /**
   * สร้างกิจกรรมใหม่
   * @param data ข้อมูลกิจกรรมที่ต้องการสร้าง
   */
  async create(data: ActivityPayload): Promise<ActivityDetail> {
    try {
      const response = await axios.post('/api/activities', data);
      
      if (response.data && response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data?.message || 'ไม่สามารถสร้างกิจกรรมได้');
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  },

  /**
   * อัปเดตข้อมูลกิจกรรม
   * @param id รหัสกิจกรรม
   * @param data ข้อมูลกิจกรรมที่ต้องการอัปเดต
   */
  async update(id: string, data: ActivityPayload): Promise<ActivityDetail> {
    try {
      const response = await axios.put(`/api/activities/${id}`, data);
      
      if (response.data && response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data?.message || 'ไม่สามารถอัปเดตกิจกรรมได้');
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  },

  /**
   * ดึงข้อมูลผู้สมัครในกิจกรรม
   * @param activityId รหัสกิจกรรม
   */
  async getApplicants(activityId: string): Promise<Applicant[]> {
    try {
      const response = await axios.get(`/api/activities/${activityId}/applicants`);
      
      if (response.data && response.data.success) {
        return response.data.data || [];
      }
      
      throw new Error('ไม่สามารถดึงข้อมูลผู้สมัครได้');
    } catch (error) {
      console.error('Error in getApplicants:', error);
      throw error;
    }
  },

  /**
   * อนุมัติผู้สมัคร
   * @param activityId รหัสกิจกรรม
   * @param applicantId รหัสผู้สมัคร
   */
  async approveApplicant(activityId: string, applicantId: string): Promise<{ success: boolean }> {
    try {
      const response = await axios.post(
        `/api/activities/${activityId}/applicants/${applicantId}/approve`
      );
      
      if (response.data && response.data.success) {
        return { success: true };
      }
      
      throw new Error(response.data?.message || 'ไม่สามารถอนุมัติผู้สมัครได้');
    } catch (error) {
      console.error('Error in approveApplicant:', error);
      throw error;
    }
  },

  /**
   * ปฏิเสธผู้สมัคร
   * @param activityId รหัสกิจกรรม
   * @param applicantId รหัสผู้สมัคร
   */
  async rejectApplicant(activityId: string, applicantId: string): Promise<{ success: boolean }> {
    try {
      const response = await axios.post(
        `/api/activities/${activityId}/applicants/${applicantId}/reject`
      );
      
      if (response.data && response.data.success) {
        return { success: true };
      }
      
      throw new Error(response.data?.message || 'ไม่สามารถปฏิเสธผู้สมัครได้');
    } catch (error) {
      console.error('Error in rejectApplicant:', error);
      throw error;
    }
  }
};
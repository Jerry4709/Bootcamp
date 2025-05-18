// src/services/faculty.service.ts
import axios from './axios';

export interface Faculty {
  id: number;
  name: string;
}

export interface Major {
  id: number;
  faculty_id: number;
  name: string;
}

export const facultyService = {
  // ดึงข้อมูลคณะทั้งหมด
  async getAllFaculties(): Promise<Faculty[]> {
    const { data } = await axios.get<{ success: boolean; data: Faculty[] }>('/faculties');
    
    if (!data.success) {
      throw new Error('ไม่สามารถดึงข้อมูลคณะได้');
    }
    
    return data.data;
  },
  
  // ดึงข้อมูลสาขาทั้งหมด
  async getAllMajors(): Promise<Major[]> {
    const { data } = await axios.get<{ success: boolean; data: Major[] }>('/majors');
    
    if (!data.success) {
      throw new Error('ไม่สามารถดึงข้อมูลสาขาได้');
    }
    
    return data.data;
  },
  
  // ดึงข้อมูลสาขาตามคณะ
  async getMajorsByFacultyId(facultyId: number): Promise<Major[]> {
    const { data } = await axios.get<{ success: boolean; data: Major[] }>(`/faculties/${facultyId}/majors`);
    
    if (!data.success) {
      throw new Error('ไม่สามารถดึงข้อมูลสาขาได้');
    }
    
    return data.data;
  }
};
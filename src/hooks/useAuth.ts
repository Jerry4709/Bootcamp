import { useAuth as useAuthContext } from '@/context/AuthProvider';
import * as authService from '@/services/auth.service';

// เพิ่มฟังก์ชันใหม่เพื่อทำให้การ login ง่ายขึ้นสำหรับ component
export function useAuth() {
  const auth = useAuthContext();
  
  // เพิ่มฟังก์ชัน loginWithCredentials ที่จะจัดการกับ authService
  async function loginWithCredentials(email: string, password: string) {
    // เรียกใช้ loginAction ที่มี logging แล้ว
    const result = await auth.loginAction(email, password);
    return result;
  }
  
  async function signUp(payload: authService.RegisterPayload) {
    const result = await auth.signUp(payload);
    return result;
  }

  return {
    ...auth,
    loginWithCredentials,
    signUp,
  };
}
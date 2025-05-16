import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true, // ยังคงต้องใช้ true สำหรับ cookies/authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

// เพิ่ม interceptors สำหรับการทำงานกับ API
axiosInstance.interceptors.request.use(
  config => {
    // เพิ่ม token จาก localStorage (ถ้ามี)
    const token = localStorage.getItem('volunteerhub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// แสดง error ให้ชัดเจนขึ้น
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // สามารถจัดการ error ต่างๆ ได้ที่นี่ (เช่น unauthorized, server errors)
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
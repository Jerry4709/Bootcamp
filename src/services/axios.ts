import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // ไม่ต้องใช้ import.meta.env.VITE_API_URL
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
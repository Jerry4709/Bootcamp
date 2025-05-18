import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { ReactNode } from 'react';

export interface ProtectedRouteProps {
  allow: Array<'STUDENT'|'STAFF'|'ADMIN'>;
  children?: ReactNode;
}

const ProtectedRoute = ({ allow, children }: ProtectedRouteProps) => {
  const { user, isAuthReady } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem('volunteerhub_token');

  if (!isAuthReady) return null;

  // ถ้ามี token และ user แล้วพยายามเข้าหน้า login
  if (token && user && location.pathname === '/login') {
    if (user.role === 'STUDENT') return <Navigate to="/student" replace />;
    if (user.role === 'STAFF') return <Navigate to="/staff" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  }

  // ถ้าไม่มี user หรือ token
  if (!user || !token) {
    // แต่ถ้าเป็นหน้า login ให้แสดงหน้า login ได้
    if (location.pathname === '/login') {
      return children ? <>{children}</> : <Outlet/>;
    }
    // ถ้าไม่ใช่หน้า login ให้ redirect ไปหน้า login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ตรวจสอบสิทธิ์การเข้าถึง
  if (!allow.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet/>;
};

export default ProtectedRoute;

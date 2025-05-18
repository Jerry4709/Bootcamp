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
  const token = localStorage.getItem('accessToken');

  // แสดง loading ถ้า auth ยังไม่พร้อม
  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 to-blue-100 dark:from-neutral-900 dark:to-neutral-800">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
          <span className="text-neutral-600 dark:text-neutral-400">กำลังโหลด...</span>
        </div>
      </div>
    );
  }

  // ถ้ามี user และเข้าหน้า login ให้ redirect ไปหน้าแรกของ role นั้น
  if (user && token && location.pathname === '/login') {
    let redirectPath = '/unauthorized';
    
    switch (user.role) {
      case 'STUDENT':
        redirectPath = '/student';
        break;
      case 'STAFF':
        redirectPath = '/staff';
        break;
      case 'ADMIN':
        redirectPath = '/admin';
        break;
    }
    
    return <Navigate to={redirectPath} replace />;
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
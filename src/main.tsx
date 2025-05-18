import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import { AuthProvider } from '@/context/AuthProvider'
import { ThemeProvider } from '@/contexts/ThemeContext' // เพิ่ม import
import ProtectedRoute from '@/components/protected/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import MyActivities from './pages/student/MyActivities'
import Profile from './pages/student/Profile'
import StaffLayout from './layouts/StaffLayout'
import StaffActivityList from './pages/staff/Activities/ActivityList'
import CreateActivity from '@/pages/staff/CreateActivity'
import EditActivity from './pages/staff/EditActivity'
import ActivityDetailPage from '@/pages/student/Activities/ActivityDetail'
import Applicants from './pages/staff/Applicants'
import AdminLayout from './layouts/AdminLayout'
import AdminActivityDetail from './pages/admin/Activities/ActivityDetail'
import ApprovalCenter from './pages/admin/ApprovalCenter'
import UserManagement from './pages/admin/UserManagement'

// ─── Lazy-loaded Pages ───────────────────────────────
const Login         = lazy(() => import('@/pages/auth/Login'))
const Register      = lazy(() => import('@/pages/auth/Register'))
const StudentDash   = lazy(() => import('@/pages/student/Dashboard'))
const StudentActs   = lazy(() => import('@/pages/student/Activities/ActivityList'))
const StudentDetail = lazy(() => import('@/pages/student/Activities/ActivityDetail'))
const StaffDashboard     = lazy(() => import('@/pages/staff/Dashboard'))
const CreateAct     = lazy(() => import('@/pages/staff/CreateActivity'))
const AdminDash     = lazy(() => import('@/pages/admin/Dashboard'))
const Unauthorized  = lazy(() => import('@/pages/misc/Unauthorized'))
const NotFound      = lazy(() => import('@/pages/misc/NotFound'))
const ErrorFallback = lazy(() => import('@/pages/misc/error'))


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
  },
})

// ─── Routes (Flat) ───────────────────────────────────
const router = createBrowserRouter([
  { 
    path: '/', 
    element: <ProtectedRoute allow={['STUDENT', 'STAFF', 'ADMIN']}>
      <Navigate to="/login" replace />
    </ProtectedRoute>
  },

  // Public Routes - ไม่ต้องใส่ ProtectedRoute
  { path: '/login', element: <Login />, errorElement: <ErrorFallback /> },
  { path: '/register', element: <Register />, errorElement: <ErrorFallback /> },

  // Protected - Student
  {
    path: '/student',
    element: (
      <ProtectedRoute allow={['STUDENT']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorFallback />,
    children: [
      { index: true, element: <StudentDash /> },
      { path: 'activities', element: <StudentActs /> },
      { path: 'activities/:id', element: <StudentDetail /> },
      { path: 'my-activities', element: <MyActivities /> },
      { path: 'profile', element: <Profile /> },
    ],
  },

  // Protected - Staff
  {
    path: '/staff',
    element: (
      <ProtectedRoute allow={['STAFF']}>
        <StaffLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <StudentDash /> },
      { path: 'student/activities', element: <StudentActs /> },
      { path: 'student/activities/:id', element: <StudentDetail /> },
      { path: 'student/my-activities', element: <MyActivities /> },
      { path: 'student/profile', element: <Profile /> },
      { path: 'staff', element: <StaffDashboard /> },
      { path: 'activities', element: <StaffActivityList /> },
      { path: 'activities/create', element: <CreateActivity /> },
      { path: 'activities/:id/edit', element: <EditActivity /> },
      { path: 'activities/:id', element: <ActivityDetailPage /> },
      { path: 'activities/:id/applicants', element: <Applicants /> },
    ],
  },

  // Protected - Admin
  {
    path: '/admin',
    element: (
      <ProtectedRoute allow={['ADMIN']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDash /> },
      { path: 'activities', element: <AdminActivityDetail /> },
      { path: 'approval', element: <ApprovalCenter /> },
      { path: 'users', element: <UserManagement /> },
      { path: 'staff-activities', element: <StaffActivityList /> },
      { path: 'staff-activities/create', element: <CreateActivity /> },
      { path: 'staff-activities/:id/edit', element: <EditActivity /> },
      { path: 'staff-activities/:id', element: <ActivityDetailPage /> },
      { path: 'staff-activities/:id/applicants', element: <Applicants /> },
    ]
  },

  // Misc Routes
  { 
    path: '/unauthorized', 
    element: (
      <ProtectedRoute allow={['STUDENT', 'STAFF', 'ADMIN']}>
        <Unauthorized />
      </ProtectedRoute>
    ) 
  },
  { path: '*', element: <NotFound /> },
])

// ─── Render App ──────────────────────────────────────
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider> {/* เพิ่ม ThemeProvider ครอบนอกสุด */}
      <QueryClientProvider client={queryClient}>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        <AuthProvider>
          <Suspense fallback={<div className="p-8 text-center">Loading…</div>}>
            <RouterProvider router={router} />
          </Suspense>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
)

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',

  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '*',

  STUDENT_DASHBOARD: '/student',
  STUDENT_ACTIVITIES: '/activities',
  STUDENT_ACTIVITY_DETAIL: (id: string) => `/activities/${id}`,
  STUDENT_MY_ACTIVITIES: '/my-activities',
  STUDENT_PROFILE: '/profile',

  STAFF_DASHBOARD: '/staff',
  STAFF_ACTIVITIES: '/staff/activities',
  STAFF_ACTIVITY_DETAIL: (id: string) => `/staff/activities/${id}`,
  STAFF_CREATE_ACTIVITY: '/staff/activities/create',
  STAFF_EDIT_ACTIVITY: (id: string) => `/staff/activities/${id}/edit`,
  STAFF_APPLICANTS: (id: string) => `/staff/activities/${id}/applicants`,

  ADMIN_DASHBOARD: '/admin',
  ADMIN_ACTIVITIES: '/admin/activities',
  ADMIN_ACTIVITY_DETAIL: (id: string) => `/admin/activities/${id}`,
  ADMIN_APPROVAL_CENTER: '/admin/approval-center',
  ADMIN_USER_MANAGEMENT: '/admin/users',

  ERROR_404: '*',
  ERROR_500: '/500',
} as const;

import  { useAuth } from './useAuth';
import type { RoleValue } from '@/constants/roles';

export const useRoleGuard = (roles: RoleValue | RoleValue[]) => {
  const { user } = useAuth();

  const allowed = Array.isArray(roles)
    ? roles.includes(user?.role as RoleValue)
    : user?.role === roles;

  return { allowed };
};

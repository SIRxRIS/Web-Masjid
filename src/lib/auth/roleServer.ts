// lib/auth/roleServer.ts
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Role, Resource, Permission, permissionMatrix } from './roleTypes';
import { getUserRoleServer } from './userRoleService';
import { canManageResource, canAccessPageServer } from './resourceManager';
import { createLogger } from '@/lib/logger';

const logger = createLogger('roleServer');

// Dapatkan profile user dari database (server-side)
export async function getUserProfileServer(userId: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('Profile')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error) {
      logger.error("Error fetching user profile", { error, userId });
      return null;
    }

    return data;
  } catch (error) {
    logger.error("Error in getUserProfileServer", { error, userId });
    return null;
  }
}

// Cek apakah user memiliki role yang diperlukan (server-side)
export async function hasRoleServer(userId: string, requiredRoles: Role[]): Promise<boolean> {
  const userRole = await getUserRoleServer(userId);
  return userRole ? requiredRoles.includes(userRole) || userRole === 'ADMIN' : false;
}

// Cek apakah user adalah admin (server-side)
export async function isAdminServer(userId: string): Promise<boolean> {
  const userRole = await getUserRoleServer(userId);
  return userRole === 'ADMIN';
}

// Cek apakah user memiliki permission pada resource tertentu (server-side)
export async function hasPermissionServer(
  userId: string, 
  resource: Resource, 
  permission: Permission
): Promise<boolean> {
  const userRole = await getUserRoleServer(userId);
  
  if (!userRole) return false;
  if (userRole === 'ADMIN') return true; // Admin selalu punya akses penuh
  
  return permissionMatrix[userRole][resource].includes(permission);
}

// Export fungsi dari resourceManager
export { canManageResource, canAccessPageServer };
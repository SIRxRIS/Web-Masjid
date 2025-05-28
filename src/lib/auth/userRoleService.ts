// lib/auth/userRoleService.ts
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Role } from './roleTypes';
import { createLogger } from '@/lib/logger';

const logger = createLogger('userRoleService');

export async function getUserRoleServer(userId: string): Promise<Role | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('Profile')
      .select('role')
      .eq('userId', userId)
      .single();

    if (error || !data) {
      logger.error("Error fetching user role", { error, userId });
      return null;
    }

    return data.role as Role;
  } catch (error) {
    logger.error("Error in getUserRoleServer", { error, userId });
    return null;
  }
}
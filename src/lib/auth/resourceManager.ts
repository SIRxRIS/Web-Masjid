// lib/auth/resourceManager.ts
import { Role, Resource } from './roleTypes';
import { getUserRoleServer } from './userRoleService';
import { createLogger } from '@/lib/logger';

const logger = createLogger('resourceManager');

// Definisikan role yang dapat mengelola setiap resource
export const rolesThatCanManage: Record<Resource, Role[]> = {
  'keuangan': ['ADMIN', 'FINANCE'],
  'pengurus': ['ADMIN', 'MANAGEMENT'],
  'konten': ['ADMIN', 'CONTENT'],
  'inventaris': ['ADMIN', 'INVENTORY', 'MANAGEMENT'],
  'dashboard': ['ADMIN', 'FINANCE', 'CONTENT', 'MANAGEMENT', 'INVENTORY', 'VIEWER'],
  'admin': ['ADMIN']
};

// Fungsi generik untuk mengecek apakah user dapat mengelola resource tertentu
export async function canManageResource(userId: string, resource: Resource): Promise<boolean> {
  try {
    const userRole = await getUserRoleServer(userId);
    if (!userRole) return false;
    
    return rolesThatCanManage[resource].includes(userRole);
  } catch (error) {
    logger.error("Error in canManageResource", { error, userId, resource });
    return false;
  }
}

// Fungsi untuk mengecek akses ke halaman
export async function canAccessPageServer(page: string, userId: string): Promise<boolean> {
  try {
    // Mapping halaman ke resource
    const resourceMap: Record<string, Resource> = {
      'dashboard': 'dashboard',
      'keuangan': 'keuangan',
      'pengurus': 'pengurus',
      'konten': 'konten',
      'inventaris': 'inventaris',
      'admin': 'admin'
    };
    
    const resource = resourceMap[page] as Resource;
    if (!resource) return false;
    
    return canManageResource(userId, resource);
  } catch (error) {
    logger.error("Error in canAccessPageServer", { error, userId, page });
    return false;
  }
}
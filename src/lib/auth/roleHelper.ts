// lib/auth/roleHelper.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Definisi tipe untuk role dan permission
export type Role = 'ADMIN' | 'FINANCE' | 'CONTENT' | 'VIEWER' | 'MANAGEMENT' | 'INVENTORY';
export type Permission = 'read' | 'write' | 'delete' | 'approve';
export type Resource = 'keuangan' | 'pengurus' | 'konten' | 'inventaris' | 'dashboard' | 'admin';

const supabase = createClientComponentClient();

// Dapatkan role user dari database
export async function getUserRole(userId: string): Promise<Role | null> {
  try {
    const { data, error } = await supabase
      .from('Profile')
      .select('role')
      .eq('userId', userId)
      .single();

    if (error || !data) {
      console.error("Error fetching user role", error);
      return null;
    }

    return data.role as Role;
  } catch (error) {
    console.error("Error in getUserRole:", error);
    return null;
  }
}

// Dapatkan profile user dari database
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('Profile')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error) {
      console.error("Error fetching user profile", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return null;
  }
}

// Cek apakah user memiliki role yang diperlukan
export async function hasRole(userId: string, requiredRoles: Role[]): Promise<boolean> {
  const userRole = await getUserRole(userId);
  return userRole ? requiredRoles.includes(userRole) || userRole === 'ADMIN' : false;
}

// Cek apakah user adalah admin
export async function isAdmin(userId: string): Promise<boolean> {
  const userRole = await getUserRole(userId);
  return userRole === 'ADMIN';
}

// Cek apakah user bisa mengelola keuangan
export async function canManageFinance(userId: string): Promise<boolean> {
  const userRole = await getUserRole(userId);
  return userRole ? (userRole === 'ADMIN' || userRole === 'FINANCE') : false;
}

// Cek apakah user bisa mengelola konten
export async function canManageContent(userId: string): Promise<boolean> {
  const userRole = await getUserRole(userId);
  return userRole ? (userRole === 'ADMIN' || userRole === 'CONTENT') : false;
}

// Cek apakah user bisa mengelola pengurus
export async function canManagePengurus(userId: string): Promise<boolean> {
  const userRole = await getUserRole(userId);
  return userRole ? (userRole === 'ADMIN' || userRole === 'MANAGEMENT') : false;
}

// Cek apakah user bisa mengelola inventaris
export async function canManageInventory(userId: string): Promise<boolean> {
  const userRole = await getUserRole(userId);
  return userRole ? ['ADMIN', 'INVENTORY', 'MANAGEMENT'].includes(userRole as Role) : false;
}

// Cek apakah user memiliki permission pada resource tertentu
export async function hasPermission(
  userId: string, 
  resource: Resource, 
  permission: Permission
): Promise<boolean> {
  const userRole = await getUserRole(userId);
  
  if (!userRole) return false;
  if (userRole === 'ADMIN') return true; // Admin selalu punya akses penuh
  
  // Definisi permission matrix
  const permissionMatrix: Record<Role, Record<Resource, Permission[]>> = {
    ADMIN: {
      keuangan: ['read', 'write', 'delete', 'approve'],
      pengurus: ['read', 'write', 'delete', 'approve'],
      konten: ['read', 'write', 'delete', 'approve'],
      inventaris: ['read', 'write', 'delete', 'approve'],
      dashboard: ['read', 'write', 'delete', 'approve'],
      admin: ['read', 'write', 'delete', 'approve']
    },
    FINANCE: {
      keuangan: ['read', 'write', 'approve'],
      pengurus: ['read'],
      konten: ['read'],
      inventaris: ['read'],
      dashboard: ['read'],
      admin: []
    },
    CONTENT: {
      keuangan: ['read'],
      pengurus: ['read'],
      konten: ['read', 'write', 'delete'],
      inventaris: ['read'],
      dashboard: ['read'],
      admin: []
    },
    MANAGEMENT: {
      keuangan: ['read'],
      pengurus: ['read', 'write'],
      konten: ['read'],
      inventaris: ['read', 'write'],
      dashboard: ['read'],
      admin: []
    },
    INVENTORY: {
      keuangan: ['read'],
      pengurus: ['read'],
      konten: ['read'],
      inventaris: ['read', 'write', 'delete'],
      dashboard: ['read'],
      admin: []
    },
    VIEWER: {
      keuangan: ['read'],
      pengurus: ['read'],
      konten: ['read'],
      inventaris: ['read'],
      dashboard: ['read'],
      admin: []
    }
  };

  return permissionMatrix[userRole][resource].includes(permission);
}

// Helper untuk mengecek akses ke halaman tertentu
export async function canAccessPage(page: string, userId: string): Promise<boolean> {
  switch (page) {
    case 'dashboard':
      return true; // Semua role bisa akses dashboard
    case 'keuangan':
      return canManageFinance(userId);
    case 'pengurus':
      return canManagePengurus(userId);
    case 'konten':
      return canManageContent(userId);
    case 'inventaris':
      return canManageInventory(userId);
    case 'admin':
      return isAdmin(userId);
    default:
      return false;
  }
}
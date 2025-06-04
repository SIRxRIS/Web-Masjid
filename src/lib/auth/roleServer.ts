// lib/auth/roleServer.ts
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Role, Resource, Permission, permissionMatrix } from "./roleTypes";

// Cache untuk optimasi database query (server-side)
const serverRoleCache = new Map<string, Role>();
const SERVER_CACHE_EXPIRY = 5 * 60 * 1000; // 5 menit
const serverCacheTimestamps = new Map<string, number>();

// Fungsi untuk menginvalidasi cache server
export function invalidateServerRoleCache(userId: string) {
  serverRoleCache.delete(userId);
  serverCacheTimestamps.delete(userId);
}

// Dapatkan role user dari database dengan caching (server-side)
export async function getUserRoleServer(userId: string): Promise<Role | null> {
  try {
    const now = Date.now();
    const timestamp = serverCacheTimestamps.get(userId) || 0;

    // Gunakan cache jika masih valid
    if (serverRoleCache.has(userId) && now - timestamp < SERVER_CACHE_EXPIRY) {
      return serverRoleCache.get(userId) || null;
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("Profile")
      .select("role")
      .eq("userId", userId)
      .single();

    if (error || !data) {
      console.error("Error fetching user role (server)", error);
      return null;
    }

    // Simpan ke cache
    if (data.role) {
      serverRoleCache.set(userId, data.role as Role);
      serverCacheTimestamps.set(userId, now);
    }

    return data.role as Role;
  } catch (error) {
    console.error("Error in getUserRoleServer:", error);
    return null;
  }
}

// Dapatkan profile user dari database (server-side)
export async function getUserProfileServer(userId: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("Profile")
      .select("*")
      .eq("userId", userId)
      .single();

    if (error) {
      console.error("Error fetching user profile (server)", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getUserProfileServer:", error);
    return null;
  }
}

// Cek apakah user memiliki role yang diperlukan (server-side)
export async function hasRoleServer(
  userId: string,
  requiredRoles: Role[]
): Promise<boolean> {
  const userRole = await getUserRoleServer(userId);
  return userRole
    ? requiredRoles.includes(userRole) || userRole === "ADMIN"
    : false;
}

// Cek apakah user adalah admin (server-side)
export async function isAdminServer(userId: string): Promise<boolean> {
  const userRole = await getUserRoleServer(userId);
  return userRole === "ADMIN";
}

// Cek apakah user bisa mengelola keuangan (server-side)
export async function canManageFinanceServer(userId: string): Promise<boolean> {
  const userRole = await getUserRoleServer(userId);
  return userRole ? userRole === "ADMIN" || userRole === "FINANCE" : false;
}

// Cek apakah user bisa mengelola konten (server-side)
export async function canManageContentServer(userId: string): Promise<boolean> {
  const userRole = await getUserRoleServer(userId);
  return userRole ? userRole === "ADMIN" || userRole === "CONTENT" : false;
}

// Cek apakah user bisa mengelola pengurus (server-side)
export async function canManagePengurusServer(
  userId: string
): Promise<boolean> {
  const userRole = await getUserRoleServer(userId);
  return userRole ? userRole === "ADMIN" || userRole === "MANAGEMENT" : false;
}

// Cek apakah user bisa mengelola inventaris (server-side)
export async function canManageInventoryServer(
  userId: string
): Promise<boolean> {
  const userRole = await getUserRoleServer(userId);
  return userRole
    ? ["ADMIN", "INVENTORY", "MANAGEMENT"].includes(userRole as Role)
    : false;
}

// Cek apakah user memiliki permission pada resource tertentu (server-side)
export async function hasPermissionServer(
  userId: string,
  resource: Resource,
  permission: Permission
): Promise<boolean> {
  const userRole = await getUserRoleServer(userId);

  if (!userRole) return false;
  if (userRole === "ADMIN") return true; // Admin selalu punya akses penuh

  return permissionMatrix[userRole][resource].includes(permission);
}

// Helper untuk mengecek akses ke halaman tertentu (server-side)
export async function canAccessPageServer(
  page: string,
  userId: string
): Promise<boolean> {
  switch (page) {
    case "dashboard":
      return true; // Semua role bisa akses dashboard
    case "keuangan":
      return canManageFinanceServer(userId);
    case "pengurus":
      return canManagePengurusServer(userId);
    case "konten":
      return canManageContentServer(userId);
    case "inventaris":
      return canManageInventoryServer(userId);
    case "admin":
      return isAdminServer(userId);
    default:
      return false;
  }
}

// Fungsi helper untuk manajemen resource (dapat diperluas sesuai kebutuhan)
export async function canManageResource(
  userId: string,
  resource: Resource,
  permission: Permission
): Promise<boolean> {
  return hasPermissionServer(userId, resource, permission);
}

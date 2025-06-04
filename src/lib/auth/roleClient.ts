// lib/auth/roleClient.ts
"use client";

import { createClient } from "@/lib/supabase/client";
import { Role, Resource, Permission, permissionMatrix } from "./roleTypes";

// Cache untuk optimasi database query
const roleCache = new Map<string, Role>();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 menit
const cacheTimestamps = new Map<string, number>();

// Fungsi untuk menginvalidasi cache
export function invalidateUserRoleCache(userId: string) {
  roleCache.delete(userId);
  cacheTimestamps.delete(userId);
}

// Dapatkan role user dari database dengan caching
export async function getUserRole(userId: string): Promise<Role | null> {
  try {
    const now = Date.now();
    const timestamp = cacheTimestamps.get(userId) || 0;

    // Gunakan cache jika masih valid
    if (roleCache.has(userId) && now - timestamp < CACHE_EXPIRY) {
      return roleCache.get(userId) || null;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("Profile")
      .select("role")
      .eq("userId", userId)
      .single();

    if (error || !data) {
      console.error("Error fetching user role", error);
      return null;
    }

    // Simpan ke cache
    if (data.role) {
      roleCache.set(userId, data.role as Role);
      cacheTimestamps.set(userId, now);
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
    const supabase = createClient();
    const { data, error } = await supabase
      .from("Profile")
      .select("*")
      .eq("userId", userId)
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
export async function hasRole(
  userId: string,
  requiredRoles: Role[]
): Promise<boolean> {
  const userRole = await getUserRole(userId);
  return userRole
    ? requiredRoles.includes(userRole) || userRole === "ADMIN"
    : false;
}

// Cek apakah user adalah admin
export async function isAdmin(userId: string): Promise<boolean> {
  const userRole = await getUserRole(userId);
  return userRole === "ADMIN";
}

// Cek apakah user bisa mengelola keuangan
export async function canManageFinance(userId: string): Promise<boolean> {
  const userRole = await getUserRole(userId);
  return userRole ? userRole === "ADMIN" || userRole === "FINANCE" : false;
}

// Cek apakah user bisa mengelola konten
export async function canManageContent(userId: string): Promise<boolean> {
  const userRole = await getUserRole(userId);
  return userRole ? userRole === "ADMIN" || userRole === "CONTENT" : false;
}

// Cek apakah user bisa mengelola pengurus
export async function canManagePengurus(userId: string): Promise<boolean> {
  const userRole = await getUserRole(userId);
  return userRole ? userRole === "ADMIN" || userRole === "MANAGEMENT" : false;
}

// Cek apakah user bisa mengelola inventaris
export async function canManageInventory(userId: string): Promise<boolean> {
  const userRole = await getUserRole(userId);
  return userRole
    ? ["ADMIN", "INVENTORY", "MANAGEMENT"].includes(userRole as Role)
    : false;
}

// Cek apakah user memiliki permission pada resource tertentu
export async function hasPermission(
  userId: string,
  resource: Resource,
  permission: Permission
): Promise<boolean> {
  const userRole = await getUserRole(userId);

  if (!userRole) return false;
  if (userRole === "ADMIN") return true; // Admin selalu punya akses penuh

  return permissionMatrix[userRole][resource].includes(permission);
}

// Helper untuk mengecek akses ke halaman tertentu
export async function canAccessPage(
  page: string,
  userId: string
): Promise<boolean> {
  switch (page) {
    case "dashboard":
      return true; // Semua role bisa akses dashboard
    case "keuangan":
      return canManageFinance(userId);
    case "pengurus":
      return canManagePengurus(userId);
    case "konten":
      return canManageContent(userId);
    case "inventaris":
      return canManageInventory(userId);
    case "admin":
      return isAdmin(userId);
    default:
      return false;
  }
}

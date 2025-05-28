// lib/auth/roleTypes.ts

// Definisi tipe untuk role dan permission
export type Role = 'ADMIN' | 'FINANCE' | 'CONTENT' | 'VIEWER' | 'MANAGEMENT' | 'INVENTORY';
export type Permission = 'read' | 'write' | 'delete' | 'approve';
export type Resource = 'keuangan' | 'pengurus' | 'konten' | 'inventaris' | 'dashboard' | 'admin';

// Definisi permission matrix yang digunakan di client dan server
export const permissionMatrix: Record<Role, Record<Resource, Permission[]>> = {
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
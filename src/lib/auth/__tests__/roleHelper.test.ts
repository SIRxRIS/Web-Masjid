// lib/auth/__tests__/roleHelper.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { hasPermissionServer, canAccessPageServer } from '../roleServer';
import { getUserRoleServer } from '../userRoleService';

// Mock untuk getUserRoleServer dari file terpisah
vi.mock('../userRoleService', () => ({
  getUserRoleServer: vi.fn()
}));

describe('Permission Testing', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('Admin memiliki semua permission', async () => {
    // Mock getUserRoleServer untuk mengembalikan 'ADMIN'
    vi.mocked(getUserRoleServer).mockResolvedValue('ADMIN');
    
    // Test hasPermission untuk berbagai resource dan permission
    expect(await hasPermissionServer('user-123', 'keuangan', 'read')).toBe(true);
    expect(await hasPermissionServer('user-123', 'keuangan', 'write')).toBe(true);
    expect(await hasPermissionServer('user-123', 'keuangan', 'delete')).toBe(true);
    expect(await hasPermissionServer('user-123', 'keuangan', 'approve')).toBe(true);
    
    expect(await hasPermissionServer('user-123', 'pengurus', 'read')).toBe(true);
    expect(await hasPermissionServer('user-123', 'konten', 'write')).toBe(true);
    expect(await hasPermissionServer('user-123', 'inventaris', 'delete')).toBe(true);
    expect(await hasPermissionServer('user-123', 'admin', 'approve')).toBe(true);
  });
  
  it('FINANCE hanya bisa mengelola keuangan', async () => {
    // Mock getUserRoleServer untuk mengembalikan 'FINANCE'
    vi.mocked(getUserRoleServer).mockResolvedValue('FINANCE');
    
    // Test hasPermission untuk resource keuangan
    expect(await hasPermissionServer('user-123', 'keuangan', 'read')).toBe(true);
    expect(await hasPermissionServer('user-123', 'keuangan', 'write')).toBe(true);
    expect(await hasPermissionServer('user-123', 'keuangan', 'approve')).toBe(true);
    expect(await hasPermissionServer('user-123', 'keuangan', 'delete')).toBe(false);
    
    // Test hasPermission untuk resource lain
    expect(await hasPermissionServer('user-123', 'pengurus', 'read')).toBe(true);
    expect(await hasPermissionServer('user-123', 'pengurus', 'write')).toBe(false);
    expect(await hasPermissionServer('user-123', 'konten', 'read')).toBe(true);
    expect(await hasPermissionServer('user-123', 'konten', 'write')).toBe(false);
    expect(await hasPermissionServer('user-123', 'admin', 'read')).toBe(false);
  });
  
  it('CONTENT hanya bisa mengelola konten', async () => {
    // Mock getUserRoleServer untuk mengembalikan 'CONTENT'
    vi.mocked(getUserRoleServer).mockResolvedValue('CONTENT');
    
    // Test hasPermission untuk resource konten
    expect(await hasPermissionServer('user-123', 'konten', 'read')).toBe(true);
    expect(await hasPermissionServer('user-123', 'konten', 'write')).toBe(true);
    expect(await hasPermissionServer('user-123', 'konten', 'delete')).toBe(true);
    
    // Test hasPermission untuk resource lain
    expect(await hasPermissionServer('user-123', 'keuangan', 'read')).toBe(true);
    expect(await hasPermissionServer('user-123', 'keuangan', 'write')).toBe(false);
    expect(await hasPermissionServer('user-123', 'pengurus', 'write')).toBe(false);
    expect(await hasPermissionServer('user-123', 'inventaris', 'delete')).toBe(false);
  });
  
  it('canAccessPage memberikan akses yang benar', async () => {
    // Test untuk ADMIN
    vi.mocked(getUserRoleServer).mockResolvedValue('ADMIN');
    expect(await canAccessPageServer('dashboard', 'user-123')).toBe(true);
    expect(await canAccessPageServer('keuangan', 'user-123')).toBe(true);
    expect(await canAccessPageServer('pengurus', 'user-123')).toBe(true);
    expect(await canAccessPageServer('konten', 'user-123')).toBe(true);
    expect(await canAccessPageServer('inventaris', 'user-123')).toBe(true);
    expect(await canAccessPageServer('admin', 'user-123')).toBe(true);
    
    // Test untuk FINANCE
    vi.mocked(getUserRoleServer).mockResolvedValue('FINANCE');
    expect(await canAccessPageServer('dashboard', 'user-123')).toBe(true);
    expect(await canAccessPageServer('keuangan', 'user-123')).toBe(true);
    expect(await canAccessPageServer('pengurus', 'user-123')).toBe(false);
    expect(await canAccessPageServer('admin', 'user-123')).toBe(false);
    
    // Test untuk CONTENT
    vi.mocked(getUserRoleServer).mockResolvedValue('CONTENT');
    expect(await canAccessPageServer('dashboard', 'user-123')).toBe(true);
    expect(await canAccessPageServer('konten', 'user-123')).toBe(true);
    expect(await canAccessPageServer('keuangan', 'user-123')).toBe(false);
    expect(await canAccessPageServer('admin', 'user-123')).toBe(false);
  });
  
  it('Menangani role yang tidak ada', async () => {
    // Mock getUserRoleServer untuk mengembalikan null
    vi.mocked(getUserRoleServer).mockResolvedValue(null);
    
    expect(await hasPermissionServer('user-123', 'keuangan', 'read')).toBe(false);
    expect(await canAccessPageServer('dashboard', 'user-123')).toBe(false);
  });
});
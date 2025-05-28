// lib/auth/authContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserRole } from './roleClient';
import { Role, Resource, Permission, permissionMatrix } from './roleTypes';

// Tipe untuk context
type AuthContextType = {
  role: Role | null;
  loading: boolean;
  hasPermission: (resource: Resource, permission: Permission) => boolean;
  canAccessPage: (page: string) => boolean;
  userId: string | null;
};

// Default value untuk context
const defaultContextValue: AuthContextType = {
  role: null,
  loading: true,
  hasPermission: () => false,
  canAccessPage: () => false,
  userId: null
};

// Buat context
const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Props untuk provider
type AuthProviderProps = {
  children: ReactNode;
  userId: string;
};

// Provider component
export function AuthProvider({ children, userId }: AuthProviderProps) {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Load role saat component mount atau userId berubah
  useEffect(() => {
    async function loadRole() {
      if (!userId) {
        setRole(null);
        setLoading(false);
        return;
      }
      
      const userRole = await getUserRole(userId);
      setRole(userRole);
      setLoading(false);
    }
    
    setLoading(true);
    loadRole();
  }, [userId]);
  
  // Implementasi hasPermission
  const hasPermission = (resource: Resource, permission: Permission): boolean => {
    if (!role) return false;
    if (role === 'ADMIN') return true;
    
    return permissionMatrix[role][resource].includes(permission);
  };
  
  // Implementasi canAccessPage
  const canAccessPage = (page: string): boolean => {
    if (!role) return false;
    
    switch (page) {
      case 'dashboard':
        return true; // Semua role bisa akses dashboard
      case 'keuangan':
        return role === 'ADMIN' || role === 'FINANCE';
      case 'pengurus':
        return role === 'ADMIN' || role === 'MANAGEMENT';
      case 'konten':
        return role === 'ADMIN' || role === 'CONTENT';
      case 'inventaris':
        return role === 'ADMIN' || role === 'INVENTORY' || role === 'MANAGEMENT';
      case 'admin':
        return role === 'ADMIN';
      default:
        return false;
    }
  };
  
  // Value yang akan disediakan oleh context
  const contextValue: AuthContextType = {
    role,
    loading,
    hasPermission,
    canAccessPage,
    userId
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook untuk menggunakan auth context
export const useAuth = () => useContext(AuthContext);
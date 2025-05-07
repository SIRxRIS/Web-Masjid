// middleware.ts di root project
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Cek session dari Supabase Auth
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // Redirect ke halaman login jika tidak ada session
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
  
  // Dapatkan path dari URL
  const pathname = req.nextUrl.pathname;
  const segments = pathname.split('/');
  const mainPath = segments[2]; // /admin/keuangan, /admin/pengurus, dsb
  
  // Cek apakah halaman adalah setup profil, jika ya, izinkan akses
  if (pathname === '/admin/profile/setup') {
    return res;
  }
  
  // Dapatkan profile user dari Supabase
  const { data: profile, error } = await supabase
    .from('Profile')
    .select('*')
    .eq('userId', session.user.id)
    .single();
  
  if (error || !profile) {
    // Profile tidak ditemukan, redirect ke halaman setup profile
    return NextResponse.redirect(new URL('/admin/profile/setup', req.url));
  }
  
  // Cek apakah user memiliki akses ke halaman ini
  if (!canAccessPage(mainPath, profile.role)) {
    // Redirect ke dashboard jika tidak punya akses
    return NextResponse.redirect(new URL('/admin/main/dashboard', req.url));
  }
  
  return res;
}

// Helper untuk memeriksa akses berdasarkan role dan halaman
function canAccessPage(page: string, role: string): boolean {
  if (role === 'ADMIN') return true; // Admin punya akses ke semua halaman
  
  switch (page) {
    case 'dashboard':
    case 'main': 
      return true;
    case 'keuangan':
      return role === 'FINANCE';
    case 'pengurus':
      return role === 'MANAGEMENT';
    case 'konten':
      return role === 'CONTENT';
    case 'inventaris':
      return ['INVENTORY', 'MANAGEMENT'].includes(role);
    default:
      return false;
  }
}

// Konfigurasi matcher untuk rute yang perlu diproteksi
export const config = {
  matcher: [
    '/admin/main/dashboard/:path*',
    '/admin/main/finance/pemasukan/:path*',
    '/admin/main/finance/pengeluaran/:path*',
    '/admin/main/management/daftar-pengurus/:path*',
    '/admin/main/management/tambah-pengurus/:path*',
    '/admin/main/content/:path*',
    '/admin/main/inventaris/:path*',
    '/admin/main/laporan-keuangan/:path*',
    '/admin/main/panduan/:path*',
    '/admin/main/profile/:path*',
  ],
};
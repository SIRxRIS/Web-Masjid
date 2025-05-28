// src/lib/middleware/api-auth.ts
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export type AuthValidationOptions = {
  requireAuth?: boolean; // apakah perlu autentikasi
  requireRole?: string | string[]; // role yang dibutuhkan
  checkUserAccess?: (userId: string, reqData: any) => Promise<boolean>; // fungsi untuk cek akses
};

// Middleware untuk autentikasi & otorisasi API
export async function validateApiAuth(
  req: NextRequest,
  options: AuthValidationOptions = { requireAuth: true }
) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Default response untuk unauthenticated
  const unauthenticatedResponse = NextResponse.json(
    { error: 'Anda tidak terautentikasi' },
    { status: 401 }
  );

  // Default response untuk unauthorized
  const unauthorizedResponse = NextResponse.json(
    { error: 'Anda tidak memiliki izin yang cukup' },
    { status: 403 }
  );

  // Jika memerlukan autentikasi tapi tidak ada session
  if (options.requireAuth && !session) {
    return { authorized: false, response: unauthenticatedResponse, session: null };
  }

  // Jika tidak perlu autentikasi atau tidak ada role yang diperlukan
  if (!options.requireAuth || !options.requireRole) {
    return { authorized: true, response: null, session };
  }

  // Jika perlu role tertentu, cek di database
  const { data: userProfile } = await supabase
    .from('Profile')
    .select('role')
    .eq('userId', session!.user.id)
    .single();

  if (!userProfile) {
    return { authorized: false, response: unauthorizedResponse, session };
  }

  // Validasi role
  const requiredRoles = Array.isArray(options.requireRole)
    ? options.requireRole
    : [options.requireRole];

  const hasRequiredRole = requiredRoles.includes(userProfile.role) || userProfile.role === 'ADMIN';

  if (!hasRequiredRole) {
    return { authorized: false, response: unauthorizedResponse, session };
  }

  // Jika ada fungsi validasi tambahan
  if (options.checkUserAccess) {
    try {
      // Ambil data request
      let reqData;
      if (req.method === 'GET') {
        reqData = Object.fromEntries(new URL(req.url).searchParams);
      } else {
        // Untuk POST/PUT/DELETE
        const contentType = req.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          reqData = await req.clone().json();
        } else if (contentType?.includes('multipart/form-data')) {
          reqData = await req.clone().formData();
        }
      }

      const hasAccess = await options.checkUserAccess(session!.user.id, reqData);
      
      if (!hasAccess) {
        return { authorized: false, response: unauthorizedResponse, session };
      }
    } catch (error) {
      console.error('Error validating user access:', error);
      return {
        authorized: false,
        response: NextResponse.json(
          { error: 'Terjadi kesalahan validasi akses' },
          { status: 500 }
        ),
        session
      };
    }
  }

  // Jika sudah melewati semua validasi
  return { authorized: true, response: null, session };
}

// Contoh penggunaan:
/*
export async function GET(req: NextRequest) {
  const { authorized, response, session } = await validateApiAuth(req, {
    requireAuth: true,
    requireRole: ['ADMIN', 'FINANCE']
  });

  if (!authorized) {
    return response;
  }

  // Lanjutkan dengan kode API
}
*/

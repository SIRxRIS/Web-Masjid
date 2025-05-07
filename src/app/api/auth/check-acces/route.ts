// src/app/api/auth/check-access/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { canAccessPage } from '@/lib/auth/roleHelper';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  
  // Validasi session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.json(
      { error: 'Tidak terautentikasi' },
      { status: 401 }
    );
  }
  
  // Dapatkan parameter dari URL
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page');
  
  if (!page) {
    return NextResponse.json(
      { error: 'Parameter page diperlukan' },
      { status: 400 }
    );
  }
  
  try {
    // Cek apakah user memiliki akses
    const hasAccess = await canAccessPage(page, session.user.id);
    
    return NextResponse.json({ hasAccess });
  } catch (error) {
    console.error('Error checking page access:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
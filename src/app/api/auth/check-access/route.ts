// src/app/api/auth/check-access/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { canAccessPageServer } from '@/lib/auth/roleServer';

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  
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
    const hasAccess = await canAccessPageServer(page, session.user.id);
    
    return NextResponse.json({ hasAccess });
  } catch (error) {
    console.error('Error checking page access:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
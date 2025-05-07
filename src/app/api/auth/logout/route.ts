// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  
  // Sign out dari Supabase
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    return NextResponse.json(
      { error: 'Gagal logout' },
      { status: 500 }
    );
  }
  
  return NextResponse.json({ success: true });
}
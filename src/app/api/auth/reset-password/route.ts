// src/app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// POST: Kirim email reset password
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  
  try {
    const body = await req.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email diperlukan' },
        { status: 400 }
      );
    }
    
    // Kirim email reset password
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/password-reset`,
    });
    
    if (error) {
      console.error('Error sending password reset email:', error);
      return NextResponse.json(
        { error: 'Gagal mengirim email reset password' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Email reset password telah dikirim'
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// PUT: Update password dengan token yang valid
export async function PUT(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  
  try {
    const body = await req.json();
    const { newPassword } = body;
    
    if (!newPassword) {
      return NextResponse.json(
        { error: 'Password baru diperlukan' },
        { status: 400 }
      );
    }
    
    // Update password (token sudah ada di cookies)
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      console.error('Error updating password:', error);
      return NextResponse.json(
        { error: 'Gagal memperbarui password' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Password berhasil diperbarui'
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
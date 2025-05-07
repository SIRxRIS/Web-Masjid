// src/app/api/profile/setup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  // Validasi auth dengan Supabase
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Parse body request
    const body = await req.json();
    const { nama, jabatan, role, fotoUrl, phone, alamat } = body;
    
    // Validasi data yang diperlukan
    if (!nama || !jabatan || !role) {
      return NextResponse.json(
        { error: 'Data tidak lengkap. Nama, jabatan, dan role diperlukan' },
        { status: 400 }
      );
    }
    
    // Cek apakah profil sudah ada
    const { data: existingProfile } = await supabase
      .from('Profile')
      .select('id')
      .eq('userId', session.user.id)
      .single();
      
    if (existingProfile) {
      return NextResponse.json(
        { error: 'Profil sudah dibuat sebelumnya' },
        { status: 400 }
      );
    }
    
    // Buat profil baru
    const { data: profile, error } = await supabase
      .from('Profile')
      .insert({
        userId: session.user.id,
        nama,
        jabatan,
        role,
        fotoUrl,
        phone,
        alamat,
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating profile:', error);
      return NextResponse.json(
        { error: 'Gagal membuat profil' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
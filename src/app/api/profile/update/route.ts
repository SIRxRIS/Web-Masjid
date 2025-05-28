// src/app/api/profile/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
<<<<<<< HEAD
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function PUT(req: NextRequest) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value || null;
        },
        set(name: string, value: string, options?: { maxAge?: number }) {
          cookieStore.set(name, value, options);
        },
        remove(name: string) {
          cookieStore.set(name, '', { maxAge: 0 });
        },
      },
    }
  );

=======
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function PUT(req: NextRequest) {
  // Validasi auth dengan Supabase
  const supabase = await createServerSupabaseClient();
  
>>>>>>> 2ef0df6dd62590907e97af7216c454c620d7834b
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, nama, jabatan, fotoUrl, phone, alamat } = body;
    
    // Validasi ID profil
    if (!id) {
      return NextResponse.json(
        { error: 'ID profil tidak ditemukan' },
        { status: 400 }
      );
    }
    
    // Cek apakah user memiliki akses untuk memperbarui profil ini
    const { data: requestingUser } = await supabase
      .from('Profile')
      .select('role')
      .eq('userId', session.user.id)
      .single();
      
    // Dapatkan profil yang akan diperbarui
    const { data: profileToUpdate } = await supabase
      .from('Profile')
      .select('userId')
      .eq('id', id)
      .single();
      
    // Pastikan user memiliki akses (admin atau profil milik sendiri)
    if (
      !profileToUpdate ||
      (profileToUpdate.userId !== session.user.id && 
       (!requestingUser || requestingUser.role !== 'ADMIN'))
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Siapkan data yang akan diperbarui
    const updateData: any = {};
    if (nama) updateData.nama = nama;
    if (jabatan) updateData.jabatan = jabatan;
    if (fotoUrl) updateData.fotoUrl = fotoUrl;
    if (phone !== undefined) updateData.phone = phone;
    if (alamat !== undefined) updateData.alamat = alamat;
    
    // Update profil
    const { data: updatedProfile, error } = await supabase
      .from('Profile')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json(
        { error: 'Gagal memperbarui profil' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
// src/app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET: Dapatkan semua pengguna (hanya untuk admin)
export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  
  // Validasi session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Cek apakah user adalah admin
  const { data: currentUserProfile, error: profileError } = await supabase
    .from('Profile')
    .select('role')
    .eq('userId', session.user.id)
    .single();
    
  if (profileError || !currentUserProfile || currentUserProfile.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Dapatkan parameter paginasi dari URL
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  
  const offset = (page - 1) * limit;
  
  try {
    // Query untuk total data (untuk paginasi)
    const { count } = await supabase
      .from('Profile')
      .select('*', { count: 'exact', head: true })
      .ilike('nama', `%${search}%`);
      
    // Query untuk data user dengan paginasi
    const { data: users, error } = await supabase
      .from('Profile')
      .select('*')
      .ilike('nama', `%${search}%`)
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1);
      
    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        { error: 'Gagal mengambil data pengguna' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      data: users,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// POST: Update role pengguna oleh admin
export async function PUT(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  
  // Validasi session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Cek apakah user adalah admin
  const { data: currentUserProfile, error: profileError } = await supabase
    .from('Profile')
    .select('role')
    .eq('userId', session.user.id)
    .single();
    
  if (profileError || !currentUserProfile || currentUserProfile.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  try {
    const body = await req.json();
    const { profileId, role, jabatan } = body;
    
    if (!profileId || !role) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 }
      );
    }
    
    // Update profil pengguna
    const updateData: any = {};
    if (role) updateData.role = role;
    if (jabatan) updateData.jabatan = jabatan;
    
    const { data: updatedProfile, error } = await supabase
      .from('Profile')
      .update(updateData)
      .eq('id', profileId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating user profile:', error);
      return NextResponse.json(
        { error: 'Gagal memperbarui profil pengguna' },
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
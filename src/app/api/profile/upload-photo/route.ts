// src/app/api/profile/upload-photo/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  // Validasi auth dengan Supabase
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Dapatkan formData dari request
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const profileId = formData.get("profileId") as string;

    if (!file) {
      return NextResponse.json(
        { error: "Tidak ada file yang diunggah" },
        { status: 400 }
      );
    }

    // Cek apakah user memiliki akses untuk memperbarui profil ini
    const { data: profile } = await supabase
      .from("Profile")
      .select("userId, role")
      .eq("id", profileId)
      .single();

    if (
      !profile ||
      (profile.userId !== session.user.id && profile.role !== "ADMIN")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validasi tipe file (hanya izinkan gambar)
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Format file tidak didukung. Silakan unggah file JPG atau PNG",
        },
        { status: 400 }
      );
    }

    // Validasi ukuran file (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Ukuran file terlalu besar. Maksimum 2MB" },
        { status: 400 }
      );
    }

    // Upload file ke Supabase Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `profile-photos/${fileName}`;

    // Konversi File menjadi ArrayBuffer untuk diupload
    const arrayBuffer = await file.arrayBuffer();

    // Upload ke Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("public")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return NextResponse.json(
        { error: "Gagal mengunggah file" },
        { status: 500 }
      );
    }

    // Dapatkan URL publik file
    const { data: publicUrl } = supabase.storage
      .from("public")
      .getPublicUrl(filePath);

    // Update profil dengan URL foto baru
    const { data: updatedProfile, error: updateError } = await supabase
      .from("Profile")
      .update({ fotoUrl: publicUrl.publicUrl })
      .eq("id", profileId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating profile with photo URL:", updateError);
      return NextResponse.json(
        { error: "Gagal memperbarui profil dengan foto baru" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      fotoUrl: publicUrl.publicUrl,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

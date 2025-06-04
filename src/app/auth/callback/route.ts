// src/app/auth/callback/route.ts
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  // Handle OAuth error
  if (error) {
    console.error("OAuth Error:", error, errorDescription);
    return NextResponse.redirect(
      new URL(
        `/admin/login?error=${encodeURIComponent(
          errorDescription || "Login gagal"
        )}`,
        request.url
      )
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL(
        "/admin/login?error=" +
          encodeURIComponent("Kode autentikasi tidak ditemukan"),
        request.url
      )
    );
  }

  const supabase = await createServerSupabaseClient();

  try {
    // Exchange code for session
    const { data: authData, error: authError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (authError) {
      console.error("Auth exchange error:", authError);
      return NextResponse.redirect(
        new URL(
          `/admin/login?error=${encodeURIComponent("Gagal memproses login")}`,
          request.url
        )
      );
    }

    if (!authData.user?.email) {
      console.error("No user email from OAuth");
      return NextResponse.redirect(
        new URL(
          `/admin/login?error=${encodeURIComponent(
            "Data pengguna tidak lengkap"
          )}`,
          request.url
        )
      );
    }

    // Validasi Email Whitelist
    const whitelist = await validateEmailWhitelist(
      supabase,
      authData.user.email
    );

    if (!whitelist) {
      console.log(`Unauthorized login attempt: ${authData.user.email}`);
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/admin/unauthorized", request.url));
    }

    // Setup atau update profile
    const profile = await setupUserProfile(supabase, authData.user, whitelist);

    if (!profile) {
      await supabase.auth.signOut();
      return NextResponse.redirect(
        new URL(
          `/admin/login?error=${encodeURIComponent(
            "Gagal membuat profil pengguna"
          )}`,
          request.url
        )
      );
    }

    // Tentukan redirect berdasarkan kelengkapan profil
    const redirectUrl = determineRedirectUrl(profile);
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(
      new URL(
        `/admin/login?error=${encodeURIComponent("Terjadi kesalahan sistem")}`,
        request.url
      )
    );
  }
}

// Helper Functions
async function validateEmailWhitelist(supabase: any, email: string) {
  try {
    const { data: whitelist, error } = await supabase
      .from("email_whitelist")
      .select("*")
      .eq("email", email)
      .eq("isActive", true)
      .maybeSingle();

    if (error) {
      console.error("Error checking email whitelist:", error);
      return null;
    }

    return whitelist;
  } catch (error) {
    console.error("Whitelist validation error:", error);
    return null;
  }
}

async function setupUserProfile(supabase: any, user: any, whitelist: any) {
  try {
    // Cek apakah profile sudah ada
    let { data: profile, error: profileError } = await supabase
      .from("profile")
      .select("*")
      .eq("userId", user.id)
      .maybeSingle();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Error fetching profile:", profileError);
      return null;
    }

    // Jika profile belum ada, buat baru
    if (!profile) {
      // PERBAIKAN: Generate UUID secara manual atau biarkan database yang handle
      const { data: newProfile, error: createError } = await supabase
        .from("profile")
        .insert([
          {
            // PERBAIKAN: Hapus field id, biarkan database generate UUID
            userId: user.id,
            nama: whitelist.nama,
            jabatan: whitelist.jabatan,
            role: whitelist.role,
            fotoUrl: user.user_metadata?.avatar_url || "",
            phone: "",
            alamat: "",
            is_profile_complete: false,
            // PERBAIKAN: Hapus createdAt dan updatedAt, biarkan database yang handle
          },
        ])
        .select()
        .single();

      if (createError) {
        console.error("Error creating profile:", createError);
        return null;
      }

      return newProfile;
    }

    // Update profile jika ada perubahan role/jabatan
    if (
      profile.role !== whitelist.role ||
      profile.jabatan !== whitelist.jabatan
    ) {
      const { error: updateError } = await supabase
        .from("profile")
        .update({
          role: whitelist.role,
          jabatan: whitelist.jabatan,
          // PERBAIKAN: Hapus updatedAt manual, biarkan @updatedAt yang handle
        })
        .eq("userId", user.id);

      if (updateError) {
        console.warn("Failed to update profile:", updateError);
      } else {
        profile.role = whitelist.role;
        profile.jabatan = whitelist.jabatan;
      }
    }

    return profile;
  } catch (error) {
    console.error("Profile setup error:", error);
    return null;
  }
}

function determineRedirectUrl(profile: any): string {
  if (!profile) {
    return "/admin/profile/setup";
  }

  const isComplete = checkProfileCompleteness(profile);

  if (!isComplete) {
    return "/admin/main/profile?setup=true";
  }

  return "/admin/main/dashboard";
}

function checkProfileCompleteness(profile: any): boolean {
  const requiredFields = ["nama", "jabatan", "role"];
  const recommendedFields = ["phone", "alamat", "fotoUrl"];

  const hasRequiredFields = requiredFields.every(
    (field) =>
      profile[field] !== null &&
      profile[field] !== undefined &&
      profile[field] !== ""
  );

  const hasRecommendedField = recommendedFields.some(
    (field) =>
      profile[field] !== null &&
      profile[field] !== undefined &&
      profile[field] !== ""
  );

  return hasRequiredFields && hasRecommendedField;
}

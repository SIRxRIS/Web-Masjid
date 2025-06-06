// middleware.ts di root project
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set(name, value);
          res.cookies.set(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set(name, "");
          res.cookies.set(name, "", options);
        },
      },
    }
  );

  // Refresh session untuk memastikan token terbaru
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Jika tidak ada session, redirect ke login
  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Cek apakah token hampir kedaluwarsa (kurang dari 1 jam)
  const expiresAt = session.expires_at;
  const now = Math.floor(Date.now() / 1000);
  const oneHour = 60 * 60;

  // Jika token hampir kedaluwarsa, refresh token
  if (expiresAt && expiresAt - now < oneHour) {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error("Error refreshing session:", error);
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
      if (data.session) {
        res = NextResponse.next();
      }
    } catch (error) {
      console.error("Error in session refresh:", error);
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Dapatkan path dari URL
  const pathname = req.nextUrl.pathname;
  const segments = pathname.split("/");
  const mainPath = segments[2]; // /admin/keuangan, /admin/pengurus, dsb

  // Cek apakah halaman adalah setup profil, jika ya, izinkan akses
  if (pathname === "/admin/profile/setup") {
    return res;
  }

  // PERBAIKAN: Gunakan nama tabel yang benar
  const { data: profile, error } = await supabase
    .from("profile") // UBAH DARI "Profile" ke "profile"
    .select("*")
    .eq("userId", session.user.id)
    .single();

  if (error || !profile) {
    // Profile tidak ditemukan, redirect ke halaman setup profile
    return NextResponse.redirect(new URL("/admin/profile/setup", req.url));
  }

  // Cek kelengkapan profil
  const isProfileComplete = checkProfileCompleteness(profile);

  // Jika profil belum lengkap dan bukan sedang mengakses halaman profil, redirect ke halaman profil
  if (!isProfileComplete && !pathname.includes("/admin/main/profile")) {
    return NextResponse.redirect(new URL("/admin/main/profile", req.url));
  }

  // Cek apakah user memiliki akses ke halaman ini
  if (!canAccessPage(mainPath, profile.role)) {
    // Redirect ke dashboard jika tidak punya akses
    return NextResponse.redirect(new URL("/admin/main/dashboard", req.url));
  }

  return res;
}

// Fungsi untuk memeriksa kelengkapan profil
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

// Helper untuk memeriksa akses berdasarkan role dan halaman
function canAccessPage(page: string, role: string): boolean {
  if (role === "SUPER_ADMIN") return true; // PERBAIKAN: Gunakan SUPER_ADMIN, bukan ADMIN

  switch (page) {
    case "dashboard":
    case "main":
      return true;
    case "keuangan":
      return role === "FINANCE";
    case "pengurus":
      return role === "MANAGEMENT";
    case "konten":
      return role === "CONTENT";
    case "inventaris":
      return ["INVENTORY", "MANAGEMENT"].includes(role);
    default:
      return false;
  }
}

// Konfigurasi matcher untuk rute yang perlu diproteksi
export const config = {
  matcher: ["/admin/main/:path*"],
};

// src/app/admin/main/profile/page.tsx
import { AppSidebar } from "@/components/admin/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/admin/layout/profile/site-header";
import ProfilePage from "@/components/admin/layout/profile/page";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePageWithLayout() {
  const supabase = await createServerSupabaseClient();

  // Proteksi route dan ambil user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Ambil data profile
  const { data: profile, error } = await supabase
    .from("Profile")
    .select("*")
    .eq("userId", user.id)
    .single();

  if (error) {
    console.error("Profile fetch error:", error);
  }

  // Siapkan initial data
  const initialProfile = {
    namaLengkap: profile?.nama || "",
    email: user.email || "",
    nomorTelepon: profile?.phone || "",
    alamat: profile?.alamat || "",
    jabatan: profile?.jabatan || "",
    role: profile?.role || "",
    avatarUrl: profile?.fotoUrl || "",
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <ProfilePage user={user} initialProfile={initialProfile} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

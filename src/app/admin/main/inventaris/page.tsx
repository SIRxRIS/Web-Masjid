import { AppSidebar } from "@/components/admin/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/admin/layout/inventaris/site-header";
import InventarisClientComponent from "./InventarisClientComponent";
import { canAccessPageServer } from "@/lib/auth/roleServer";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AuthProvider } from "@/lib/auth/authContext";

export default async function Page() {
  // Dapatkan session dari server
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // Redirect ke login jika tidak ada session
  if (!session) {
    redirect("/admin/login");
  }
  
  // Cek akses ke halaman inventaris
  const hasAccess = await canAccessPageServer("inventaris", session.user.id);
  
  // Redirect jika tidak memiliki akses
  if (!hasAccess) {
    redirect("/admin/unauthorized");
  }
  
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <AuthProvider userId={session.user.id}>
          <InventarisClientComponent />
        </AuthProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
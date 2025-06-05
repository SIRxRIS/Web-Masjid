// src/app/admin/main/inventaris/page.tsx
import { AppSidebar } from "@/components/admin/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/admin/layout/inventaris/site-header";
import InventarisClientComponent from "./InventarisClientComponent";

export default async function Page() {
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
        <InventarisClientComponent />
      </SidebarInset>
    </SidebarProvider>
  );
}

import { AppSidebar } from "@/components/admin/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/admin/layout/inventaris/site-header";

export default function Page() {
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
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              🚧 Dalam Pengembangan
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Halaman ini sedang dalam tahap pengembangan. Silakan kembali lagi nanti.
            </p>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
import { AppSidebar } from "@/components/admin/layout/app-sidebar";
import { DataTable } from "@/components/admin/layout/finance/pengeluaran/table-pengeluaran";
import { SiteHeader } from "@/components/admin/layout/finance/pengeluaran/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getPengeluaranData } from "@/lib/services/pengeluaran/pengeluaran";

export default async function Page() {
  const [rawPengeluaranData] = await Promise.all([
    getPengeluaranData(),
  ]);
  const pengeluaranData = rawPengeluaranData.map((item, index) => ({
    ...item,
    no: index + 1,
    keterangan: item.keterangan || undefined
  }));

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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <DataTable 
                data={pengeluaranData}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
import { AppSidebar } from "@/components/layout/admin/app-sidebar";
import { DataTable } from "@/components/layout/finance/pemasukan/table-donation";
import { SiteHeader } from "@/components/layout/finance/pemasukan/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getDonaturData } from "@/lib/services/donatur";
import donasiKhususData from "@/components/admin/finance/pemasukan/donation-records.json";
import kotakAmalData from "@/components/admin/finance/pemasukan/data-kotak-amal.json";

export default async function Page() {
  const donaturData = await getDonaturData();

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
              <DataTable
                data={donaturData}
                kotakAmalData={kotakAmalData}
                donasiKhususData={donasiKhususData}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

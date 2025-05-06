import { AppSidebar } from "@/components/admin/layout/app-sidebar";
import { DataTable } from "@/components/admin/layout/finance/pemasukan/table-donation";
import { SiteHeader } from "@/components/admin/layout/finance/pemasukan/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getDonaturData } from "@/lib/services/supabase/donatur";
import { getDonasiKhusus } from "@/lib/services/supabase/donasi-khusus";
import { getKotakAmalData } from "@/lib/services/supabase/kotak-amal";
import { getKotakAmalMasjidData } from "@/lib/services/supabase/kotak-amal-masjid";

export default async function Page() {
  const [donaturData, donasiKhususData, kotakAmalData, kotakAmalMasjidData] = await Promise.all([
    getDonaturData(),
    getDonasiKhusus(),
    getKotakAmalData(),
    getKotakAmalMasjidData()
  ]);

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
                data={donaturData}
                kotakAmalData={kotakAmalData}
                donasiKhususData={donasiKhususData}
                kotakAmalMasjidData={kotakAmalMasjidData}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

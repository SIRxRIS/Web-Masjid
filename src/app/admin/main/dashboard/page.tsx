// src/app/admin/main/dashboard/page.tsx
import { AppSidebar } from "@/components/admin/layout/app-sidebar";
import { SectionCards } from "@/components/admin/layout/dashboard/section-cards";
import { SiteHeader } from "@/components/admin/layout/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ChartSaldo } from "@/components/admin/layout/dashboard/chart-saldo";

// Menggunakan services yang sudah ada (diubah untuk server-side)
import { getDashboardData } from "@/lib/services/supabase/dashboard/dashboard";
import { getDonasiBulananAction } from "@/lib/services/supabase/dashboard/actions";

// Server function untuk mendapatkan data chart
async function getChartData() {
  const tahunSekarang = new Date().getFullYear();
  const dataBulan = [];

  const namaBulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // Menggunakan service yang sudah ada
  for (let i = 1; i <= 12; i++) {
    const totalDonasi = await getDonasiBulananAction(tahunSekarang, i);
    dataBulan.push({
      month: namaBulan[i - 1],
      saldo: totalDonasi,
    });
  }

  // Hitung pertumbuhan bulan ini
  const bulanIni = new Date().getMonth() + 1;
  let pertumbuhanPersentase = 0;

  if (bulanIni > 1) {
    const donasiSekarang = dataBulan[bulanIni - 1].saldo;
    const donasiSebelumnya = dataBulan[bulanIni - 2].saldo;

    pertumbuhanPersentase =
      donasiSebelumnya === 0
        ? 100
        : parseFloat(
            (
              ((donasiSekarang - donasiSebelumnya) / donasiSebelumnya) *
              100
            ).toFixed(1)
          );
  }

  return {
    chartData: dataBulan,
    pertumbuhanPersentase,
  };
}

export default async function Page() {
  const currentDate = new Date();
  const tahun = currentDate.getFullYear();
  const bulan = currentDate.getMonth() + 1;

  // Menggunakan services yang sudah ada
  const dashboardData = await getDashboardData(tahun, bulan);
  const chartInfo = await getChartData();

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
              <div className="px-4 lg:px-6">
                <SectionCards initialData={dashboardData} />
              </div>
              <div className="px-4 lg:px-6">
                <ChartSaldo
                  initialChartData={chartInfo.chartData}
                  initialPertumbuhan={chartInfo.pertumbuhanPersentase}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

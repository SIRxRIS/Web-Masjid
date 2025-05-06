"use client";

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardData } from "@/lib/services/supabase/dashboard/dashboard";

export function SectionCards() {
  const [dashboardData, setDashboardData] = useState({
    saldo: 0,
    pertumbuhanDanaBulanan: 0,
    jumlahDonatur: 0,
    pertumbuhanDonatur: 0,
    totalKontenPublished: 0,
    pertumbuhanDanaTahunan: 0,
    totalGabunganKotakAmal: 0,
    donasiBulanan: 0,
    pertumbuhanDonasi: 0,
    totalPengeluaran: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentDate = new Date();
        const data = await getDashboardData(currentDate.getFullYear(), currentDate.getMonth() + 1);
        setDashboardData({
          saldo: data.saldo,
          pertumbuhanDanaBulanan: data.pertumbuhanDanaBulanan,
          jumlahDonatur: data.jumlahDonatur,
          pertumbuhanDonatur: data.pertumbuhanDonatur,
          totalKontenPublished: data.totalKontenPublished,
          pertumbuhanDanaTahunan: data.pertumbuhanDanaTahunan,
          totalGabunganKotakAmal: data.totalGabunganKotakAmal,
          donasiBulanan: data.donasiBulanan,
          pertumbuhanDonasi: data.pertumbuhanDonasi,
          totalPengeluaran: data.totalPengeluaran
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Saldo */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Saldo</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rp{dashboardData.saldo.toLocaleString('id-ID')}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +{dashboardData.pertumbuhanDanaBulanan}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Pertumbuhan Saldo <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Saldo dari bulan ke bulan</div>
        </CardFooter>
      </Card>

      {/* Total Donatur */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Donatur</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dashboardData.jumlahDonatur}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +{dashboardData.pertumbuhanDonatur}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Pertumbuhan donatur <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Donatur aktif bulan ini</div>
        </CardFooter>
      </Card>

      {/* Konten Aktif */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Konten Aktif</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dashboardData.totalKontenPublished}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +2
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Konten bulan ini <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Program masjid aktif</div>
        </CardFooter>
      </Card>

      {/* Pertumbuhan Dana */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pertumbuhan Dana</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dashboardData.pertumbuhanDanaTahunan}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +{dashboardData.pertumbuhanDanaBulanan}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Peningkatan dana <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Dibanding tahun lalu</div>
        </CardFooter>
      </Card>

      {/* Total Kotak Amal */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Kotak Amal</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rp{dashboardData.totalGabunganKotakAmal.toLocaleString('id-ID')}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +8.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Minggu ini <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Dari kotak amal Jumat</div>
        </CardFooter>
      </Card>

      {/* Donasi Bulanan */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Donasi Bulanan</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rp{dashboardData.donasiBulanan.toLocaleString('id-ID')}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +{dashboardData.pertumbuhanDonasi}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Donasi rutin <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Donasi bulan ini</div>
        </CardFooter>
      </Card>

      {/* Pengeluaran Terkini */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pengeluaran Terkini</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rp{dashboardData.totalPengeluaran.toLocaleString('id-ID')}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -12.3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Pengeluaran menurun <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">Dibanding bulan lalu</div>
        </CardFooter>
      </Card>

      {/* Total Pengunjung */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Pengunjung</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            25
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +10.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Pengunjung meningkat <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Rata-rata mingguan</div>
        </CardFooter>
      </Card>
    </div>
  );
}